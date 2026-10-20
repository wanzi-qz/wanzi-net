# 王嘉瑞 · 个人网站

个人作品集网站

- 线上地址：<https://www.wanzi.me>（Cloudflare Pages 自动部署）
- 技术栈：React 19 + Vite 8 + 原生 CSS（无 UI 组件库），评论后端为 Cloudflare Pages Functions + Workers KV
- 设计风格：黑金色系、PC 端版心约 1700px，兼顾 1200 / 820 / 480 三档响应式断点

## 页面结构

| 区块 | 内容 | 交互 |
| --- | --- | --- |
| 开场动画 | 背景视频 + 点击进入主站 | 点击后视频推进式过场，BGM 淡入，右下角可静音/恢复 |
| 01 关于我 | 个人简介 + 四条个人优势 | 滚动入场动效 |
| 02 项目展示 | P.01 MitoSAM-Quant 线粒体显微图像定量分析；P.02 算法与数据工具链 | 左图右文竖排；P.01 主图叠加「图像处理→特征提取→模型训练→定量分析」金色流程条 |
| 03 核心技能 | Python / OpenCV / PyTorch / 特征工程 / 数理统计 / 工程化 六张卡 | 鼠标悬停放大 |
| 04 证书荣誉 | 5 张竞赛获奖证书直展 | 横向拖拽 / 滚轮 / 箭头滑动，点击进灯箱放大、可前后切换 |
| 05 学习笔记 | N.01 数据处理与报表、N.02 SQL（语法基础 + 牛客刷题双 Tab）、N.03 线粒体图像算法四阶段拆解 | 点击卡片弹出 Markdown 全文弹窗 |
| 06 欢迎联系 | 邮箱 / 微信等联系方式 | — |
| 07 评论互动 | 类 B 站评论区：评论、回复、点赞、删除、分页 | 后端 KV 存储，含防刷屏限流 |

## 目录结构

```
├─ index.html               # 入口 HTML（title / meta / 字体）
├─ vite.config.js
├─ start-dev.cmd            # Windows 双击启动开发服务器
├─ functions/
│  └─ api/comments.js       # Cloudflare Pages Function：评论 / 回复 / 点赞 / 删除 / 分页 / 限流
├─ scripts/
│  ├─ import-notes.ps1      # 从 Obsidian 笔记库导入 Markdown 与配图
│  └─ make-hero-video.ps1   # 生成开场背景视频
├─ public/
│  ├─ audio/intro-bgm.wav   # 开场 BGM
│  ├─ videos/hero-loop.mp4  # 开场背景视频
│  ├─ certs/                # 证书原图（5 张）
│  ├─ projects/             # 项目配图
│  └─ notes/covers/         # 笔记封面 SVG
└─ src/
   ├─ App.jsx               # 页面组装与各区块组件（含证书轨、灯箱、笔记弹窗、开场动画）
   ├─ styles.css            # 全站样式（黑金色系 / 动效 / 响应式 / reduced-motion 降级）
   ├─ components/
   │  ├─ ProjectVisuals.jsx # 项目主视觉（显微视觉、流程条、分析图）
   │  ├─ CommentSection.jsx # 评论区前端
   │  └─ NoteMarkdown.jsx   # 极简 Markdown 渲染器
   ├─ content/
   │  ├─ index.js           # 笔记 Markdown 以 ?raw 形式打包注册
   │  ├─ certs.js           # 证书数据（标题 / 机构 / 日期 / 图片）
   │  └─ notes/*.md         # 笔记正文（Excel / SQL / 牛客 / 线粒体算法）
   └─ data/portfolio.js     # 全站文案唯一数据源：简介、优势、项目、技能、笔记列表
```

## 内容维护

- **改文案 / 项目 / 技能 / 笔记卡片**：只改 `src/data/portfolio.js`，组件不碰。
- **新增一篇笔记**：`src/content/notes/` 下新建 `.md` → 在 `src/content/index.js` 注册 `?raw` import → 在 `portfolio.js` 的 `notes` 数组加卡片（含封面 `public/notes/covers/<id>.svg`）。卡片上限 3 张（1 列 + 跨 2 列 + 通栏）。
- **新增证书**：图片放 `public/certs/`，在 `src/content/certs.js` 加一条记录即可进入横滑画廊。
- **评论区配置**：Pages 后台绑定 KV 命名空间到 `COMMENTS_KV`；UP 主删除密钥用环境变量 `COMMENTS_ADMIN_KEY`；限流阈值（发帖间隔 30s、每小时 10 条、点赞每分钟 30 次、每页 5 条）在 `functions/api/comments.js` 顶部常量调整。

## 本地运行

```bash
npm install
npm run dev      # 或双击 start-dev.cmd
```

生产构建与预览：

```bash
npm run build
npm run preview
```

> 评论接口是 Cloudflare Pages Function，本地 dev 不会启动该接口，评论数据以线上 KV 为准；其余区块本地均可完整预览。

## 部署

推送 `master` 分支到 GitHub 后，Cloudflare Pages 自动构建发布（约 1 分钟），无需手动操作。

## 其他

- 全站动效遵循 `prefers-reduced-motion`，系统开启"减弱动态效果"时自动降级为直接显示。
- 站内内容与证书均为个人材料，转载或使用请注明出处。