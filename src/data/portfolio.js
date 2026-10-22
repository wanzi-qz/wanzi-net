export const profile = {
  name: '王嘉瑞',
  nameEn: 'WANG JIARUI',
  role: '算法工程师',
  roleEn: 'Algorithm Engineer',
  introLead: '万事万物，皆可定量分析。',
  introParagraphs: [
    '数学与应用数学本科，控制工程图像算法方向硕士。围绕高噪声显微图像完成预处理、分割、特征提取与统计建模的全流程实现，习惯从问题出发，把算法为什么有效讲成可复现、可验证的结论。',
    '数理基础扎实，逻辑思维清晰，能用 PyTorch 独立搭建并训练模型；学习速度快，新技术栈以周为单位从入门走到落地，也熟悉 Prompt Engineering 与 Agent，把重复流程沉淀为可复用工具。',
  ],
};

export const intro = {
  kicker: 'WANG JIARUI · COMPUTER VISION · 2026',
  titleLines: ['欢迎来到', '我的世界'],
  tagline: '一个用算法、代码和好奇心搭起来的小世界。深呼吸，点一下，走进来。',
  enter: '进入我的世界',
  skip: '跳过 SKIP',
};

export const marquee = [
  '图像算法',
  'COMPUTER VISION',
  'PYTORCH',
  'OPENCV',
  '图像分割',
  'IMAGE SEGMENTATION',
  '特征工程',
  'PYTHON',
  '数学建模',
  'STATISTICAL MODELING',
];

export const heroMeta = [
  {
    label: '教育背景 / EDUCATION',
    lines: ['数学（本科）', '图像算法（硕士）'],
  },
  {
    label: '核心技能 / TOOLKIT',
    lines: ['PyTorch · OpenCV · Python · MATLAB'],
  },
  {
    label: '竞赛荣誉 / AWARDS',
    lines: ['数学建模国家级奖项 ×2', '华为杯 · 数维杯 国家三等奖'],
  },
];

export const advantages = [
  {
    title: '数理统计科班 + 图像算法硕士',
    desc:
      '电子科技大学数学统计学本科、华南师范大学控制工程硕士，概率统计、假设检验、回归与聚类基础扎实；多次以队长身份参加数学建模竞赛并全部获奖。',
  },
  {
    title: '独立完成图像算法全流程',
    desc:
      '从高噪声显微图像的预处理、增强与分割，到数十维特征提取、筛选降维与显著性验证，独立交付一套自动化定量分析方案，单次分析耗时从数小时压缩至分钟级。',
  },
  {
    title: '深度学习与工程实现',
    desc:
      '能用 PyTorch 独立搭建并训练模型，熟悉 NumPy / Pandas / Scikit-learn / OpenCV / MATLAB；把分析流程沉淀为 GUI 工具并在课题组内推广使用。',
  },
  {
    title: '快速学习与逻辑推演',
    desc:
      '新技术栈从入门到落地以周为单位推进，自学完成项目并整理成可检索笔记；擅长把复杂问题拆解为可验证的步骤与结论。',
  },
];

export const contacts = [
  {
    id: 'email',
    label: 'Email',
    value: '1164600336@qq.com',
    href: 'mailto:1164600336@qq.com',
  },
  {
    id: 'phone',
    label: '电话',
    value: '+86 178 0730 8510',
    href: 'tel:+8617807308510',
  },
  {
    id: 'wechat',
    label: '微信',
    value: 'wanzi039',
  },
];

export const education = [
  {
    badge: '985',
    school: '电子科技大学',
    degree: '本科',
    major: '数学与应用数学',
    direction: '统计学方向',
    period: '2017.09 — 2021.07',
    note: '建立数理与统计方法基础',
  },
  {
    badge: '211',
    school: '华南师范大学',
    degree: '硕士',
    major: '控制工程',
    direction: '图像算法方向',
    period: '2023.09 — 2026.07',
    note: '面向科研数据的图像量化研究',
  },
];

