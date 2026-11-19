import { useState, useMemo } from 'react';
import { ChevronLeft, Plus, ChevronRight } from 'lucide-react';
import BabyItemDetailScreen from './BabyItemDetailScreen';
import BabyItemForm from './BabyItemForm';
import { useLocale } from './useLocale';
import { useDarkMode } from './useDarkMode';
import { BABY_ITEMS_DARK_THEME } from './dark-themes';
import { BABY_ITEMS_LIGHT_THEME } from './light-themes';
import { useDemoPage } from '../../demo/react';
import { machineLocal as demoLocal } from './machine-models';
import { demoEngine } from '../../demo/engine';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isApp } from '../../runtime';

function parseReplaceMonths(replaceEvery: string): number {
  const match = replaceEvery.match(/\d+/);
  return match ? parseInt(match[0], 10) : 6;
}

function calcDaysUsed(purchaseDate: string): number {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  return Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
}

function getReplaceStatus(darkMode: boolean, daysUsed: number, replaceMonths: number, t: (key: string) => string): { label: string; color: string; bgColor: string } {
  const theme = darkMode ? BABY_ITEMS_DARK_THEME : BABY_ITEMS_LIGHT_THEME;
  const replaceDays = replaceMonths * 30;
  const ratio = daysUsed / replaceDays;
  if (ratio >= 1) return { label: t('baby.items.replace'), color: theme.statusDangerColor, bgColor: theme.statusDangerBg };
  if (ratio >= 0.8) return { label: t('baby.items.replace'), color: theme.statusWarningColor, bgColor: theme.statusWarningBg };
  return { label: '', color: '', bgColor: '' };
}

interface BabyItem {
  id: string;
  name: string;
  icon: string;
  purchaseDate: string;
  recommendedUsage: string;
  replaceEvery: string;
  careInstructions: string[];
  scientificAdvice: string;
}

interface BabyItemsScreenProps {
  onBack: () => void;
}

const ICON_EMOJI: Record<string, string> = {
  pacifier: '🍼',
  teether: '🦷',
  bottle: '🍼',
  'sippy-cup': '🥤',
  spoon: '🥄',
  bowl: '🥣',
  bib: '👕',
  toothbrush: '🪥',
  bathtub: '🛁',
  pillow: '🛏️',
  detergent: '🧴',
  towel: '🧻',
};

