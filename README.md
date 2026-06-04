# 与孩子同行 · 乡村公益网站

> 十年乡村公益陪伴活动展示网站  
> 域名：treeswtih.com

---

## 📁 文件结构

```
treeswtih-website/
├── index.html      # 主页（全部内容在此文件）
├── vercel.json     # Vercel 部署配置
├── images/         # 放你的照片（建议按年份分文件夹）
│   ├── 2015/
│   ├── 2016/
│   └── ...
└── README.md       # 本说明文件
```

---

## 🖼️ 如何替换照片

### 时间线部分
找到对应年份的 `.photo-slot`，将：
```html
<div class="photo-slot">📷 替换照片</div>
```
替换为：
```html
<div class="photo-slot"><img src="images/2015/photo1.jpg" alt="2015年活动" /></div>
```

### 画廊部分
找到 `gallery-item` 中的 `img-ph`，将：
```html
<div class="gallery-item"><div class="img-ph">📷 在此替换...</div></div>
```
替换为：
```html
<div class="gallery-item"><img src="images/gallery/photo1.jpg" alt="活动照片" /></div>
```

---

## 📝 如何修改文字内容

直接用记事本或 VS Code 打开 `index.html`，搜索要修改的文字即可。

常用修改位置：
- **统计数字**（活动次数、孩子人数）：搜索 `stat-num`
- **各年份描述**：搜索对应年份如 `2015`
- **关于活动**：搜索 `about-p`

---

## 🚀 部署到 Vercel（绑定 treeswtih.com）

### 第一步：上传到 GitHub
1. 注册/登录 [github.com](https://github.com)
2. 新建一个仓库，名称任意（如 `my-charity-site`）
3. 将整个 `treeswtih-website` 文件夹上传

### 第二步：连接 Vercel
1. 登录 [vercel.com](https://vercel.com)（可用 GitHub 账号登录）
2. 点击 "Add New Project"
3. 选择刚才的 GitHub 仓库
4. 直接点 Deploy，等待约 1 分钟

### 第三步：绑定域名
1. 在 Vercel 项目页面，进入 Settings → Domains
2. 输入 `treeswtih.com`，点击 Add
3. Vercel 会告诉你需要在域名注册商那里添加的 DNS 记录
4. 按照提示在你购买域名的平台（如阿里云、腾讯云、GoDaddy）修改 DNS
5. 等待 5-30 分钟生效

---

## ❓ 遇到问题？

- 域名在哪里买的？→ 提供对应平台的 DNS 修改指南
- 照片太多不知道怎么整理？→ 建议按年份放文件夹
- 想增加新的年份？→ 复制一个 `tl-item` 块，修改内容即可
