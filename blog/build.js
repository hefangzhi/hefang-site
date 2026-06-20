'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const root = __dirname;
const postsDir = path.join(root, 'posts');
const articlesDir = path.join(root, 'articles');

marked.setOptions({ gfm: true, breaks: false });

function parsePost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    meta[key] = value;
  }

  const slug = path.basename(filePath, '.md');
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '1970-01-01',
    excerpt: meta.excerpt || '',
    body: match[2].trim()
  };
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFrom(post) {
  if (post.excerpt) return post.excerpt;
  const plain = stripMarkdown(post.body);
  return plain.length > 120 ? `${plain.slice(0, 120)}…` : plain;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toISOString().slice(0, 10);
}

function slugify(text) {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'section';
}

function extractHeadings(markdown) {
  const headings = [];
  const used = new Set();

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();
    let id = slugify(text);
    let suffix = 2;

    while (used.has(id)) {
      id = `${slugify(text)}-${suffix++}`;
    }
    used.add(id);
    headings.push({ level, text, id });
  }

  return headings;
}

function renderMarkdownWithIds(body, headings) {
  let index = 0;
  return marked.parse(body).replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
    const heading = headings[index];
    index += 1;
    if (!heading) return match;
    return `<h${level} id="${heading.id}">${inner}</h${level}>`;
  });
}

function wrapLayout(sidebar, main) {
  return `    <div class="blog-layout">
${sidebar}
${main}
    </div>`;
}

function renderPostSidebar(posts, depth) {
  const prefix = depth === 0 ? 'articles/' : '';
  const items = posts.map(post => {
    const date = formatDate(post.date);
    return `        <li class="blog-sidebar-item"><a href="${prefix}${post.slug}.html"><span class="blog-sidebar-title">${escapeHtml(post.title)}</span><time datetime="${date}">${date}</time></a></li>`;
  }).join('\n');

  return `      <aside class="blog-sidebar" aria-label="文章目录">
        <p class="blog-sidebar-label">目录</p>
        <ul class="blog-sidebar-list">
${items}
        </ul>
      </aside>`;
}

function renderTocSidebar(headings) {
  if (!headings.length) {
    return `      <aside class="blog-sidebar" aria-label="本篇目录">
        <p class="blog-sidebar-label">本篇目录</p>
        <p class="blog-sidebar-empty">本篇暂无章节</p>
      </aside>`;
  }

  const items = headings.map(heading => {
    const cls = heading.level === 3 ? 'blog-sidebar-item is-h3' : 'blog-sidebar-item';
    return `        <li class="${cls}"><a href="#${heading.id}">${escapeHtml(heading.text)}</a></li>`;
  }).join('\n');

  return `      <aside class="blog-sidebar" aria-label="本篇目录">
        <p class="blog-sidebar-label">本篇目录</p>
        <ul class="blog-sidebar-list">
${items}
        </ul>
      </aside>`;
}

function pageShell({ title, depth, body }) {
  const home = depth === 0 ? '../index.html' : '../../index.html';
  const blog = depth === 0 ? 'index.html' : '../index.html';
  const backHref = depth === 0 ? home : blog;
  const backLabel = depth === 0 ? '← 返回主页' : '← 返回博客';
  const toolsRoot = depth === 0 ? '../tools' : '../../tools';
  const assetsRoot = depth === 0 ? '../assets' : '../../assets';
  const toolsCss = `${toolsRoot}/shared.css`;
  const blogCss = depth === 0 ? 'shared.css' : '../shared.css';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f1efe9">
  <title>${escapeHtml(title)} · 何方 · 小站</title>
  <link rel="icon" href="${assetsRoot}/icon.png" type="image/png">
  <link rel="apple-touch-icon" href="${assetsRoot}/icon.png">
  <link rel="stylesheet" href="${toolsCss}">
  <link rel="stylesheet" href="${toolsRoot}/cursor.css">
  <link rel="stylesheet" href="${blogCss}">
</head>
<body>
  <header>
    <nav class="shell">
      <a class="brand" href="${home}"><img class="brand-logo" src="${assetsRoot}/icon.png" alt="" width="28" height="28">何方 · 小站</a>
      <a class="back" href="${backHref}">${backLabel}</a>
    </nav>
  </header>
  <main class="shell">
${body}
  </main>
  <script src="${toolsRoot}/cursor.js"></script>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildIndex(posts) {
  const sidebar = renderPostSidebar(posts, 0);
  const cards = posts.map(post => {
    const href = `articles/${post.slug}.html`;
    return `          <a class="article-card" href="${href}">
            <time datetime="${formatDate(post.date)}">${formatDate(post.date)}</time>
            <h2>${escapeHtml(post.title)}</h2>
            <p>${escapeHtml(excerptFrom(post))}</p>
          </a>`;
  }).join('\n');

  const main = `      <div class="blog-main">
        <div class="eyebrow">博客 · 文章</div>
        <h1>我的博客</h1>
        <p class="lead">记录想法、工具笔记和站点更新。Markdown 写作，构建后双击即可阅读。</p>
        <section class="article-list" aria-label="文章列表">
${cards}
        </section>
      </div>`;

  const body = wrapLayout(sidebar, main);
  fs.writeFileSync(path.join(root, 'index.html'), pageShell({ title: '我的博客', depth: 0, body }));
}

function buildArticle(post, index, posts) {
  const prev = posts[index + 1];
  const next = posts[index - 1];
  let nav = '';

  if (prev || next) {
    const parts = [];
    if (next) parts.push(`<a href="${next.slug}.html">← ${escapeHtml(next.title)}</a>`);
    if (prev) parts.push(`<a href="${prev.slug}.html">${escapeHtml(prev.title)} →</a>`);
    nav = `\n          <nav class="article-nav">${parts.join(' · ')}</nav>`;
  }

  const headings = extractHeadings(post.body);
  const sidebar = renderTocSidebar(headings);
  const main = `      <div class="blog-main">
        <div class="eyebrow">博客 · 文章</div>
        <h1>${escapeHtml(post.title)}</h1>
        <div class="article-meta"><time datetime="${formatDate(post.date)}">${formatDate(post.date)}</time></div>
        <article class="article-body">
${renderMarkdownWithIds(post.body, headings)}
        </article>${nav}
      </div>`;

  const body = wrapLayout(sidebar, main);
  fs.writeFileSync(
    path.join(articlesDir, `${post.slug}.html`),
    pageShell({ title: post.title, depth: 1, body })
  );
}

function cleanGenerated() {
  for (const name of ['archives', 'tags', 'categories', 'css', 'js', 'fancybox', '2026']) {
    fs.rmSync(path.join(root, name), { recursive: true, force: true });
  }
  fs.rmSync(articlesDir, { recursive: true, force: true });
  fs.rmSync(path.join(root, 'catalog.html'), { force: true });
  fs.mkdirSync(articlesDir, { recursive: true });
}

function main() {
  if (!fs.existsSync(postsDir)) {
    console.error('posts/ 目录不存在');
    process.exit(1);
  }

  const posts = fs.readdirSync(postsDir)
    .filter(name => name.endsWith('.md'))
    .map(name => parsePost(path.join(postsDir, name)))
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  cleanGenerated();
  buildIndex(posts);
  posts.forEach((post, index) => buildArticle(post, index, posts));

  console.log(`博客已构建：${posts.length} 篇文章`);
  console.log('打开 blog/index.html 即可阅读');
}

main();
