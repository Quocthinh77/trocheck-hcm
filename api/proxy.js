export default async function handler(req, res) {
  const gasUrl = process.env.GAS_WEBAPP_URL;
  const secretKey = 'TroCheck_HCM_2026_Secret!';

  if (!gasUrl) {
    return res.status(500).json({ status: 'error', message: 'Chưa điền GAS_WEBAPP_URL trên Vercel' });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${gasUrl}?key=${encodeURIComponent(secretKey)}`);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...rawBody, secretKey })
      });
      const text = await response.text();
      try {
        return res.status(200).json(JSON.parse(text));
      } catch {
        return res.status(200).json({ status: 'ok' });
      }
    }

    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Lỗi kết nối Apps Script' });
  }
}
