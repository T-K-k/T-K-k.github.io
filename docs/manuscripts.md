# 视频文稿栏目：结构与维护

这次改造在本机 桌面 `/Users/huawei/Desktop/my-blog` 中完成，复用现有 Astro + Fuwari，不创建第二套手写页面布局，也不调整托管、域名、部署流程或依赖。

## 现在的地址

| 用途 | 算法笔记 | 视频文稿 |
| --- | --- | --- |
| 首页 | `/blog/` | `/manuscripts/` |
| 分页 | `/blog/2/` 等 | `/manuscripts/2/` 等 |
| 阅读页 | `/posts/文件名/` | `/manuscripts/posts/文件名/` |
| 归档 | `/archive/` | `/manuscripts/archive/` |
| 内容目录 | `src/content/posts/` | `src/content/manuscripts/` |
| 默认强调色 | 绿色，hue 145 | 蓝色，hue 250 |
| RSS | 原 `/rss.xml`，仅算法文章 | 本次没有新增文稿 RSS |

桌面欢迎页 `/` 已有“进入博客”和“视频文稿”两个入口，本次保留该文件及全部现有链接不变。旧的手写文稿首页已备份，再由复用 Fuwari 的分页首页取代。

算法栏目的桌面导航、手机菜单及站点标题都不会直接链接视频文稿或欢迎页；站点标题返回 `/blog/`。文稿栏目使用“文稿 / 归档 / 欢迎页 / GitHub”导航，站点标题返回 `/manuscripts/`。

## 为什么能复用

两个首页都走相同的组件链：

```text
MainGridLayout → Layout / Navbar / SideBar / Footer
              → PostPage → PostCard → PostMeta
              → Pagination
```

两个阅读路由都使用 `ArticlePage.astro`。该组件来自原来的算法文章阅读页，继续使用 Fuwari 的 Markdown、目录、封面、阅读时间、许可说明及前后篇导航。

`src/content/config.ts` 用同一份字段定义注册 `posts` 和 `manuscripts` 两个集合。内容工具函数默认读取 `posts`，传入 `"manuscripts"` 才读取文稿，因此原算法首页、归档和 RSS 继续只读取原集合。草稿在查询时统一排除；前后篇也只在同集合中计算。

`entry.collection` 决定详情地址、相对封面图片的目录，以及分类和标签的归档地址。分页组件新增 `basePath`，默认仍为 `/blog/`，文稿传 `/manuscripts/`，避免点页码时跳回算法栏目。

## 以后添加一篇文稿

1. 复制 `src/content/manuscripts/template.md`，例如命名为 `my-first-video.md`。保留模板的 `draft: true`，防止误发布。
2. 修改文件顶部的标题、日期、简介、标签、分类和正文。
3. 完成后将新文件的 `draft` 改成 `false`。模板本身继续保持草稿。
4. 运行检查和构建，预览无误后按原来的 GitHub Pages 发布流程提交。

例如，新文件可以这样写（日期按实际发布日期修改）：

```markdown
---
title: "视频标题"
published: 2026-11-17
description: "一两句话介绍这篇文稿。"
image: ""
tags: ["思考"]
category: "视频文稿"
draft: false
lang: ""
---

## 开场

这里写视频的完整文字内容。
```

该文件会自动出现在文稿首页和归档中，阅读地址为 `/manuscripts/posts/my-first-video/`。不要将文稿放入 `src/content/posts/`，否则它会成为算法栏目的文章。

需要封面时，可用公共路径（如 `/images/cover.jpg`，对应 `public/images/cover.jpg`），或放在文稿所在目录并用相对路径。算法文章原有的图片路径仍按 `content/posts` 解析。

## 修改颜色和文字

- 算法默认绿色：`src/config.ts` 的 `siteConfig.themeColor.hue`，现在为 `145`。
- 文稿默认蓝色：`src/utils/section-utils.ts` 中的 `250`。
- 文稿首页介绍和空状态文字：`src/pages/manuscripts/[...page].astro`。
- 文稿导航文字：`src/components/Navbar.astro` 的 `section === "manuscripts"` 分支。
- 欢迎页按钮和介绍：`src/pages/index.astro`。
- 头像、昵称、个人简介：仍统一读取 `src/config.ts` 的 `profileConfig`。

