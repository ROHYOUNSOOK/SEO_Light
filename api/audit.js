// Vercel 서버리스 함수: POST /api/audit
// PageSpeed Insights API 로 Lighthouse 를 실행하고 수정 항목을 반환
import { parseRequest, shapeResult } from '../lib/shape.js';
import { runPsi, psiReportUrl } from '../lib/psi.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  let params;
  try {
    params = parseRequest(body);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    const lhr = await runPsi(params.url, params.device, params.categories);
    const data = shapeResult(lhr, { ...params, engine: 'psi', reportUrl: psiReportUrl(params.url, params.device) });
    return res.status(200).json(data);
  } catch (e) {
    console.error('[audit error]', e);
    return res.status(502).json({ error: e.message || '검사 중 오류가 발생했습니다.' });
  }
}
