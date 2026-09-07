// 로컬 개발 서버
//   npm start              → PageSpeed Insights API 사용 (Vercel 배포와 동일한 동작)
//   ENGINE=local npm start → 내 PC의 Chrome 으로 Lighthouse 직접 실행 (전체 HTML 보고서 저장)
import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseRequest, shapeResult } from './lib/shape.js';
import { runPsi, psiReportUrl } from './lib/psi.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const ENGINE = process.env.ENGINE === 'local' ? 'local' : 'psi';
const REPORT_DIR = path.join(__dirname, 'reports');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/reports', express.static(REPORT_DIR));

// 로컬 Chrome 은 한 번에 하나씩만 실행
let queue = Promise.resolve();
function enqueue(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

async function runLocalLighthouse(url, device, categories) {
  const [{ default: lighthouse, generateReport }, chromeLauncher] = await Promise.all([import('lighthouse'), import('chrome-launcher')]);
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      locale: 'ko',
      onlyCategories: categories,
      formFactor: device,
      screenEmulation:
        device === 'desktop'
          ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
          : { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      throttlingMethod: 'simulate',
      maxWaitForLoad: 45000,
    });
    if (!result?.lhr) throw new Error('Lighthouse 결과를 받지 못했습니다.');
    if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);

    await fs.mkdir(REPORT_DIR, { recursive: true });
    const host = new URL(result.lhr.finalDisplayedUrl || url).hostname.replace(/[^a-z0-9.-]/gi, '_');
    const file = `${Date.now()}_${host}_${device}.html`;
    await fs.writeFile(path.join(REPORT_DIR, file), generateReport(result.lhr, 'html'), 'utf8');
    return { lhr: result.lhr, reportUrl: `/reports/${file}` };
  } finally {
    try { await chrome.kill(); } catch {}
  }
}

app.post('/api/audit', async (req, res) => {
  let params;
  try {
    params = parseRequest(req.body);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    let data;
    if (ENGINE === 'local') {
      const { lhr, reportUrl } = await enqueue(() => runLocalLighthouse(params.url, params.device, params.categories));
      data = shapeResult(lhr, { ...params, engine: 'local', reportUrl });
    } else {
      const lhr = await runPsi(params.url, params.device, params.categories);
      data = shapeResult(lhr, { ...params, engine: 'psi', reportUrl: psiReportUrl(params.url, params.device) });
    }
    res.json(data);
  } catch (e) {
    console.error('[audit error]', e);
    res.status(502).json({ error: e.message || '검사 중 오류가 발생했습니다.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, engine: ENGINE }));

app.listen(PORT, () => {
  console.log(`\n  Lighthouse SEO 검수 서버 → http://localhost:${PORT}  (엔진: ${ENGINE === 'local' ? '로컬 Chrome' : 'PageSpeed Insights API'})\n`);
});