Fuwari 用 CSS 变量 `--hue` 生成按钮、标题强调、页面背景等配套颜色，复用这个变量就能让整个栏目协调变色，不需要逐个替换十六进制颜色。

调色器仍保留，两个栏目分别使用浏览器存储键 `hue:posts` 和 `hue:manuscripts`。旧的全站 `hue` 键不再参与新颜色初始化，也不会被删除；这样已有颜色不会串到另一栏目。手动调色后，可在该栏目调色面板点击重置按钮恢复默认色。明暗模式沿用原设置，仍由两个栏目共享。

## 导航、搜索与公开范围

Fuwari 的 Swup 默认只更新 `main` 和 `#toc`，不会重建导航栏、侧边栏和颜色配置。因此跨栏目或往返独立欢迎页时用完整页面加载；同栏目继续使用原过渡效果。布局中的点击处理也覆盖了 Markdown 中手写的跨栏目链接。

构建时，Pagefind 给 Fuwari 页面记录 `section`，搜索时按当前栏目筛选。算法关于页仍归入算法栏目。文稿不会出现在算法搜索结果中，算法文章也不会出现在文稿搜索结果中。文稿页不展示算法 RSS 订阅链接。

这是导航和内容的分离，不是访问控制：欢迎页仍有两个入口，公开文稿仍可能通过直接地址、搜索引擎或站点地图找到。需要限制阅读权限时，必须另做身份验证与权限配置。

## 实际改动文件

| 文件 | 作用 |
| --- | --- |
| `src/pages/manuscripts/[...page].astro`（新增） | 文稿首页、空状态与分页，复用 Fuwari 布局和卡片 |
| `src/pages/manuscripts/archive.astro`（新增） | 文稿独立归档，复用 ArchivePanel |
| `src/pages/manuscripts/posts/[...slug].astro`（新增） | 只为已发布文稿生成阅读路由 |
| `src/pages/posts/[...slug].astro` | 保留算法阅读地址，改为调用共享阅读组件 |
| `src/components/ArticlePage.astro`（新增） | 从原阅读页提取的共享组件 |
| `src/pages/index.astro`（未修改） | 桌面已有两个入口，原样保留 |
| `src/content/config.ts` | 共享字段定义，新增独立文稿集合 |
| `src/content/manuscripts/template.md`（新增） | 不公开的写作模板，`draft: true` |
| `src/utils/content-utils.ts` | 按集合读取、排序、计算同栏目前后篇和分类标签 |
| `src/utils/url-utils.ts` | 按集合生成阅读、分类和标签地址 |
| `src/utils/section-utils.ts`（新增） | 判断当前栏目、默认色、存储键和完整导航条件 |
| `src/config.ts` | 将算法默认强调色明确设为绿色 |
| `src/layouts/Layout.astro` | 分栏目初始化颜色、标记搜索范围，处理跨栏目完整导航 |
| `src/components/ConfigCarrier.astro` | 向前端传递当前栏目的默认色及存储键 |
| `src/utils/setting-utils.ts` | 分栏目保存、读取调色设置 |
| `src/components/Navbar.astro` | 按栏目选择导航和站点标题目标 |
| `src/components/widget/NavMenuPanel.astro` | 手机菜单的完整导航处理 |
| `src/components/widget/Profile.astro` | 文稿到关于页时完整加载，更新栏目状态 |
| `src/components/widget/Categories.astro` | 仅显示当前集合的分类 |
| `src/components/widget/Tags.astro` | 仅显示当前集合的标签及链接 |
| `src/components/PostPage.astro` | 复用列表并按集合生成详情链接 |
| `src/components/PostCard.astro` | 支持两类条目及各自的相对封面目录 |
| `src/components/PostMeta.astro` | 分类、标签链接留在当前栏目归档 |
| `src/components/control/Pagination.astro` | 页码支持不同栏目路径 |
| `src/components/ArchivePanel.svelte` | 归档条目链接到对应集合的阅读页 |
| `src/components/widget/TOC.astro` | 文稿阅读页也能显示目录 |
| `src/components/Search.svelte` | Pagefind 搜索按栏目筛选 |
| `src/global.d.ts` | 补充搜索筛选参数的类型 |
| `src/components/Footer.astro` | 文稿页隐藏只包含算法文章的 RSS 链接 |
| `docs/landing-page.md` | 更新欢迎页入口与站点标题跳转说明 |
| `docs/manuscripts.md`（本文件） | 维护与验证说明 |