export const projects = [
  {
    no: 'P.01',
    title: 'MitoSAM-Quant · 线粒体显微图像定量分析',
    period: '2024.03 — 2026.03',
    role: '核心研发',
    area: '图像算法定量分析',
    visual: 'microscope',
    pipeline: [
      { no: '01', zh: '图像处理', en: 'PREPROCESSING' },
      { no: '02', zh: '特征提取', en: 'FEATURES' },
      { no: '03', zh: '模型训练', en: 'TRAINING' },
      { no: '04', zh: '定量分析', en: 'QUANTIFICATION' },
    ],
    intro:
      '针对线粒体形态分析高度依赖人工、效率低下的痛点，搭建 MitoSAM-Quant 全流程图像算法：改进 SAM 分割大模型实现超分辨显微图像的实例级分割，再提取多维特征并训练随机森林评估模型，最终输出可量化的线粒体异常指数。',
    points: [
      '图像处理：对高噪声超分辨显微图像完成去噪、归一化与对比增强，用 Python 调用 FIJI 批处理预处理，构建训练与验证数据集',
      '特征提取：基于实例分割掩码提取形态（面积 / 周长 / 纵横比 / 圆度）、纹理（GLCM 对比度 / 同质性、LBP 熵 / 能量）、空间分布（Ripley\'s K、Voronoi、最近邻距离）三大类数十维特征',
      '模型训练：用 PyTorch 将 SAM 改进为 MitoSAM（ViT 主干深度扩展、局部-全局混合注意力、门控注意力），半监督仅人工标注 120 视野 / 2045 个线粒体即达专用模型同等 Dice；再以随机森林监督框架从 174 维特征中筛出 30 个关键特征',
      '定量分析：输出连续异常指数量化线粒体功能状态，40 个验证样本仅 2 例误判、AUC 达 0.971–0.990；封装 GUI 工具在课题组推广，单次分析耗时从数小时压缩至分钟级',
    ],
    tags: ['图像处理', '特征工程', '模型训练', '定量分析'],
  },
  {
    no: 'P.02',
    title: '算法与数据工具链',
    period: '持续积累',
    role: '个人沉淀',
    area: '方法与实践',
    visual: 'toolkit',
    image: 'projects/project-3.png',
    intro:
      '围绕图像与数据处理建立个人工具链，覆盖从数据取用、算法实现到可视化与 AI 协作的完整流程。',
    points: [
      '熟练使用 Python、NumPy、Scikit-learn、Matplotlib 与 MATLAB 完成算法实现与结果可视化',
      '使用 SQL 完成多表关联与窗口函数计算，掌握 Excel / Tableau 结果呈现',
      '了解 Prompt Engineering 与 Agent 基本概念，并用于辅助算法开发与调试',
    ],
    tags: ['Python', 'MATLAB', 'SQL', 'AI 工具'],
  },
];

export const strengths = [
  {
    no: '01',
    title: 'Python 科学计算',
    desc: '用 NumPy / Pandas 完成矩阵运算、批量处理与数据管道，Matplotlib 做算法结果可视化，沉淀可复用代码模块。',
    tags: ['NumPy', 'Pandas', 'Matplotlib'],
  },
  {
    no: '02',
    title: 'OpenCV 图像处理',
    desc: '完成图像去噪、归一化、增强、阈值与形态学操作及连通域分割，在高噪声显微图像上稳定输出量化结果。',
    tags: ['图像增强', '形态学', '连通域分割'],
  },
  {
    no: '03',
    title: 'PyTorch 深度学习',
    desc: '能独立搭建并训练模型，完成数据加载、网络构建、训练调优与迁移学习，并用指标验证效果。',
    tags: ['模型搭建', '训练调优', '迁移学习'],
  },
  {
    no: '04',
    title: '图像特征工程',
    desc: '提取形态学、纹理、空间分布三大类数十维特征，通过统计筛选与降维定位关键鉴别性特征。',
    tags: ['形态学特征', '纹理特征', '特征筛选与降维'],
  },
  {
    no: '05',
    title: '数理统计与建模',
    desc: '扎实掌握假设检验、回归与聚类方法，能完成高维特征降维、差异显著性验证与数学建模方案设计。',
    tags: ['假设检验', '回归与聚类', 'PCA 降维'],
  },
  {
    no: '06',
    title: '数据处理与工程化',
    desc: '用 SQL 完成多表关联取数，Excel / Tableau 做结果呈现；把重复流程沉淀为 GUI 工具，并借助 AI 提升开发效率。',
    tags: ['SQL', 'GUI 工具', 'Prompt 与 Agent'],
  },
];

