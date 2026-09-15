export const profile = {
  name: '王嘉瑞',
  nameEn: 'WANG JIARUI',
  role: '数据分析师',
  roleEn: 'Data Analyst',
  introLead: '把复杂数据，翻译成清晰决策。',
  introParagraphs: [
    '数学与应用数学本科，控制工程图像算法方向硕士。长期围绕科研与业务数据完成清洗、特征提取、统计建模和可视化，习惯从问题出发，把数据能说明什么讲成可验证的结论。',
    '数理基础扎实，逻辑思维清晰，擅长在复杂表格和高维特征中找到关键变量；也熟悉 AI 工具，常用 Prompt Engineering 与 Agent 辅助分析，并将重复流程沉淀为可复用工具。',
  ],
};

export const heroMeta = [
  {
    label: '教育背景 / EDUCATION',
    lines: ['数学（本科）', '图像算法（硕士）'],
  },
  {
    label: '核心技能 / TOOLKIT',
    lines: ['Excel · SQL · Tableau · Python'],
  },
  {
    label: '竞赛荣誉 / AWARDS',
    lines: ['数学建模国家级奖项 ×2', '华为杯 · 数维杯 国家三等奖'],
  },
];

export const capabilities = [
  {
    tool: 'Excel',
    label: '数据处理与分析',
    detail: '高效完成数据清洗、透视分析、函数计算与图表表达。',
  },
  {
    tool: 'Tableau',
    label: '可视化与看板',
    detail: '把分析结论转化为可交互看板，清晰呈现趋势与关键指标。',
  },
  {
    tool: 'SQL',
    label: '查询与取数',
    detail: '掌握多表关联、窗口函数与聚合统计，按口径提取分析数据。',
  },
  {
    tool: 'Python',
    label: '建模与自动化',
    detail: '使用 Pandas、Matplotlib 与机器学习方法完成自动化分析。',
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
    direction: '应用统计方向',
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
    title: '线粒体显微图像定量分析',
    period: '2024.03 — 2026.03',
    role: '核心研发',
    area: '科研数据分析',
    visual: 'microscope',
    image: 'projects/project-1.png',
    intro:
      '针对线粒体形态分析高度依赖人工、效率低下的痛点，设计并实现一套从图像分割到定量分析的全流程智能解决方案。',
    points: [
      '对高噪声显微图像完成清洗、归一化与增强，构建高质量训练与测试集',
      '提取形态学、纹理、空间分布三大类数十维特征，通过统计学筛选与降维识别关键鉴别性特征',
      '用聚类、回归与差异显著性检验支撑科研假设验证，并开发 GUI 工具提升团队标准化水平',
      '实现自动化分析，将单次分析耗时从数小时缩短至分钟级',
    ],
    tags: ['图像数据处理', '特征工程', '统计建模', 'GUI 自动化'],
  },
  {
    no: 'P.02',
    title: '数学建模竞赛',
    period: '2023 — 2024',
    role: '队长',
    area: '建模竞赛',
    visual: 'contest',
    image: 'projects/project-2.png',
    intro:
      '连续担任数学建模竞赛队长，完成题目拆解、数据预处理、模型设计与论文交付，累计获得三项竞赛奖项。',
    points: [
      '2023 华为杯研究生数学建模竞赛 · 国家三等奖',
      '2024 数维杯数学建模竞赛 · 国家三等奖',
      '2024 华师数学建模校赛 · 二等奖',
    ],
    tags: ['数学建模', '团队协作', '论文写作'],
  },
  {
    no: 'P.03',
    title: '数据分析方法',
    period: '持续积累',
    role: '个人沉淀',
    area: '方法与实践',
    visual: 'toolkit',
    image: 'projects/project-3.png',
    intro:
      '围绕取数、分析、可视化与 AI 协作建立个人工作流，覆盖从数据清洗到结论输出的常用方法。',
    points: [
      '使用 SQL 完成多表关联与窗口函数计算，掌握 Tableau 看板搭建',
      '熟练使用 Python、NumPy、Scikit-learn、Matplotlib 与 MATLAB',
      '了解 Prompt Engineering 与 Agent 基本概念，并用于辅助数据分析',
    ],
    tags: ['SQL', 'Tableau', 'Python', 'AI 工具'],
  },
];

export const strengths = [
  {
    no: '01',
    title: 'Excel 数据分析',
    desc: '熟练处理表格数据，完成清洗、透视、函数与图表分析，支持日常业务快速决策。',
    tags: ['数据清洗', '透视表', '函数与图表'],
  },
  {
    no: '02',
    title: 'Tableau 可视化',
    desc: '能够搭建交互看板，将复杂数据转化为直观的趋势、构成与关键指标表达。',
    tags: ['交互看板', '指标呈现', '数据探索'],
  },
  {
    no: '03',
    title: 'SQL 查询取数',
    desc: '掌握多表关联与窗口函数，能够按分析口径完成查询、聚合与结果校验。',
    tags: ['多表关联', '窗口函数', '聚合统计'],
  },
  {
    no: '04',
    title: 'Python 分析建模',
    desc: '使用 Python 生态完成数据整理、可视化和基础机器学习，沉淀可复用分析流程。',
    tags: ['Pandas', 'Matplotlib', 'SciKit-learn'],
  },
];
