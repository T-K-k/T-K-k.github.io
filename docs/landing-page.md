# 欢迎页与博客

- `/`：独立欢迎页，源码为 `src/pages/index.astro`。
- `/blog/`：原 Fuwari 文章列表；后续分页为 `/blog/2/` 等。
- `/manuscripts/`：复用 Fuwari 的视频文稿栏目，使用独立内容集合及蓝色强调色；详见 [文稿维护说明](manuscripts.md)。
- `/posts/…/`、`/archive/`、`/about/`、`/rss.xml`：保留原地址。

欢迎页沿用 `src/config.ts` 中的昵称、头像和简介。介绍文案、入口卡片及欢迎页样式在 `src/pages/index.astro` 中修改。背景图为 `public/images/welcome-mountains.jpg`，摄影 Marek Piwnicki，作品 [Sharp Night](https://unsplash.com/photos/the-night-sky-over-a-snowy-mountain-range-eVg2GOJ2A_k)，遵循 [Unsplash License](https://unsplash.com/license)。页面右下角保留图片来源。

欢迎页采用单独的文档布局，保留桌面项目现有的“进入博客”和“视频文稿”两个入口。往返欢迎页的链接必须带 `data-no-swup`，让浏览器完整加载另一套布局；同栏目内部的页面切换继续使用 Swup。算法博客导航中的“博客”和站点标题均返回 `/blog/`，不通过导航展示文稿入口。文稿导航中的“欢迎页”可返回 `/`。跨栏目链接也完整加载，以同步导航、侧边栏与颜色。

```sh
pnpm check
pnpm build
pnpm preview
```

`pnpm build` 同时生成 Pagefind 搜索索引。推送 `main` 后，现有 `.github/workflows/deploy.yml` 继续自动部署到 GitHub Pages，无需更改仓库的 Pages 地址或 base 配置。

验证范围：欢迎页与博客往返、文章详情、Pagefind 搜索、分类与标签查询、RSS，以及使用临时文章构建的三页分页。临时文章不加入正式仓库。
