# UI 设计指南

> **设计类型**: App 设计（应用架构设计）
> **确认检查**: 本指南适用于可交互的应用/网站/工具。

> ℹ️ Section 1 为设计意图与决策上下文。Code agent 实现时以 Section 2 及之后的具体参数为准。

## 1. Design Archetype (设计原型)

### 1.1 内容理解

- **目标用户**: 海外设计评审团队 + 内部产品走查人员；需快速理解 App 交互逻辑与视觉质感
- **核心目的**: 建立信任 + 引导体验；无需真机即可完整验证「选模式→启动→运行→暂停」闭环
- **情绪基调**: 科技简约 / 干净通透；避免廉价感、信息过载、装饰冗余

### 1.2 设计方向

- **Design Style**: Frosted Glass 毛玻璃 — 契合智能家居高端质感，毛玻璃底栏+轻阴影增强沉浸感
- **Application Type**: Tool（交互式 Demo 展示台）— 三栏固定布局，聚焦中间手机舞台
- **Aesthetic Direction**: 低饱和冰蓝渐变基底 + 品牌蓝唯一高饱和锚点 + 大圆角卡片 + 线性图标

## 2. Color System (色彩系统)

**色彩关系**: 浅冰蓝渐变背景(#E6EFF9→#FFFFFF) + 纯白卡片容器 + 品牌蓝#4080FF 作为唯一强调色
**配色设计理由**: 海外智能家居审美偏好低饱和柔和色系，品牌蓝作为功能锚点避免视觉噪音
**主色推导**: #4080FF 直接映射清洗机 App 核心操作态（选中/激活/进度），贯穿 Demo 全流程
**使用比例**: 70% 中性背景 / 20% 白色容器 / 10% 品牌蓝（仅限选中态、激活按钮、进度标识）

### 2.1 主题颜色

| Token                | HSL 值                  | 说明                                         |
| -------------------- | ----------------------- | -------------------------------------------- |
| `background`         | hsl(210 30% 97%)        | 页面底色，浅冰蓝渐变起始色                   |
| `card`               | hsl(0 0% 100%)          | 卡片/容器背景                                |
| `foreground`         | hsl(0 0% 12%)           | 主文字，深灰黑                               |
| `muted-foreground`   | hsl(0 0% 45%)           | 次要文字，中灰                               |
| `primary`            | hsl(220 100% 63%)       | 品牌蓝 #4080FF，选中/激活/CTA                |
| `primary-foreground` | hsl(0 0% 100%)          | 主交互文字/图标                              |
| `accent`             | hsl(220 60% 95%)        | 次级交互反馈，极浅蓝 hover/focus 背景        |
| `accent-foreground`  | hsl(220 100% 40%)       | accent 上的文字                              |
| `border`             | hsl(220 15% 90%)        | 默认边框，浅灰蓝                             |
| `selected-bg`        | hsl(220 80% 94%)        | 选中态卡片背景 #E0EBFF                       |
| `disabled`           | hsl(0 0% 78%)           | 禁用态文字/图标 #C7C7CC                      |

### 2.2 导航区配色

- **基调关系**: 左侧目录栏复用主配色，无独立基底色；选中项用 primary + 左侧竖线标识
- **关键状态**: 默认 muted-foreground / 激活 primary + bg-accent / Hover bg-accent；对比度 ≥ 4.5:1
- **边界与背景**: 非透明背景 hsl(0 0% 100%)；右侧 1px border-border 分隔内容区

### 2.3 语义颜色

| 用途       | HSL 值           | 衍生说明                          |
| ---------- | ---------------- | --------------------------------- |
| 完成/就绪  | hsl(155 65% 52%) | #36D399，已完成步骤标识点         |
| 运行中     | hsl(220 100% 63%) | 复用 primary，当前进行步骤        |
| 警告/暂停  | hsl(35 90% 55%)  | 橙黄，暂停态辅助提示（仅大字号）  |

## 3. Typography (字体排版)

- **Heading**: SF Pro Display / -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Body**: SF Pro Text / -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **字体策略**: iOS 原生字体栈确保 Demo 内页面与真实设备一致；回退覆盖 Windows/Android 评审环境

## 4. Layout Strategy (布局策略)

- **导航意图**: 左侧固定目录栏（约 220px）作为全局导航；至多一套；非透明背景 + 右边框分隔
- **页面架构**: 三栏均衡布局（目录｜iPhone 舞台｜描述面板）；整体 max-w-[1400px] 居中
- **响应式**: 桌面端三栏并列；移动端隐藏左右栏，仅保留手机 Demo + 底部 Tab 切换目录

## 5. Visual Language (视觉语言)

- **形态参数**: 圆角 rounded-3xl (1.5rem) · 阴影 shadow-xl + blur · 间距 spacious (p-8/gap-6)
- **识别签名**: iPhone 边框悬浮柔光阴影 · 毛玻璃底部操作栏(backdrop-blur-xl) · 品牌蓝左侧竖线激活态
- **装饰策略**: 仅顶部冰蓝渐变 + 设备渲染图蒸汽微动效；无额外图形装饰
- **动效原则**: 页面切换 fade 300ms · 按钮 hover scale-105 150ms · 选中态过渡 200ms ease-out
- **可及性**: 正文对比度 ≥ 4.5:1；渐变背景文字加 text-shadow；交互元素有明确 focus ring

## 6. Component Principles (组件原则)

- **状态完整性**: 模式卡片 Default/Hover/Selected/Disabled 四态完整；底部按钮 Active 态缩放反馈
- **层级清晰**: 黑色圆形主按钮 > 灰色辅助按钮；选中卡片蓝底蓝边 vs 默认白底灰边
- **一致性**: 所有图标 2px 线性描边；所有卡片统一 rounded-2xl + shadow-sm；颜色仅用语义 token

## 7. Image Direction (图片与视觉资产)

- **Image Role**: Hero（设备预览区 3D 渲染图）+ 章节头图（可选模式图标组）
- **Image Art Direction**: 纯白/浅蓝渐变背景 · 柔和顶光 · 磨砂金属+透明水箱材质 · 悬浮感 · 极简干净
- **Image Prompt Keywords**: smart cleaning device, 3D render, white and silver, frosted glass tank, soft studio lighting, floating shadow, minimalist, iOS style, clean background, product photography
- **Image Avoidance**: 复杂场景背景、人物手持、过度反光、卡通化渲染、多设备堆叠

## 8. 应避免 (Anti-patterns)

- ❌ 在 Demo 外壳层添加 Footer/Sidebar/统计卡片等与评审任务无关的模板元素
- ❌ 手机屏幕内使用深色主题或高饱和渐变，违背「低饱和柔和」海外审美基准
- ❌ 目录栏与右侧描述面板使用不同字体/字号体系，破坏三栏视觉统一性