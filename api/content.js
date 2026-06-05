import { put, list } from '@vercel/blob';

const CONTENT_KEY = 'data/content.json';

const DEFAULT_CONTENT = {
  site: {
    title: 'TREESWITH',
    tagline: '一段陪伴，正在生长。',
    email: '87225924@qq.com',
    domain: 'treeswith.com',
    heroImage: ''
  },
  intro: '我们来到这里，和孩子们在一起。\n\n画画，唱歌，奔跑，做手工，听故事...\n\n这件事从一次探访开始，后来变成了几乎每月一次的往返。\n\n这里记录那些时间、笑容、与同行的人。',
  story: {
    title: '最初，只是一次受邀前往山区小学的探访。',
    text: '后来我们发现，孩子们需要的不是偶尔的抵达，而是有人持续地看见他们。\n\n于是我们带去了绘画、音乐、体育、舞蹈、手工和故事。\n\n路程很长，来回六个多小时。但每一次出发都因为孩子们的等待而值得。\n\n希望这件事能一直继续...'
  },
  friendsIntro: {
    title: '这些年，许多朋友一次次和我们一起出发。',
    paragraphs: [
      '有人教画画，有人教唱歌，有人记录，有人准备物资，有人安静地陪伴。',
      '每一种参与，都值得被郑重感谢。'
    ]
  },
  activities: [],
  friends: []
};

async function getContent() {
  try {
    // 用 list 查找文件是否存在，避免 head() 报错
    const { blobs } = await list({ prefix: CONTENT_KEY });
    if (blobs.length === 0) {
      // 不存在，写入默认内容
      await put(CONTENT_KEY, JSON.stringify(DEFAULT_CONTENT, null, 2), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
      return DEFAULT_CONTENT;
    }
    // 存在，读取最新内容
    const latestBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
    const res = await fetch(latestBlob.url + '?t=' + Date.now());
    return await res.json();
  } catch (e) {
    console.error('getContent error:', e.message);
    return DEFAULT_CONTENT;
  }
}

async function saveContent(content) {
  await put(CONTENT_KEY, JSON.stringify(content, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const content = await getContent();
      // 不缓存，每次都取最新
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(content);
    } catch (e) {
      console.error('GET error:', e.message);
      return res.status(500).json({ error: 'Failed to load content' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { password, ...content } = body;

      if (!process.env.ADMIN_PASSWORD) {
        return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
      }

      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: '密码错误' });
      }

      await saveContent(content);
      return res.status(200).json({ success: true, message: '保存成功' });
    } catch (e) {
      console.error('POST error:', e.message);
      return res.status(500).json({ error: e.message || 'Failed to save content' });
    }
  }

  return res.status(405).end();
}
