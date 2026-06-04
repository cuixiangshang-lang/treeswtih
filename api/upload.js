import { put } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { password, filename, data, contentType } = req.body || {};

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: '密码错误' });
    }

    if (!filename || !data) {
      return res.status(400).json({ error: 'Missing filename or data' });
    }

    const buffer = Buffer.from(data, 'base64');
    const key = `images/${Date.now()}-${filename}`;
    const blob = await put(key, buffer, {
      access: 'public',
      type: contentType || 'image/jpeg',
    });

    return res.status(200).json({ url: blob.url, key });
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
