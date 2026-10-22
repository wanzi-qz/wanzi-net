// GitHub 项目展示数据：卡片信息 + 详情页结构化内容
// 卡片用于「02 项目展示」区块，详情页通过 hash 路由 #/project/<id> 访问
// 新增项目时在 featuredProjects 中追加一项即可，详情页与目录自动生成

const GH = 'https://github.com/wanzi-qz';
const IMG = 'projects/github';

export const featuredProjects = [
  {
    id: 'wanzi-mitosam',
    no: 'P.01',
    title: 'MitoSAM · 线粒体显微图像定量分析',
    tagline: '把 SAM 改进成线粒体分割模型，再从分割掩码里提取 130 维特征输出可量化的生物学指标。',
    period: '2024.03 — 2026.03',
    role: '硕士学位论文 · 核心研发',
    repo: `${GH}/wanzi-mitosam`,
    hero: `${IMG}/mitosam-flow.svg`,
    heroIsSvg: true,
    heroAlt: 'MitoSAM 技术管线：超分辨显微输入 → 预处理 → MitoSAM 分割 → 130 维特征与随机森林分类',
    metrics: [
      { value: 'Dice > 0.9', label: '单次点击分割（Otsu 基线 0.42）' },
      { value: '~130 维', label: '形态 / 纹理 / 空间三类特征' },
      { value: 'AUC 0.849', label: '全特征集 repeated-CV 分类' },
      { value: '~3%', label: '可训练参数占比（8GB 显存可微调）' },
    ],
    tags: ['PyTorch', 'Segment Anything', 'scikit-image', '随机森林', 'SHAP', 'Gradio', 'ONNX'],
    card: {
      heading: '从超分辨显微图像到线粒体异常指数',
      blocks: [
        { label: '项目背景', text: 'SIM/STED 超分辨显微镜下线粒体形态分析高度依赖人工，经典阈值法在 16-bit 动态范围、背景不均的图像上失效（Otsu Dice 仅 0.42）。' },
        { label: '实现路径', text: '冻结 SAM ViT 编码器、微调 ResNet-CBAM 适配器与掩码解码器实现点击式实例分割；再提取形态、纹理、空间分布三大类特征，用随机森林输出线粒体异常指数。' },
        { label: '工程交付', text: '批量 CLI + Gradio 三标签页 GUI + 一条命令复现全流程 + ONNX 导出（解码器约 20MB，脱离 PyTorch 部署）。' },
      ],
    },
    detail: {
      updated: '2026.03',
      date: '2024.03 — 2026.03',
      chips: ['学位论文工程', '分割大模型微调', 'MIT License'],
      lead: 'MitoSAM 是线粒体超分辨显微图像的可提示分割、定量与分类模型。它把 Meta 的 Segment Anything Model 改造成线粒体分割专家，并把分割掩码转化为生物学量化指标。',
      sections: [
        {
          id: 'background',
          title: '研究背景：为什么需要 MitoSAM',
          blocks: [
            { type: 'p', text: '线粒体是真核细胞的能量工厂，其形态——长度、分支数、网络连通性——与细胞代谢和功能状态直接相关。在 SIM/STED 超分辨显微镜下观察线粒体形态变化，是细胞功能研究的重要手段，也是本课题所在实验室的日常工作。' },
            { type: 'p', text: '但当时的形态分析高度依赖人工：研究者需要在每张显微图上逐根勾勒线粒体、逐个测量形态参数，一个视野耗时数十分钟；不同人的勾勒标准不一致，结果难以复现，更谈不上规模化统计。' },
            { type: 'p', text: '把它交给算法也不容易。SIM/STED 图像是 16-bit 动态范围、背景亮度不均，而线粒体本身细长、低对比、高频——经典的阈值分割在这种图像上几乎不可用：在留出数据上，Otsu 阈值法的 Dice 只有 0.42。' },
            { type: 'p', text: '这就是 MitoSAM 的出发点：用分割大模型 + 特征工程，把「人工看图」变成「可复现的定量结论」——单次点击分割达到 Dice > 0.9，再从掩码中提取约 130 维特征，输出可量化的线粒体异常指数。' },
          ],
        },
        {
          id: 'architecture',
          title: '架构设计：只训练 3% 的参数',
          blocks: [
            { type: 'p', text: '论文级的改动是小而精准的：SAM 的重型 ViT 图像编码器（ViT-H，2.5GB，在 10 亿掩码上训练）完全冻结，只教两个「便宜的」模块——一个是重加权 SAM 图像嵌入的 ResNet-CBAM 适配器，让细长、低对比的线粒体嵴在 ViT patch embedding 的 16 倍下采样中存活；另一个是全量微调的掩码解码器（dice + BCE 目标）。冻结主干让微调在单张 8GB 显卡上即可完成。' },
            {
              type: 'code',
              title: 'models/layers.py · CBAM 通道 + 空间注意力适配器',
              lang: 'python',
              code: `class CBAM(nn.Module):
    """Woo et al., ECCV 2018. 通道注意力回答「看什么」，
    空间注意力回答「看哪里」——后者正是恢复线粒体网络
    分支点的那一半。"""

    def __init__(self, channels: int, reduction: int = 8, kernel_size: int = 7):
        super().__init__()
        hidden = max(1, channels // reduction)
        self.channel_attention = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Conv2d(channels, hidden, 1, bias=False),
            nn.ReLU(inplace=True),
            nn.Conv2d(hidden, channels, 1, bias=False),
        )
        self.spatial_attention = nn.Sequential(
            nn.Conv2d(2, 1, kernel_size, padding=kernel_size // 2, bias=False),
            nn.Sigmoid(),
        )

    def forward(self, x):
        # --- 通道分支：avg / max 描述子共享 MLP
        avg_pool = self.channel_attention(x)
        max_pool = self.channel_attention(torch.amax(x, dim=(2, 3), keepdim=True))
        x = x * self.sigmoid(avg_pool + max_pool)
        # --- 空间分支
        avg_map = torch.mean(x, dim=1, keepdim=True)
        max_map = torch.amax(x, dim=1, keepdim=True)
        x = x * self.spatial_attention(torch.cat([avg_map, max_map], dim=1))
        return x`,
            },
            { type: 'p', text: '与 SAM 的对接通过一个独立的 bridge 模块完成：不 vendor、不重写 SAM，只依赖官方 segment_anything 包，升级到 SAM2 时只需要改一个文件。' },
          ],
        },
        {
          id: 'features',
          title: '从掩码到 130 维特征',
          blocks: [
            { type: 'p', text: '每个视野（FOV）的实例分割掩码被转化为约 130 维特征，分三大族：' },
            { type: 'list', items: ['形态学（28 维）：面积、长宽比、圆度、骨架分支数等', '纹理（46 维）：强度统计、GLCM 对比度 / 同质性、LBP 熵 / 能量', '空间分布（23 维）：最近邻距离、Voronoi 图、Ripley\'s K / L 函数'] },
            { type: 'p', text: '三大族特征各回答一个生物学问题：形态学描述「单根线粒体长什么样」，纹理描述「它内部结构是否均一」，空间分布描述「线粒体网络在视野里如何排布」。三者合并后经随机森林输出连续的异常指数。' },
          ],
        },
        {
          id: 'evaluation',
          title: '评估：不只报一个 AUC',
          blocks: [
            { type: 'p', text: '分类器是随机森林，评估流程刻意做得比常规更严格：repeated 5×10 折交叉消融、标签置换检验、SHAP 归因、Otsu 基线对照。全特征集 repeated-CV AUC 0.849 ± 0.093；标签置换检验观测 AUC 0.914 vs 零假设 0.515 ± 0.140（p = 0.02），说明信号是真实的、不是数据泄漏。' },
            { type: 'figure', src: `${IMG}/mitosam-ablation.webp`, caption: '特征族消融实验：不同特征组合的分类性能' },
            { type: 'figure', src: `${IMG}/mitosam-shap.webp`, caption: 'SHAP 归因：哪些特征在驱动分类决策' },
            { type: 'p', text: '一个诚实的说明：以上数字基于随附的合成基准（latent-severity 生成器，60 个 FOV 可扩展至 300）。真实数据（40 FOVs，因涉及课题未公开）上特征族 AUC 为 0.62（空间）至 0.99（形态+纹理），差异在 README 中如实标注。' },
            { type: 'figure', src: `${IMG}/mitosam-permutation.webp`, caption: '标签置换检验：观测 AUC 与零分布的对比' },
          ],
        },
        {
          id: 'engineering',
          title: '工程化与交付',
          blocks: [
            { type: 'list', items: ['批量 CLI 与 Gradio 三标签页 GUI（分割 / 量化 / 队列分析）', 'pipelines/run_all.py：一条命令复现全部表格与图表', 'ONNX 导出：解码器约 20MB，脱离 PyTorch 运行时部署', 'configs/default.yaml 集中管理全部超参数，results/ 目录下表格、图表、指标全部可复现'] },
          ],
        },
      ],
    },
  },

  {
    id: 'wanzi-lowlight-video',
    no: 'P.02',
    title: '低光视频增强 + 时序一致性',
    tagline: '从逐帧 U-Net 基线出发，用受控实验量化保真度 PSNR 与时序稳定性 tOF 两个核心指标的 trade-off。',
    period: '2026',
    role: '个人项目 · 独立完成',
    repo: `${GH}/wanzi-lowlight-video`,
    hero: `${IMG}/lowlight-flow.svg`,
    heroIsSvg: true,
    heroAlt: '低光视频增强实验管线：物理合成 → 逐帧 U-Net → T1/T2/T3 三条时序路线 → 保真度-稳定性评估',
    metrics: [
      { value: 'PSNR 25.32', label: 'B1 + T1 warp 融合（低光输入 14.88）' },
      { value: 'tOF −12.3%', label: '训练无关后处理的时序增益' },
      { value: '7 条', label: '防泄漏 / 防作弊硬规则全部落实' },
      { value: '一键复现', label: 'run_all_reproduce.py 全表格与图' },
    ],
    tags: ['PyTorch', 'U-Net', '光流 warp', 'ConvGRU', 'OpenCV', '可复现研究'],
    card: {
      heading: '单帧增强器用在视频上为什么会闪烁',
      blocks: [
        { label: '项目背景', text: '逐帧低光增强器在视频上会产生明显闪烁。本项目从 U-Net 逐帧基线出发，依次加入光流 warp 融合（T1）、训练期 warp 一致性损失（T2）、循环传播（T3），把 trade-off 完整量化。' },
        { label: '核心发现', text: '三条路线汇出同一个结论：tOF 的残差大头是内容相关的模型误差，不是噪声抖动——时序一致性的收益边界由模型本身的逐帧误差决定。' },
        { label: '可信度设计', text: '序列级数据划分、参数只在 val 上选、置换对照、tOF 光流固定在 GT 帧上估计、验收线先于实验写下、负结果入册。' },
      ],
    },
    detail: {
      updated: '2026',
      date: '2026',
      chips: ['受控实验', '负结果也入册', '全链路可复现'],
      lead: '单帧低光增强器用在视频上会闪烁。本项目从逐帧 U-Net 基线出发，依次加入光流 warp 融合（T1）、训练期 warp 一致性损失（T2）、循环传播（T3），把「保真度（PSNR）」和「时序稳定性（tOF）」的 trade-off 完整量化出来。这是一组受控实验：每个阶段先写验收标准，跑完再对照。',
      sections: [
        {
          id: 'results',
          title: '核心结论：一张散点图',
          blocks: [
            { type: 'p', text: '整个项目的核心结论浓缩在一张保真度–稳定性散点图里：gamma 提亮「变亮 ≠ 变好」（噪声被同步放大）；CLAHE 局部增益逐帧独立，闪烁被放大 65%；逐帧 U-Net 保真度大幅领先但闪烁仍在；T1 warp 融合作为训练无关的后处理把 tOF 砍掉 12.3%；T2 一致性损失被主损失淹没（负结果）；T3 循环传播收益仅约 2%（负结果）。' },
            { type: 'table', head: ['方法', 'PSNR↑', 'SSIM↑', 'tOF↓', 'tOF/tOF_in', '说明'], rows: [
              ['低光输入', '14.88', '0.615', '18.55', '1.000', 'EV=2.5 物理合成低光'],
              ['gamma(1.5)', '20.96', '0.646', '21.66', '1.186', '变亮 ≠ 变好，噪声被同步放大'],
              ['CLAHE', '19.82', '0.551', '31.38', '1.685', '局部增益逐帧独立 → 闪烁 +65%'],
              ['逐帧 U-Net（B1）', '24.83', '0.833', '28.20', '1.458', '保真度大幅领先，但闪烁仍被放大'],
              ['B1 + T1 warp 融合', '25.32', '0.855', '24.95', '1.271', '训练无关后处理，tOF −12.3%'],
              ['B1 + T2 warp 损失(λ=3)', '24.83', '0.833', '28.20', '1.458', '时序约束被主损失淹没（诊断见下）'],
              ['B1 + T2 + T1', '25.32', '0.855', '24.95', '1.271', '当前最优组合'],
              ['B1 + T3 循环传播', '24.29', '0.797', '28.49', '1.479', '循环收益仅 ~2%，负结果'],
            ] },
            { type: 'figure', src: `${IMG}/llv-scatter.webp`, caption: '保真度–稳定性 trade-off 散点图（reports/m5_scatter.png）：三条路线汇出同一个发现——tOF 的残差大头是内容相关的模型误差，不是噪声抖动', wide: true },
          ],
        },
        {
          id: 'synthesis',
          title: 'M1 · 物理低光合成管线',
          blocks: [
            { type: 'p', text: '为什么需要「合成」而不是直接找真实低光视频？因为真实低光数据集没有与暗帧严格配准的正常曝光 GT，没有可靠 GT 就没有 PSNR/SSIM，所有结论都会退化成「看着更好」。合成管线牺牲噪声分布的真实性，换来可证伪的实验设计。' },
            { type: 'p', text: '退化按光路顺序建模：sRGB 解码 → 曝光不足（α = 2^EV）→ 散粒噪声（Poisson，信号相关）→ 读出噪声（加性）→ 相机增益 → 白平衡 → sRGB 编码 → 8bit 量化 → JPEG 压缩。只做 gamma 变暗是不行的——那样的图里没有噪声，模型一行代码就能完美恢复，PSNR 虚高到 40dB+，一到真实数据立刻崩。' },
            {
              type: 'code',
              title: 'src/synthesis.py · degrade_frame：物理退化主函数',
              lang: 'python',
              code: `def degrade_frame(rgb_u8, cfg=None, rng=None, return_linear=False):
    """把一张正常曝光的 sRGB uint8 图退化成低光帧。"""
    cfg = cfg or LowLightConfig()
    rng = rng or np.random.default_rng(0)

    lin = srgb_to_linear(rgb_u8)  # uint8 → LUT 查表，无损且快

    # 1) 曝光不足：光子数减少
    lam = lin * cfg.full_well / cfg.alpha

    # 2) 散粒噪声（信号相关）+ 读出噪声（信号无关）
    # 「混合采样」：λ > 10 的像素用高斯近似 N(λ, λ)（泊松的正态近似），
    # λ ≤ 10 保留精确泊松 —— 暗部恰恰是泊松和高斯差异最大的地方
    # （偏态、离散），必须精确。实测单帧 ~80ms → ~45ms。
    lam32 = lam.astype(np.float32)
    exact = lam32 <= 10.0
    z = rng.standard_normal((2,) + lam32.shape).astype(np.float32)
    sq = np.sqrt(lam32, dtype=np.float32)
    electrons = np.where(exact, 0.0, lam32 + sq * z[0])   # 亮区高斯近似`,
            },
          ],
        },
        {
          id: 'temporal',
          title: 'M4 · T1 光流 warp 融合',
          blocks: [
            { type: 'p', text: 'T1 是一个训练无关的时序稳定后处理，原理是「多帧降噪」：逐帧增强输出里的噪声每帧独立，把相邻帧 warp 对齐后做遮挡感知的加权平均，噪声方差按 1/N 下降，而信号（场景内容）是对齐的，平均不损伤细节——手机夜景模式的底层就是它。' },
            { type: 'p', text: '三个设计决定：光流必须从推理时可得的低光帧上估计（用 GT 流是 oracle 实验）；前向-后向一致性掩码挡住遮挡/露出的像素，防止 ghosting；光度置信度 + 锚定当前帧（权重恒为 1），保证最坏情况退化为原始逐帧输出——融合只会变稳，不会比不用更差。' },
            {
              type: 'code',
              title: 'src/temporal/fuse.py · 融合参数：为什么是过去/未来各 4 帧',
              lang: 'python',
              code: `@dataclass(frozen=True)
class FuseParams:
    """past/future 各融合几帧。权重按几何衰减，当前帧恒为 1（锚）。

    第一版只融合过去 2 帧，tOF 只降 4.8%（验收 FAIL）——平均的
    独立噪声帧数太少。多帧降噪的理论是方差 ~ 1/N：想砍一半闪烁，
    N 得翻几倍。离线处理没有因果约束，未来帧一样能用。
    """
    past: int = 4
    future: int = 4
    weight_decay: float = 0.55      # 每远一帧权重乘 0.55
    phot_sigma: float = 0.10        # 光度权重的温度（0-1 尺度）
    fb_thresh: float = 1.0          # 前向-后向一致性阈值（像素）
    flow_blur: float = 1.5          # 估流前对灰度图的高斯模糊 σ（抗低光噪声）`,
            },
            { type: 'figure', src: `${IMG}/llv-t1-compare.webp`, caption: 'T1 warp 融合前后的对比：闪烁被显著抑制', wide: true },
          ],
        },
        {
          id: 'honesty',
          title: '让结果可信的七条硬规则',
          blocks: [
            { type: 'list', items: ['序列级划分（train 8 / val 2 / test 3）+ 脚本自检无重叠——帧级随机划分是本领域常见的隐性泄漏', '参数只在 val 上选（B0 网格搜索、T1 扫 48 组），test 一次性使用', '测试噪声固定 seed，训练噪声每 epoch 在线重采样，两种口径写进报告', '置换对照：把 T1 的光流随机打乱，融合必须失效或变差（shuffled tOF 32.08 vs 正常 24.95）', 'tOF 的光流固定在 GT 帧上估计——防止「把画面糊掉骗取低 tOF」的指标作弊', '验收线先于实验写下，不达标不进下一阶段（M3 的错误报告曾因此被拦下重做）', '负结果入册：T2 第一轮 λ=0.3 无效、T3 两条证据链完整，过程全部保留在 reports/'] },
            { type: 'figure', src: `${IMG}/llv-failure.webp`, caption: '失败案例分析：方法在快速运动场景的失效模式也被如实记录' },
            { type: 'p', text: '工程坑也有记录：双零初始化让主干梯度恒 0；AMP 下 autocast 是 thread-local，内部 .float() 也拦不住 conv 转 fp16 导致 SSIM 梯度 NaN；cv2.imread 在 Windows 中文路径下静默失败，必须 np.fromfile + imdecode。' },
          ],
        },
      ],
    },
  },

  {
    id: 'wanzi-induvision',
    no: 'P.03',
    title: 'InduVision · 工业缺陷检测与端侧部署闭环',
    tagline: 'MVTec AD 上训练 YOLOv8-seg 做缺陷分割，走 ONNX → TensorRT 三档量化，用 C++ API 写推理服务并压测。',
    period: '2026 · 进行中',
    role: '个人项目 · 独立完成',
    repo: `${GH}/wanzi-induvision`,
    hero: `${IMG}/induvision-flow.svg`,
    heroIsSvg: true,
    heroAlt: 'InduVision 技术管线：MVTec AD → YOLOv8-seg 训练 → Copy-Paste 增强 → ONNX 导出 → TensorRT 量化 → C++ 推理服务',
    metrics: [
      { value: 'mAP50-95 +66%', label: 'Copy-Paste 缺陷合成（0.2453 → 0.4071）' },
      { value: '228 条', label: 'pytest 单测，纯 CPU、不联网可跑' },
      { value: '5354 张', label: 'MVTec AD 15 类全量数据' },
      { value: 'FP32/FP16/INT8', label: 'TensorRT 三档量化对照' },
    ],
    tags: ['YOLOv8-seg', 'ONNX', 'TensorRT', 'C++', 'MVTec AD', 'pytest + CI'],
    card: {
      heading: '从数据转换到端侧部署的完整闭环',
      blocks: [
        { label: '项目背景', text: '在 MVTec AD 数据集上训练 YOLOv8-seg 做工业缺陷分割，再走 ONNX → TensorRT 三档量化（FP32/FP16/INT8），最后用 TensorRT C++ API 写推理服务并做端到端压测。' },
        { label: '硬件约束', text: 'RTX 4060 Laptop 8GB / Windows 11——所有工程决策围绕「8GB 显存怎么把链路跑完整」展开，文档数字全部为本机实测，未跑到的阶段一律标「待测」。' },
        { label: '工程素养', text: '核心库只依赖 numpy / opencv / pyyaml（刻意不含 torch，CI 全量可跑）；数据 sha256 逐文件校验；GitHub Actions 双系统 × 双 Python 版本。' },
      ],
    },
    detail: {
      updated: '2026',
      date: '2026 · 进行中',
      chips: ['个人项目', '部署闭环', '本机实测数字'],
      lead: '工业缺陷检测与端侧部署闭环：在 MVTec AD 数据集上训练 YOLOv8-seg 做缺陷分割，再走 ONNX → TensorRT 三档量化（FP32/FP16/INT8），最后用 TensorRT C++ API 写推理服务并做端到端压测。硬件为 RTX 4060 Laptop 8GB / Windows 11，所有工程决策围绕「8GB 显存怎么把链路跑完整」展开。',
      sections: [
        {
          id: 'pipeline',
          title: '技术管线与进度',
          blocks: [
            { type: 'p', text: '项目按周（W0–W4）推进，每个阶段完成即冻结、出实测数字，未跑到的阶段一律标「待测」、不预填：' },
            { type: 'table', head: ['阶段', '内容', '状态'], rows: [
              ['W0', 'GPU 环境搭建 + 自检脚本（版本 / GPU / 推理 / ONNX 导出）', '完成'],
              ['W1a', 'MVTec 下载校验 + YOLO-seg 转换管线 + 单测 + CI', '完成'],
              ['W1b', '15 类全量数据（5354 图）+ 基线训练', '数据就位，训练中'],
              ['W2', 'Copy-Paste 缺陷合成 + Focal Loss + 消融', '4/5 组出数（Copy-Paste 使 mask mAP50-95 从 0.2453 → 0.4071，+66%；focal 为负收益）'],
              ['W3', 'ONNX 导出 + trtexec 三档量化（INT8 熵校准）', '未开始'],
              ['W4', 'TensorRT C++ 推理服务（零拷贝 + 三线程流水线）+ 压测', '未开始'],
            ] },
          ],
        },
        {
          id: 'augmentation',
          title: 'W2 · Copy-Paste 缺陷合成',
          blocks: [
            { type: 'p', text: '缺陷样本稀缺是小样本工业检测的通病。Copy-Paste 从训练集抠出真实缺陷实例（只从 train 抠、防止泄漏），贴到正常样本上并做光度抖动与泊松融合，让 mask mAP50-95 从 0.2453 提升到 0.4071（+66%）。' },
            {
              type: 'code',
              title: 'induvision/copy_paste.py · blend_patch：泊松融合的边界处理',
              lang: 'python',
              code: `def blend_patch(img, patch, soft, hard, x, y, *, mode, poisson_min_area):
    """把 patch 融进 img 的 (x,y) 处，返回 (融合后的 ROI, 实际用的模式)。"""
    h, w = img.shape[:2]
    ph, pw = patch.shape[:2]
    x0, y0 = max(x, 0), max(y, 0)
    x1, y1 = min(x + pw, w), min(y + ph, h)
    if x1 <= x0 or y1 <= y0:
        return img[y0:y1, x0:x1], "none"
    roi = img[y0:y1, x0:x1]
    p_roi = patch[y0 - y : y1 - y, x0 - x : x1 - x]
    s_roi = soft[y0 - y : y1 - y, x0 - x : x1 - x][..., None]
    h_roi = hard[y0 - y : y1 - y, x0 - x : x1 - x]

    if mode == "poisson" and float(np.count_nonzero(h_roi)) >= poisson_min_area:
        # seamlessClone 要求掩码不贴 dst 边界、且完全落在 dst 内，否则抛异常
        interior = x0 > 0 and y0 > 0 and x1 < w and y1 < h
        if interior:
            m = np.where(h_roi > 0, 255, 0).astype(np.uint8)
            m = cv2.erode(m, np.ones((3, 3), np.uint8), iterations=1)
            ...`,
            },
            { type: 'p', text: '一个反直觉的消融结果：Focal Loss 在这套设置下是负收益。类别不均衡诊断显示合成配额已经把不均衡拉回健康区间，此时 focal 的降权反而拖慢收敛——这个负结果同样被记录进消融报告。' },
            {
              type: 'code',
              title: 'induvision/focal.py · 可装卸的 Focal Loss（与 ultralytics 零耦合）',
              lang: 'python',
              code: `def focal_bce_with_logits(pred, target, gamma=2.0, alpha=0.25):
    """逐元素 focal loss，不做 reduction（调用方自己 mean/sum）。

    gamma=0 且 alpha=None 时退化为标准 BCE，单测就拿这条做等价性断言。
    """
    bce = F.binary_cross_entropy_with_logits(pred, target, reduction="none")
    if gamma == 0.0 and alpha is None:
        return bce
    p = torch.sigmoid(pred)
    p_t = target * p + (1.0 - target) * (1.0 - p)
    loss = bce * (1.0 - p_t) ** gamma
    if alpha is not None:
        loss = loss * (target * alpha + (1.0 - target) * (1.0 - alpha))
    return loss


class FocalBCEWithLogitsLoss(nn.Module):
    """与 nn.BCEWithLogitsLoss(reduction="none") 签名一致。

    ultralytics 的 v8DetectionLoss 里 cls 分支就是 self.bce(pred, target)
    逐元素算完再自己聚合，所以只要把 criterion.bce 换成这个对象即可，
    不需要改 ultralytics 一行源码。""",
`,
            },
          ],
        },
        {
          id: 'engineering',
          title: '工程约束下的取舍',
          blocks: [
            { type: 'list', items: ['核心库（induvision/）只依赖 numpy / opencv / pyyaml，刻意不含 torch——CI 可以全量跑 228 条 pytest，纯 CPU、不联网', '数据不入库：data/ weights/ out/ runs/ 全部 .gitignore，CI 有守卫断言防误提交', 'MVTec AD 官方 zip / HF 镜像双通道下载，sha256 逐文件校验、硬链接落盘省 2GB 磁盘', 'PowerShell 运维脚本：守护训练、幂等消融队列、整夜串联——8GB 显卡一晚跑完一组消融', 'GitHub Actions：ubuntu + windows × py3.10 / 3.12 四组矩阵，针对国内网络提供 gh-proxy / hf-mirror / 清华 pip 源方案'] },
          ],
        },
      ],
    },
  },
];

export function getProjectById(id) {
  return featuredProjects.find((item) => item.id === id) || null;
}
