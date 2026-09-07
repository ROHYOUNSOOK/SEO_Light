// Google PageSpeed Insights API 로 Lighthouse 실행 (구글 서버에서 검사)
// - Vercel 같은 서버리스 환경에서 Chrome 없이 동작
// - API 키 없이도 동작하지만 할당량이 적음 → PSI_API_KEY 환경변수 권장
//   키 발급: https://developers.google.com/speed/docs/insights/v5/get-started

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

// PSI 서버 쪽 일시 오류 ("Something went wrong" 등) 는 한 번 더 시도하면 성공하는 경우가 많음
const TRANSIENT = /Something went wrong|INTERNAL|Internal error|backend|timed out|HTTP 5\d\d/i;

export async function runPsi(url, device, categories, { apiKey = process.env.PSI_API_KEY, budgetMs = 55000 } = {}) {
  const deadline = Date.now() + budgetMs;
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const remaining = deadline - Date.now();
    if (attempt > 1 && remaining < 15000) break;
    try {
      return await runPsiOnce(url, device, categories, { apiKey, timeoutMs: remaining });
    } catch (e) {
      lastErr = e;
      if (!TRANSIENT.test(e.message)) throw e;
    }
  }
  throw lastErr;
}

async function runPsiOnce(url, device, categories, { apiKey, timeoutMs }) {
  const params = new URLSearchParams();
  params.set('url', url);
  params.set('strategy', device === 'desktop' ? 'desktop' : 'mobile');
  params.set('locale', 'ko');
  for (const c of categories) params.append('category', c.toUpperCase().replace('-', '_'));
  if (apiKey) params.set('key', apiKey);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(`${PSI_ENDPOINT}?${params}`, { signal: ctrl.signal });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('검사 시간이 초과되었습니다. 페이지가 너무 느리거나 PageSpeed 서버가 혼잡합니다. 잠시 후 다시 시도하세요.');
    throw new Error('PageSpeed Insights API에 연결할 수 없습니다: ' + e.message);
  } finally {
    clearTimeout(timer);
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`PageSpeed Insights 응답을 해석할 수 없습니다 (HTTP ${res.status}).`);
  }

  if (!res.ok || json.error) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    if (/quota|rate/i.test(msg)) {
      throw new Error(
        apiKey
          ? 'PageSpeed API 일일 할당량(기본 25,000회)을 초과했습니다. 잠시 후 다시 시도하세요.'
          : 'PSI_API_KEY 환경변수가 설정되지 않았습니다. Google Cloud Console에서 PageSpeed Insights API 키를 발급해 설정하세요. (README 참고)',
      );
    }
    if (/API key not valid|invalid.*key/i.test(msg)) throw new Error('PSI_API_KEY가 올바르지 않습니다. Google Cloud Console에서 PageSpeed Insights API가 활성화된 프로젝트의 키인지 확인하세요.');
    if (/FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|net::/i.test(msg)) throw new Error('페이지를 불러올 수 없습니다. URL이 공개되어 있고 정상 응답하는지 확인하세요.');
    if (/NOT_HTML/i.test(msg)) throw new Error('HTML 페이지가 아닙니다. 웹 페이지 URL을 입력하세요.');
    if (/Something went wrong/i.test(msg)) {
      throw new Error(
        'Google PageSpeed 서버에서 이 페이지의 Lighthouse 실행이 실패했습니다 (Something went wrong). ' +
          '보통 사이트가 Google 봇/해외 IP 접근을 차단하거나, 로그인·보안 확인 페이지로 리다이렉트되거나, 로드가 너무 느릴 때 발생합니다. ' +
          '잠시 후 다시 시도하거나 데스크톱 모드로 바꿔 보세요. 같은 URL을 https://pagespeed.web.dev 에서도 실패하면 사이트 쪽 차단입니다.',
      );
    }
    throw new Error('PageSpeed Insights 오류: ' + msg);
  }

  const lhr = json.lighthouseResult;
  if (!lhr) throw new Error('Lighthouse 결과가 비어 있습니다.');
  if (lhr.runtimeError?.code && lhr.runtimeError.code !== 'NO_ERROR') throw new Error(lhr.runtimeError.message);
  return lhr;
}

export function psiReportUrl(url, device) {
  return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&form_factor=${device === 'desktop' ? 'desktop' : 'mobile'}&hl=ko`;
}
