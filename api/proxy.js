export default async function handler(req, res) {
  const gasUrl = process.env.GAS_WEBAPP_URL;
  const secretKey = process.env.GAS_SECRET_KEY;

  if (!gasUrl || !secretKey) {
    return res.status(500).json({ status: 'error', message: 'Thiếu cấu hình môi trường trên Vercel' });
  }

  try {
    if (req.method === 'GET') {
      const targetUrl = `${gasUrl}?key=${encodeURIComponent(secretKey)}`;
      const response = await fetch(targetUrl, { method: 'GET' });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const payload = { ...rawBody, secretKey };

      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
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
    return res.status(500).json({ status: 'error', message: 'Lỗi kết nối máy chủ dữ liệu' });
  }
}