const DEFAULT_ITEMS: BabyItem[] = [
  {
    id: '1', name: '安抚奶嘴', icon: 'pacifier',
    purchaseDate: '2026-05-25', recommendedUsage: '0-6个月', replaceEvery: '每2个月',
    careInstructions: [
      '每次使用前用沸水消毒3-5分钟',
      '使用后用温水冲洗干净，避免残留奶渍',
      '存放于干燥通风处，避免阳光直射',
      '定期检查是否有裂纹或变形，及时更换',
    ],
    scientificAdvice: '美国儿科学会建议，安抚奶嘴在6个月后可逐步减少使用，1岁后尽量戒除，以降低中耳炎风险和牙齿咬合问题。选择一体成型的硅胶奶嘴更安全，避免部件脱落造成窒息。',
  },
  {
    id: '2', name: '硅胶牙胶', icon: 'teether',
    purchaseDate: '2026-04-20', recommendedUsage: '4-18个月', replaceEvery: '每3个月',
    careInstructions: [
      '首次使用前用沸水煮5分钟消毒',
      '每次使用后用清水冲洗，可用 mild 清洁剂',
      '可放入冰箱冷藏（非冷冻）增强舒缓效果',
      '避免用绳子挂在婴儿脖子上，防止勒颈风险',
    ],
    scientificAdvice: '牙胶能帮助宝宝缓解出牙不适。建议选择BPA-free的硅胶材质，硬度适中。避免含有液体的牙胶，破损后可能导致液体泄漏。定期更换以防细菌滋生。',
  },
  {
    id: '3', name: 'PPSU 奶瓶', icon: 'bottle',
    purchaseDate: '2026-06-10', recommendedUsage: '0-12个月', replaceEvery: '每6个月',
    careInstructions: [
      '每次使用后立即拆洗，避免奶渍变质',
      '使用专用奶瓶刷彻底清洗内壁',
      '奶嘴和瓶身可分开高温消毒（120°C以下）',
      '避免使用磨砂清洁剂，防止刮伤瓶身',
    ],
    scientificAdvice: 'PPSU材质耐高温、轻便透明，适合日常使用。建议准备4-6个奶瓶轮换使用。奶嘴流速应根据宝宝月龄选择：0-3月慢流速，3-6月中流速，6月以上快流速。',
  },
  {
    id: '4', name: '学饮杯', icon: 'sippy-cup',
    purchaseDate: '2026-04-05', recommendedUsage: '6-18个月', replaceEvery: '每4个月',
    careInstructions: [
      '每次使用后完全拆卸清洗所有部件',
      '吸管部分用小刷子仔细清洁内壁',
      '可放入洗碗机上层清洗（温度不超过70°C）',
      '定期检查吸管是否老化变形',
    ],
    scientificAdvice: '学饮杯是宝宝从奶瓶过渡到普通杯子的重要工具。建议选择带手柄的款式，帮助宝宝锻炼手部抓握能力。6个月开始引入，18个月前尽量完成过渡，避免长期使用影响口腔发育。',
  },
  {
    id: '5', name: '硅胶辅食勺', icon: 'spoon',
    purchaseDate: '2026-05-15', recommendedUsage: '6-24个月', replaceEvery: '每6个月',
    careInstructions: [
      '使用后用温水冲洗，可用 mild 清洁剂',
      '可沸水消毒或蒸汽消毒',
      '避免与尖锐物品放在一起，防止刮伤',
      '存放于干燥处，避免潮湿环境滋生细菌',
    ],
    scientificAdvice: '硅胶辅食勺柔软不伤牙龈，适合初添辅食的宝宝。勺头大小应适合宝宝口腔，约1-2茶匙容量。颜色鲜艳可吸引宝宝注意力，帮助建立进食兴趣。',
  },
  {
    id: '6', name: '吸盘辅食碗', icon: 'bowl',
    purchaseDate: '2026-04-20', recommendedUsage: '6-36个月', replaceEvery: '每12个月',
    careInstructions: [
      '使用前确保吸盘底部清洁干燥，增强吸附力',
      '使用后用温水冲洗，可放入洗碗机清洗',
      '避免用尖锐餐具刮擦碗内壁',
      '定期检查吸盘是否老化松动',
    ],
    scientificAdvice: '吸盘碗能有效防止宝宝打翻食物，是自主进食训练的好帮手。建议选择食品级硅胶或PP材质，耐热性好且不含BPA。分格设计可帮助宝宝认识不同食物。',
  },
  {
    id: '7', name: '防水围嘴', icon: 'bib',
    purchaseDate: '2025-01-25', recommendedUsage: '4-36个月', replaceEvery: '每6个月',
    careInstructions: [
      '每次使用后用湿布擦拭或清水冲洗',
      '可机洗（放入洗衣袋，水温不超过40°C）',
      '晾干后再收纳，避免潮湿发霉',
      '硅胶围嘴可直接用清洁剂擦洗',
    ],
    scientificAdvice: '防水围嘴是辅食期的必备品。硅胶材质围嘴易清洁、可反复使用，底部兜槽可接住掉落食物。建议选择柔软亲肤的材质，避免摩擦宝宝颈部皮肤。',
  },
  {
    id: '8', name: '婴儿指套牙刷', icon: 'toothbrush',
    purchaseDate: '2025-04-01', recommendedUsage: '0-18个月', replaceEvery: '每2个月',
    careInstructions: [
      '每次使用后用清水冲洗干净',
      '甩干水分后存放于通风处',
      '避免与其他牙刷混放，防止交叉感染',
      '刷毛变形后立即更换',
    ],
    scientificAdvice: '从第一颗乳牙萌出起就需要口腔清洁。0-6月可用纱布蘸温水擦拭牙龈，6月后使用指套牙刷。选择软毛、小刷头的款式，使用米粒大小的含氟牙膏（1000ppm）。',
  },
];

type ViewMode = 'list' | 'detail' | 'add' | 'edit';

