---
title: 博客怎么写、怎么更新
date: 2026-06-20
excerpt: 在 blog/posts/ 写 Markdown，运行 node build.js 即可更新博客。
---

何方 · 小站的博客已经换成轻量方案：不用 Hexo，只保留「文章列表 + 文章页」。

## 文件在哪里

```text
我的本地网页/
├─ index.html          ← 主页，直接改 HTML
├─ tools/              ← 工具页
└─ blog/
   ├─ posts/           ← 文章源码（改这里）
   ├─ articles/        ← 构建生成（不要手改）
   ├─ index.html       ← 构建生成：博客列表
   └─ build.js         ← 构建脚本
```

**记住一条：** 在 `posts/` 里写 Markdown，运行构建后才会更新 `index.html` 和 `articles/`。

## 新建一篇文章

在 `blog/posts/` 新建一个 `.md` 文件，例如 `my-new-post.md`。文件开头写：

```yaml
---
title: 文章标题
date: 2026-06-20
excerpt: 可选，列表页显示的摘要。
---
```

然后写正文即可。

## 构建博客

在 `blog` 目录运行：

```powershell
npm install
node build.js
```

如果已经安装过依赖，以后只需：

```powershell
node build.js
```

## 怎么预览

不需要启动本地服务器：

1. 双击根目录的 `index.html` 打开主页
2. 点击「我的博客」，或直接打开 `blog/index.html`

## 写博客的小原则

1. **一篇只讲一件事**
2. 工具相关文章，可以链接到 `../../tools/` 里的对应页面
3. 改完记得运行 `node build.js`
4. 不用追求更新频率，有用比频繁更重要

## 如果遇到问题

| 现象 | 可能原因 |
| --- | --- |
| 新文章没出现 | 忘记运行 `node build.js` |
| 页面样式乱了 | 不要手改 `articles/` 里的 HTML |
| 工具链接打不开 | 从文章页出发，工具路径应写成 `../../tools/...` |
