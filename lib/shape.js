// Lighthouse 결과(LHR)를 화면용 데이터로 가공하는 공용 모듈
// - 로컬 서버(server.js)와 Vercel 함수(api/audit.js)가 함께 사용
import { GUIDE, CATEGORY_LABEL, severityOf } from './guide.js';

export const ALLOWED_CATEGORIES = ['seo', 'performance', 'accessibility', 'best-practices'];

export function normalizeUrl(input) {
  let raw = String(input || '').trim();
  if (!raw) throw new Error('URL을 입력하세요.');
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let u;
  try {
    u = new URL(raw);
  } catch {
    throw new Error('올바른 URL 형식이 아닙니다.');
  }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('http/https URL만 검사할 수 있습니다.');
  if (/^(localhost|127\.|10\.|192\.168\.|0\.0\.0\.0)/.test(u.hostname)) {
    throw new Error('공개된 인터넷 URL만 검사할 수 있습니다. (localhost/사설망 불가)');
  }
  return u.href;
}

export function parseRequest(body) {
  const url = normalizeUrl(body?.url);
  const device = body?.device === 'desktop' ? 'desktop' : 'mobile';
  let categories = Array.isArray(body?.categories) ? body.categories.filter((c) => ALLOWED_CATEGORIES.includes(c)) : [];
  if (!categories.includes('seo')) categories.unshift('seo');
  return { url, device, categories };
}

// details.items 의 셀 값을 화면에 표시 가능한 문자열로 변환
function cellToText(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    if (v.type === 'node') return v.snippet || v.selector || v.nodeLabel || '';
    if (v.type === 'url' || v.type === 'link') return v.value || v.url || v.text || '';
    if (v.type === 'code') return v.value || '';
    if (v.type === 'source-location') return `${v.url}:${v.line}:${v.column}`;
    if (v.type === 'numeric' || v.type === 'bytes' || v.type === 'ms') return String(v.value ?? '');
    if ('value' in v) return cellToText(v.value);
    if ('text' in v) return String(v.text);
    if ('url' in v) return String(v.url);
  }
  return '';
}

function formatByType(text, heading) {
  const t = heading?.valueType || heading?.itemType;
  const n = Number(text);
  if (text === '' || Number.isNaN(n)) return text;
  if (t === 'bytes') return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`;
  if (t === 'ms' || t === 'timespanMs') return `${Math.round(n).toLocaleString()} ms`;
  return text;
}

export function extractItems(details) {
  const empty = { headings: [], rows: [], total: 0 };
  if (!details || typeof details !== 'object') return empty;
  const type = details.type;

  // checklist: items 가 { key: {label, value} } 형태의 객체
  if (type === 'checklist' && details.items && !Array.isArray(details.items)) {
    const rows = Object.values(details.items)
      .filter((it) => it && typeof it === 'object')
      .map((it) => [String(it.label || ''), it.value ? '통과' : '실패']);
    return rows.length ? { headings: [{ key: 'label', label: '검사 항목' }, { key: 'value', label: '결과' }], rows, total: rows.length } : empty;
  }
  // list: 하위 항목 중 첫 번째 표(table/opportunity)를 사용
  if (type === 'list' && Array.isArray(details.items)) {
    const inner = details.items.find((it) => it && ['table', 'opportunity'].includes(it.type)) ||
      details.items.find((it) => it?.value && ['table', 'opportunity'].includes(it.value.type))?.value;
    return inner ? extractItems(inner) : empty;
  }
  if (!['table', 'opportunity'].includes(type) || !Array.isArray(details.items)) return empty;

  const headings = (details.headings || [])
    .filter((h) => h && h.key && h.valueType !== 'thumbnail' && h.itemType !== 'thumbnail')
    .map((h) => ({ key: h.key, label: typeof h.label === 'string' ? h.label : h.text || h.key }));
  const rows = details.items.slice(0, 25).map((item) =>
    headings.map((h) => {
      const heading = (details.headings || []).find((x) => x.key === h.key);
      return formatByType(cellToText(item[h.key]), heading);
    }),
  );
  return { headings, rows, total: details.items.length };
}

/**
 * @param lhr Lighthouse 결과 객체
 * @param opts { device, categories, engine: 'psi'|'local', reportUrl }
 */
export function shapeResult(lhr, { device, categories, engine, reportUrl }) {
  const scores = {};
  const issues = [];

  for (const catId of categories) {
    const cat = lhr.categories?.[catId];
    if (!cat) continue;
    scores[catId] = { label: CATEGORY_LABEL[catId] || cat.title, score: cat.score === null || cat.score === undefined ? null : Math.round(cat.score * 100) };

    for (const ref of cat.auditRefs || []) {
      const audit = lhr.audits?.[ref.id];
      if (!audit) continue;
      const mode = audit.scoreDisplayMode;
      const score = audit.score;

      let status;
      if (mode === 'manual') status = 'manual';
      else if (mode === 'error') status = 'error';
      else if (mode === 'notApplicable' || mode === 'informative') continue;
      else if (score === null || score === undefined) continue;
      else if (score < 0.5) status = 'fail';
      else if (score < 0.9) status = 'warn';
      else continue; // 통과

      // SEO 카테고리가 아닌 곳의 manual 항목은 노이즈가 많아 제외
      if (status === 'manual' && catId !== 'seo') continue;

      const guide = GUIDE[ref.id];
      const { headings, rows, total } = extractItems(audit.details);
      issues.push({
        id: ref.id,
        category: catId,
        categoryLabel: CATEGORY_LABEL[catId] || cat.title,
        status,
        severity: status === 'manual' ? 'info' : severityOf(catId, score, ref.weight),
        weight: ref.weight,
        score: score === null || score === undefined ? null : Math.round(score * 100),
        title: guide?.title || audit.title,
        lhTitle: audit.title,
        description: audit.description,
        displayValue: audit.displayValue || '',
        why: guide?.why || '',
        fix: guide?.fix || [],
        code: guide?.code || '',
        hasGuide: Boolean(guide),
        headings,
        rows,
        totalItems: total ?? rows.length,
      });
    }
  }

  const rank = { high: 0, medium: 1, low: 2, info: 3 };
  issues.sort((a, b) => rank[a.severity] - rank[b.severity] || (b.weight || 0) - (a.weight || 0));

  const summary = { high: 0, medium: 0, low: 0, info: 0 };
  for (const i of issues) summary[i.severity]++;

  const shot = lhr.audits?.['final-screenshot']?.details?.data || null;
  const m = lhr.audits?.metrics?.details?.items?.[0] || null;

  return {
    requestedUrl: lhr.requestedUrl,
    finalUrl: lhr.finalDisplayedUrl || lhr.finalUrl || lhr.requestedUrl,
    fetchTime: lhr.fetchTime,
    lighthouseVersion: lhr.lighthouseVersion,
    engine,
    device,
    scores,
    summary,
    issues,
    screenshot: shot,
    metrics: m
      ? { lcp: m.largestContentfulPaint, cls: m.cumulativeLayoutShift, tbt: m.totalBlockingTime, fcp: m.firstContentfulPaint, si: m.speedIndex }
      : null,
    reportUrl: reportUrl || null,
  };
}