export const notes = [
  {
    no: 'N.01',
    id: 'excel',
    title: '数据处理与报表实现',
    source: 'OBSIDIAN / 学习笔记',
    summary:
      '把业务报表从指标口径到可视化完整实现了一遍：先理清指标定义，再用函数与透视完成取数和聚合，最后做成一份能筛选、能直接看的周报。',
    points: [
      '指标口径：GMV、UV / PV、CPC、到手率、进店与下单转化率',
      '透视表 + 切片器 + 透视图，实现跨表联动筛选',
      '常用函数：SUMIF / SUMIFS、IF + AND、VLOOKUP、INDEX + MATCH、SUBTOTAL',
      '同比环比：YEAR / MONTH / DATE / EDATE / EOMONTH 拼出各种日期口径',
      '周报实现：指标体系 + 下拉筛选 + 条件格式（数据条 / 图标集）做可视化',
    ],
    links: [
      {
        label: '课程视频 · B站',
        href: 'https://www.bilibili.com/video/BV1ZM4y1u7uF?p=15',
      },
    ],
  },
  {
    no: 'N.02',
    id: 'sql',
    title: 'SQL 从查询到窗口函数 · 牛客 42 题',
    source: 'OBSIDIAN / 学习笔记',
    summary:
      '先把 SQL 的语法结构和真实运行顺序捋清楚，从单表查询走到多表连接、子查询和窗口函数；再在牛客必知必会题库把 SQL1 到 SQL42 刷完，每题都记了思路与踩过的坑。',
    parts: [
      { id: 'sql', label: '语法基础' },
      { id: 'sql-nowcoder', label: '牛客刷题' },
    ],
    points: [
      '书写顺序 SELECT-FROM-WHERE-GROUP BY-HAVING-ORDER BY-LIMIT，运行却是 FROM 先走、SELECT 最后',
      '条件筛选与聚合分组：LIKE / BETWEEN / IN / NULL 判断，COUNT / SUM / AVG 配 GROUP BY，分清 WHERE 与 HAVING',
      '高级语句：窗口函数、表连接（inner / left / right）、子查询；自建云端 MySQL，用 DataGrip 连真实业务表练查询',
      '刷题实战：多表 join + 分组统计、count(distinct ...) 与 round(..., 4) 控精度、union all 合并结果集、case when 做分桶',
      '日期函数 day() / month() 提取，算 8 月每日练题量与次日留存率；二刷清单 SQL21、22、25、26、27、29、32',
    ],
    links: [
      {
        label: '课程视频 · B站戴师兄',
        href: 'https://www.bilibili.com/video/BV1ZM4y1u7uF?p=6',
      },
      {
        label: 'SQLZoo 练习',
        href: 'https://sqlzoo.net/wiki/SELECT_basics',
      },
      {
        label: '牛客 SQL 题库',
        href: 'https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=199',
      },
    ],
  },
];
// 「闲来无事」板块：兴趣向小项目 + 学习笔记，统一按两列卡片呈现
export const casualProjects = [
  {
    id: 'myimg',
    title: 'myimg · 图像算子对拍工作台',
    desc: 'NumPy 高斯 / Otsu / Canny / 形态学等常用算子，逐个与 OpenCV、scikit-image 对拍，把误差、耗时、差异原因全部记录归因。附 PyQt GUI 工具箱、Streamlit 在线对拍台与 exe 打包版本。',
    image: 'projects/github/myimg-card.webp',
    imageAlt: 'myimg GUI 对拍台截图：Canny 边缘对比与统计面板',
    tags: ['NumPy', 'PyQt', 'Streamlit', '对拍测试'],
    repo: 'https://github.com/wanzi-qz/wanzi-myimg',
    demo: 'https://wanzi-myimg.streamlit.app/',
  },
  {
    id: 'mefhdr',
    title: 'mefhdr · 多曝光融合 HDR 链路',
    desc: 'Training-free 的多曝光 HDR 融合管线：MTB 对齐抗鬼影、Mertens 三权重图、拉普拉斯金字塔融合。在 Kalantari 15 场景上零调参评测，并诚实记录传统方法的适用边界与失败案例。',
    image: 'projects/github/mefhdr-card.webp',
    imageAlt: 'EV-2 / EV0 / EV+2 三档曝光与 HDR 融合结果对比',
    tags: ['HDR', 'MTB 对齐', '金字塔融合', 'Python'],
    repo: 'https://github.com/wanzi-qz/wanzi-mefhdr',
    demo: null,
  },
  {
    id: 'yolo-world',
    title: 'YOLO-World · 开放词汇检测系统',
    desc: '复现 YOLO-World（CVPR 2024）开放词汇目标检测：基于 ultralytics + CLIP 文本编码器，用 PyQt5 从零搭建桌面系统——自定义提示词在线换类、图片 / 视频双通道检测、CUDA 加速与多档 worldv2 模型热切换。',
    image: 'projects/github/yolo-world-gui.webp',
    imageAlt: 'YOLO-World 开放词汇检测系统 GUI：输入 person、blue bus 提示词的检测结果',
    tags: ['YOLO-World', '开放词汇检测', 'PyQt5', 'CLIP'],
    repo: null,
    demo: null,
    paper: 'https://arxiv.org/abs/2401.17270',
  },
  {
    id: 'note-excel',
    noteId: 'excel',
    kicker: 'N.01',
    title: '数据处理与报表实现',
    desc: '把业务报表从指标口径到可视化完整实现了一遍：先理清指标定义，再用函数与透视完成取数和聚合，最后做成一份能筛选、能直接看的周报。',
    image: 'notes/covers/excel.svg',
    imageAlt: '数据处理与报表实现笔记封面',
    tags: ['Excel', '数据透视表', '指标体系', '报表自动化'],
    repo: null,
    demo: null,
  },
  {
    id: 'note-sql',
    noteId: 'sql',
    kicker: 'N.02',
    title: 'SQL 从查询到窗口函数 · 牛客 42 题',
    desc: '从单表查询走到多表连接、子查询与窗口函数，理清书写顺序与真实运行顺序的差别；再在牛客把 SQL1–SQL42 刷完，每题都记下思路与踩过的坑。',
    image: 'notes/covers/sql.svg',
    imageAlt: 'SQL 从查询到窗口函数笔记封面',
    tags: ['SQL', '窗口函数', '多表连接', '牛客 42 题'],
    repo: null,
    demo: null,
  },
];
