import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = req.body || {};
    const { password, filename, data, contentType } = body;

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'ADMIN_PASSWORD not configured' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: '密码错误' });
    }

    if (!filename || !data) {
      return res.status(400).json({ error: '缺少文件名或数据' });
    }

    // 检查 BLOB token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN 环境变量未配置' });
    }

    // base64 → Buffer
    const base64Data = data.includes(',') ? data.split(',')[1] : data;
    const buffer = Buffer.from(base64Data, 'base64');
    
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `images/${Date.now()}-${safeName}`;
    const type = contentType || 'image/jpeg';

    // 显式传入 token，避免自动检测失败
    const blob = await put(key, buffer, {
      access: 'public',
      contentType: type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ url: blob.url, key });
  } catch (e) {
    console.error('Upload error:', e.message);
    console.error('Stack:', e.stack);
    return res.status(500).json({ error: e.message || '上传失败，请检查 Blob 存储配置' });
  }
}
