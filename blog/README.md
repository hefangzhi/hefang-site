# 博客

Markdown 源码在 `posts/`，构建结果如下：

- `index.html` — 左栏全部文章目录 + 右栏卡片列表
- `articles/` — 左栏本篇章节目录 + 右栏正文

## 新建或修改文章

编辑 `posts/` 下的 `.md` 文件，开头示例：

```yaml
---
title: 文章标题
date: 2026-06-20
excerpt: 列表页摘要（可选）
---
```

正文里的 `##` / `###` 会自动变成阅读页左侧的章节目录。

## 构建

```powershell
cd blog
npm install
node build.js
```

首次运行需要 `npm install` 安装 `marked`；之后改文章只需 `node build.js`。

## 预览

双击根目录 `index.html`，或打开 `blog/index.html`。无需本地服务器。
