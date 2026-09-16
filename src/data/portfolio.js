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

export const intro = {
  kicker: 'WANG JIARUI · DATA ANALYST · 2026',
  titleLines: ['欢迎来到', '我的世界'],
  tagline: '一个用数据、代码和好奇心搭起来的小世界。深呼吸，点一下，走进来。',
  enter: '进入我的世界',
  skip: '跳过 SKIP',
};

export const marquee = [
  '数据分析',
  'DATA ANALYSIS',
  '可视化',
  'VISUALIZATION',
  'SQL',
  'EXCEL',
  'PYTHON',
  'TABLEAU',
  '统计建模',
  'STATISTICAL MODELING',
];

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

export const advantages = [
  {
    title: '数理统计科班 + 图像算法硕士',
    desc:
      '电子科技大学数学（应用统计方向）本科、华南师范大学控制工程硕士，概率统计、假设检验、回归与聚类基础扎实；3 次以队长身份参加数学建模竞赛并全部获奖。',
  },
  {
    title: '独立跑通数据分析全流程',
    desc:
      '从需求拆解、SQL 取数、Python / Excel 清洗建模到 Tableau 看板与业务结论；处理过 4,400+ 条订单明细与 2,300+ 条门店日报，独立交付交互式经营看板。',
  },
  {
    title: '工程化 + AI 提效',
    desc:
      '熟练 Python（pandas / NumPy / scikit-learn），用脚本与 GUI 沉淀分析流程，将硕士课题单次分析耗时从数小时压缩至分钟级；熟悉 Prompt Engineering 与 Agent 工作流。',
  },
  {
    title: '沟通与交付',
    desc:
      '擅长把分析结论翻译成非技术角色能听懂的图表与报告；硕士课题成果沉淀为 GUI 分析工具并在课题组内推广使用。',
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
    title: 'SQL 数据查询',
    desc: '掌握多表关联与窗口函数，能够按分析口径完成查询、聚合与结果校验。',
    tags: ['多表关联', '窗口函数', '聚合统计'],
  },
  {
    no: '02',
    title: 'Python 数据分析',
    desc: '使用 Python 生态完成数据清洗、可视化和基础机器学习，沉淀可复用分析流程。',
    tags: ['Pandas', 'NumPy', 'Scikit-learn'],
  },
  {
    no: '03',
    title: 'Excel / BI 报表',
    desc: '高效完成数据清洗、透视分析、函数计算与图表表达，支持日常业务快速决策。',
    tags: ['数据清洗', '透视表', '函数与图表'],
  },
  {
    no: '04',
    title: '统计分析与建模',
    desc: '扎实掌握假设检验、回归与聚类方法，能够完成高维特征筛选、降维与差异显著性验证。',
    tags: ['假设检验', '回归分析', 'PCA 降维'],
  },
  {
    no: '05',
    title: 'Tableau 可视化',
    desc: '能够搭建交互看板，将复杂数据转化为直观的趋势、构成与关键指标表达。',
    tags: ['交互看板', '指标呈现', '联动筛选'],
  },
  {
    no: '06',
    title: 'AI 工具应用',
    desc: '熟悉 Prompt Engineering 与 Agent 工作流，用 AI 辅助分析并将重复流程沉淀为可复用工具。',
    tags: ['Prompt Engineering', 'Agent 工作流', '流程沉淀'],
  },
];

export const notes = [
  {
    no: 'N.01',
    id: 'excel',
    title: 'Excel 报表搭建',
    source: 'OBSIDIAN / 数据分析',
    summary:
      '跟着课程把 Excel 报表开发完整走了一遍，从看懂业务指标，到函数取数，最后做成一份能筛选、能直接看的周报。',
    points: [
      '业务口径：GMV、UV / PV、CPC、到手率、进店与下单转化率',
      '数据透视表 + 切片器 + 数据透视图，实现跨表联动筛选',
      '常用函数：SUMIF / SUMIFS、IF + AND、VLOOKUP、INDEX + MATCH、SUBTOTAL',
      '同比环比：YEAR / MONTH / DATE / EDATE / EOMONTH 拼出各种日期口径',
      '周报开发：指标体系 + 下拉筛选 + 条件格式（数据条 / 图标集）做可视化',
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
    title: 'SQL 从入门到窗口函数',
    source: 'OBSIDIAN / 数据分析',
    summary:
      '把 SQL 的语法结构和真实运行顺序捋清楚，再从单表查询走到多表连接、子查询和窗口函数，最后自己搭了一套云端 MySQL 随时练手。',
    points: [
      '书写顺序 SELECT-FROM-WHERE-GROUP BY-HAVING-ORDER BY-LIMIT，运行却是 FROM 先走、SELECT 最后',
      '条件筛选：LIKE、BETWEEN、IN、NULL 判断与操作符混合使用',
      '聚合分组：COUNT / SUM / AVG 配 GROUP BY，分清 WHERE 与 HAVING',
      '高级语句：窗口函数、表连接（inner / left / right）、子查询',
      '自建云端 MySQL，用 DataGrip 连真实业务表练查询',
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
    ],
  },
  {
    no: 'N.03',
    id: 'sql-nowcoder',
    title: 'SQL 刷题 · 牛客 42 题',
    source: 'OBSIDIAN / 数据分析',
    summary:
      '在牛客网 SQL 必知必会题库把 SQL1 到 SQL42 刷完，每题都记了思路和踩过的坑，还整理出一份需要二刷的题目清单。',
    points: [
      '基础查询：distinct 去重、limit、多列排序、字段重命名',
      '多表 join + 分组统计，count(distinct ...) 与 round(..., 4) 控制精度',
      'union all 合并结果集，case when 做年龄段分桶和自定义字段',
      '日期函数 day() / month() 提取，算 8 月每日练题量与次日留存率',
      '二刷清单：SQL21、22、25、26、27、29、32',
    ],
    links: [
      {
        label: '牛客 SQL 题库',
        href: 'https://www.nowcoder.com/exam/oj?page=1&tab=SQL%E7%AF%87&topicId=199',
      },
    ],
  },
];
