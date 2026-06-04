import { put, head } from '@vercel/blob';

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
    const { blob } = await head('data/content.json');
    const res = await fetch(blob.url);
    return await res.json();
  } catch {
    // First time: save defaults and return
    await put('data/content.json', JSON.stringify(DEFAULT_CONTENT, null, 2), { access: 'public' });
    return DEFAULT_CONTENT;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const content = await getContent();
      return res.status(200).json(content);
    } catch (e) {
      console.error('GET error:', e);
      return res.status(500).json({ error: 'Failed to load content' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { password, ...content } = req.body || {};

      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: '密码错误' });
      }

      await put('data/content.json', JSON.stringify(content, null, 2), { access: 'public' });
      return res.status(200).json({ success: true, message: '保存成功' });
    } catch (e) {
      console.error('POST error:', e);
      return res.status(500).json({ error: 'Failed to save content' });
    }
  }

  return res.status(405).end();
}
