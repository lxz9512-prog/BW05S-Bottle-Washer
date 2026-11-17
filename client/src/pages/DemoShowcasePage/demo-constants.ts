export interface SubModeConfig {
  id: string;
  label: string;
  enabled: boolean;
  duration: number;
  min: number;
  max: number;
  step: number;
  unit: 'min' | 'h';
}

export interface ModeConfig {
  modeId: string;
  modeLabel: string;
  breastPumpSets?: number;
  teetherRange?: string;
  babyDishCount?: string;
  materialType?: string;
  customSteps?: SubModeConfig[];
}

export const DEFAULT_CUSTOM_MODES: SubModeConfig[] = [
  { id: 'wash', label: 'Wash', enabled: false, duration: 29, min: 19, max: 45, step: 1, unit: 'min' },
  { id: 'sterilize', label: 'Steam', enabled: false, duration: 9, min: 7, max: 10, step: 1, unit: 'min' },
  { id: 'dry', label: 'Dry', enabled: false, duration: 55, min: 40, max: 70, step: 5, unit: 'min' },
  { id: 'keep-warm', label: 'Keep Warm', enabled: false, duration: 72, min: 10, max: 72, step: 1, unit: 'h' },
];

export interface DemoScreen {
  id: string;
  label: string;
  title: string;
  description: string[];
}

export const DEMO_SCREENS: DemoScreen[] = [
  {
    id: 'device-control',
    label: '设备控制',
    title: '设备控制',
    description: [
      '清洗机设备控制页面，包含模式选择和运行控制功能。',
      '点击可进入清洗机待机态首页，选择清洗模式并启动设备。',
    ],
  },
  {
    id: 'home',
    label: '① 模式选择页',
    title: '模式选择页',
    description: [
      '本页为清洗机待机态首页，展示设备外观与模式选择。',
      '页面顶部显示设备渲染图，导航栏提供返回和设备设置。',
      '下方按推荐、日常、精细和自定义四组展示模式卡片。',
      '选中模式卡片高亮为蓝底白字，支持立即启动或预约启动。',
    ],
  },
  {
    id: 'custom-mode',
    label: '② 自定义模式',
    title: '自定义模式配置',
    description: [
      '本页为 Custom 模式专属配置页，从模式选择页点击 Custom 卡片进入。',
      '通过底部弹层配置清洗步骤，初始全部不勾选。',
      'Wash/Steam/Dry/Keep Warm 可独立启用，支持步进或输入时长。',
      'Wash 19–45 分钟、Steam 7–10 分钟、Dry 40–70 分钟、Keep Warm 10–72 小时。',
      '点击 Start 按钮进入运行态，按配置执行清洗流程。',
    ],
  },
  {
    id: 'smart-mode',
    label: '③ Smart Mode 运行',
    title: 'Smart Mode 运行页',
    description: [
      '本页为 Smart Mode 专属运行页面，显示当前清洗进度。',
      '显示设备渲染图、模式名称和剩余时间，等待数据时显示骨架屏。',
      '进度卡片显示清洗步骤列表：Wash/Steam/Dry/Keep Warm。',
      '运行中底部主按钮为暂停图标，点击可切换暂停/继续状态。',
    ],
  },
  {
    id: 'run-control',
    label: '④ 运行控制',
    title: '运行控制页',
    description: [
      '本页为其他模式的设备运行态，显示当前清洗进度。',
      '设备渲染图下方显示模式名称和剩余时间，支持童锁。',
      '步骤列表以蓝色勾选、蓝色圆点和灰色分别区分已完成、进行中和待执行，关闭步骤显示 Off。',
      '运行中底部主按钮为暂停图标，点击可切换暂停/继续状态。',
    ],
  },
  {
    id: 'device-info',
    label: '设备信息',
    title: '设备信息页',
    description: [
      '从设备设置页点击设备名称进入。',
      '展示设备图片、可编辑名称、SN/MAC 地址（支持复制）、Wi-Fi 连接信息。',
    ],
  },
];
