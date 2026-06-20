# 何方 · 小站

个人静态网站：主页、实用小工具、轻量博客。双击 HTML 即可本地打开，也可部署到 GitHub Pages。

## 在线访问

部署后地址示例：

```
https://hefangzhi.github.io/hefang-site/
```

## 本地预览

直接双击根目录 `index.html`，或用浏览器打开即可，无需本地服务器。

## 站点结构

```
.
├── index.html          # 主页
├── assets/             # 站点图标等资源
├── tools/              # 工具页（纯 HTML / CSS / JS）
│   ├── bmi/            # BMI 计算器
│   ├── number-cn/      # 人民币大写转换
│   └── ip/             # IP 与网速测试
└── blog/
    ├── posts/          # 博客 Markdown 源码（改这里）
    ├── build.js        # 构建脚本
    ├── index.html      # 构建生成：文章列表
    └── articles/       # 构建生成：文章页
```

## 工具

| 工具 | 路径 |
| --- | --- |
| BMI 计算器 | `tools/bmi/index.html` |
| 人民币大写转换 | `tools/number-cn/index.html` |
| IP 与网速测试 | `tools/ip/index.html` |

## 博客

Markdown 写在 `blog/posts/`，构建后生成 HTML。

```powershell
cd blog
npm install
node build.js
```

也可双击 `blog/构建博客.cmd`。更多说明见 [blog/README.md](blog/README.md)。

## 技术说明

- 纯静态页面，无后端、无数据库
- 博客构建依赖 [marked](https://github.com/markedjs/marked)
- 相对路径链接，兼容 `file://` 与 GitHub Pages

## 作者

何方（hefang） · [hefangzhi@proton.me](mailto:hefangzhi@proton.me) · [GitHub](https://github.com/hefangzhi)