原 `union-find.md`、关于页内容、个人头像、欢迎页背景图均未修改。没有修改依赖文件、域名、base、托管设置或部署配置，也没有提交或推送。

## 自己验证

在 `my-blog` 目录运行：

```sh
pnpm check
pnpm build
pnpm preview --host 127.0.0.1
```

打开预览命令显示的本机地址，检查以下路径：

1. `/`：原入口链接有效，“进入博客”和“视频文稿”都能打开。
2. `/blog/`：默认绿色；桌面导航和手机菜单不出现文稿入口；站点标题回算法首页。
3. `/manuscripts/`：默认蓝色；没有已发布文章时显示空状态；有文稿时使用原卡片。
4. 文稿卡片、分类、标签、归档和前后篇：均留在文稿栏目；超过 8 篇时检查第二页及数字页码。
5. 文稿点击“欢迎页”或头像到关于页，再进入其他栏目：导航、侧边栏和颜色都正确。
6. 搜索分别输入算法文章和文稿独有词：只返回当前栏目结果。搜索必须使用构建后的预览，`pnpm dev` 的原有搜索仍使用演示数据。
7. `/rss.xml`：仍只有算法文章；`draft: true` 的文件不应生成阅读页或进入列表、归档和搜索。

不要把本次临时验证用的测试文章复制到正式内容目录。构建生成的 `dist/` 仍按原项目规则忽略。

## 初次实现的验证记录（文稿目录副本，2026-11-17）

- 正式项目 `pnpm check`：0 错误、0 警告；仅保留改造前已有的 `language-badge.ts` 未使用变量提示。
- 正式项目 `pnpm build`：成功，包含 Pagefind 索引；空文稿首页与归档均生成。
- 正式构建的导航和站内链接目标检查通过；本机预览的文稿首页返回 HTTP 200。
- 执行实际生成的颜色初始化脚本：绿色/蓝色默认值、两个独立存储键、保留但忽略旧全站色值均符合预期。
- 隔离临时副本中新增 17 篇文稿、9 篇算法测试文章及草稿，成功构建 36 页：文稿分页为 8/8/1，算法分页为 8/2。
- 副本验证阅读页前后篇、分类标签、目录、相对封面、草稿排除和 740 个站内链接，全部通过。
- 执行副本的生产 Pagefind JavaScript 与 WASM，8 组查询验证当前栏目筛选、跨栏目无结果及草稿排除；原算法关于页仍可归入算法搜索。
- 浏览器自动检查连接超时，未完成桌面/手机的目视验收和真实点击验收；以上通过项来自构建、生成文件、脚本运行与本机 HTTP 检查。

全部测试内容位于临时副本，未加入正式内容目录。按本次用户要求，仅保留本地修改，没有提交、推送 GitHub 或部署。预览服务器验证后关闭，需要再次预览时运行上面的 `pnpm preview` 命令。

## 应用到桌面项目

目标：`/Users/huawei/Desktop/my-blog`。保留桌面欢迎页两个原有入口，保留 `graph-theory.md` 及其配图。旧文稿首页及被修改文件的原版备份：`/Users/huawei/Documents/ChatGPT/个人博客/backups/desktop-before-manuscripts-20261117-160054`。上节记录是初次实现验证；桌面项目已另行运行 `pnpm check`（0 错误、0 警告，仅原有提示）和 `pnpm build`，均通过；共生成 8 页，143 个站内链接检查通过。图论笔记与并查集文章均正常生成；原欢迎页、个人文章和配图逐字节校验未变。VS Code 的桌面项目窗口已显示新增文稿路由与共享组件修改。没有提交、推送或部署。

旧 `src/pages/manuscripts/index.astro` 已备份并移出路由目录，避免与新的 `[...page].astro` 同时生成 `/manuscripts/`。桌面欢迎页本来存在的缩进格式提示未改动。