const BabyItemsScreen = ({ onBack }: BabyItemsScreenProps) => {
  const { t } = useLocale();
  const { darkMode } = useDarkMode();
  const THEME_VALUES = darkMode ? BABY_ITEMS_DARK_THEME : BABY_ITEMS_LIGHT_THEME;

  const [items, setItems] = useState<BabyItem[]>(() => demoLocal.get('items', DEFAULT_ITEMS));
  const [localView, setLocalView] = useState<ViewMode>('list');
  const [localItem, setLocalItem] = useState<BabyItem | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedView = params.get('view');
  const selectedItem = isApp ? items.find(item => item.id === params.get('id')) ?? null : localItem;
  const viewMode: ViewMode = isApp
    ? requestedView === 'add' ? 'add' : selectedItem && (requestedView === 'edit' || requestedView === 'detail') ? requestedView : 'list'
    : localView;
  const setSelectedItem = setLocalItem;
  const setViewMode = (view: ViewMode, id?: string, replace = false) => {
    if (!isApp) { setLocalView(view); return; }
    const search = new URLSearchParams();
    if (view !== 'list') search.set('view', view);
    if (id) search.set('id', id);
    navigate({ pathname: location.pathname, search: search.toString() }, { replace, state: { ...location.state, babyView: true } });
  };
  useDemoPage(viewMode === 'add' || viewMode === 'edit' ? 'items-form' : 'baby-items');

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      return parseReplaceMonths(a.replaceEvery) - parseReplaceMonths(b.replaceEvery);
    });
  }, [items]);

  const handleBack = () => {
    demoEngine.normal();
    if (viewMode !== 'list') {
      if (isApp && location.state?.babyView) navigate(-1);
      else setViewMode('list');
      setSelectedItem(null);
    } else {
      onBack();
    }
  };

  const handleSelectItem = (item: BabyItem) => {
    setSelectedItem(item);
    setViewMode('detail', item.id);
  };

  const handleEditItem = (item: BabyItem) => {
    setSelectedItem(item);
    setViewMode('edit', item.id);
  };

  const handleAddItem = (newItem: {
    name: string;
    icon: string;
    purchaseDate: string;
    recommendedUsage: string;
    replaceEvery: string;
  }) => {
    const item: BabyItem = {
      id: String(Date.now()),
      ...newItem,
      careInstructions: [],
      scientificAdvice: '',
    };
      const next = [...items, item];
      demoLocal.set('items', next); setItems(next);
      if (isApp && location.state?.babyView) navigate(-1);
      else setViewMode('list', undefined, true);
  };

  const handleUpdateItem = (updated: {
    name: string;
    icon: string;
    purchaseDate: string;
    recommendedUsage: string;
    replaceEvery: string;
  }) => {
    if (!selectedItem) return;
      const next = items.map((it) =>
        it.id === selectedItem.id ? { ...it, ...updated } : it
      );
      demoLocal.set('items', next); setItems(next);
      setSelectedItem({ ...selectedItem, ...updated });
      if (isApp && location.state?.babyView) navigate(-1);
      else setViewMode('detail', selectedItem.id, true);
  };

  if (viewMode === 'detail' && selectedItem) {
    return <BabyItemDetailScreen item={selectedItem} onBack={handleBack} onEdit={handleEditItem} />;
  }

  if (viewMode === 'add') {
    return <BabyItemForm onBack={handleBack} onSubmit={handleAddItem} />;
  }

  if (viewMode === 'edit' && selectedItem) {
    return <BabyItemForm onBack={handleBack} onSubmit={handleUpdateItem} editItem={selectedItem} />;
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: THEME_VALUES.bg }}>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-3" style={{ backgroundColor: THEME_VALUES.bg }}>
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: THEME_VALUES.textPrimary }} />
        </button>
        <span className="text-[15px] font-semibold" style={{ color: THEME_VALUES.textPrimary }}>
          {t('baby.items.title')}
        </span>
        <button
          onClick={() => setViewMode('add')}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
          style={{ backgroundColor: THEME_VALUES.addButtonBg }}
        >
          <Plus className="w-5 h-5" style={{ color: THEME_VALUES.textPrimary }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="mx-4 mt-2 mb-4 flex items-center gap-2">
          <span className="text-xs" style={{ color: THEME_VALUES.textSecondary }}>
            {t('baby.items.count', { count: sortedItems.length })}
          </span>
        </div>

        {/* Item List */}
        <div className="mx-4 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          {sortedItems.map((item, index) => {
            const daysUsed = calcDaysUsed(item.purchaseDate);
            const replaceMonths = parseReplaceMonths(item.replaceEvery);
            const status = getReplaceStatus(darkMode, daysUsed, replaceMonths, t);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="w-full flex items-center gap-3 px-4 py-3.5 active:opacity-70 transition-opacity"
                style={{
                  borderBottom: index < sortedItems.length - 1 ? `1px solid ${THEME_VALUES.border}` : 'none',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: status.label ? status.bgColor : THEME_VALUES.iconDefaultBg }}
                >
                  <span className="text-lg">{ICON_EMOJI[item.icon] || '🧸'}</span>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium block" style={{ color: THEME_VALUES.textPrimary }}>
                    {item.name}
                  </span>
                  <span className="text-xs" style={{ color: THEME_VALUES.textTertiary }}>
                    {t('baby.items.days.used', { days: daysUsed })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {status.label && (
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ color: status.color, backgroundColor: status.bgColor }}
                    >
                      {status.label}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: THEME_VALUES.textTertiary }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default BabyItemsScreen;
