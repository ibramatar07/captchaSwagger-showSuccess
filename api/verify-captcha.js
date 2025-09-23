import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { token, secret } = req.body;
  if (!token || !secret) return res.status(400).json({ success: false });

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${token}`
      }
    );
    const data = await response.json();
    res.status(200).json({ success: data.success });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}