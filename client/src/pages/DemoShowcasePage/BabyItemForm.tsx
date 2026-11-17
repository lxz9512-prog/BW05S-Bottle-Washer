import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocale } from './useLocale';
import { useDarkMode } from './useDarkMode';
import { BABY_FORM_DARK_THEME } from './dark-themes';
import { BABY_FORM_LIGHT_THEME } from './light-themes';
import { OperationState, useOperation } from '../../demo/react';

interface BabyItem {
  id: string;
  name: string;
  icon: string;
  purchaseDate: string;
  recommendedUsage: string;
  replaceEvery: string;
}

interface BabyItemFormProps {
  onBack: () => void;
  onSubmit: (item: { name: string; icon: string; purchaseDate: string; recommendedUsage: string; replaceEvery: string }) => void;
  editItem?: BabyItem;
}

const REPLACE_SUGGESTIONS: Record<string, string> = {
  pacifier: '每2个月',
  teether: '每3个月',
  bottle: '每6个月',
  'sippy-cup': '每4个月',
  spoon: '每6个月',
  bowl: '每12个月',
  bib: '每6个月',
  toothbrush: '每2个月',
  bathtub: '每12个月',
  pillow: '每6个月',
  detergent: '每12个月',
  towel: '每3个月',
};

const REPLACE_REASONS: Record<string, string> = {
  pacifier: '硅胶老化易滋生细菌，频繁接触口腔需定期更换',
  teether: '硅胶磨损后表面粗糙，可能划伤牙龈',
  bottle: 'PPSU 材质高温消毒后逐渐老化，奶嘴流速会变化',
  'sippy-cup': '吸管老化变形影响密封性和吸吮体验',
  spoon: '硅胶长期使用后弹性下降，勺头可能变形',
  bowl: '吸盘碗吸力随使用时间递减，材质稳定性较好',
  bib: '硅胶围嘴易清洁但接缝处易藏污纳垢',
  toothbrush: '刷毛变形后清洁力下降，细菌易附着',
  bathtub: '塑料材质稳定，定期检查是否有裂纹即可',
  pillow: '填充物易受潮结块，影响支撑和透气性',
  detergent: '密封保存下保质期较长，开瓶后建议12月内用完',
  towel: '棉质纤维反复洗涤后变硬，吸水性下降',
};

const ICON_CATEGORIES = [
  {
    name: '喂养',
    icons: [
      { id: 'pacifier', emoji: '🍼' },
      { id: 'sippy-cup', emoji: '🥤' },
      { id: 'spoon', emoji: '🥄' },
      { id: 'bowl', emoji: '🥣' },
    ],
  },
  {
    name: '口腔',
    icons: [
      { id: 'teether', emoji: '🦷' },
      { id: 'toothbrush', emoji: '🪥' },
    ],
  },
  {
    name: '日用',
    icons: [
      { id: 'bib', emoji: '👕' },
      { id: 'bathtub', emoji: '🛁' },
      { id: 'pillow', emoji: '🛏️' },
      { id: 'towel', emoji: '🧻' },
    ],
  },
];

const BabyItemForm = ({ onBack, onSubmit, editItem }: BabyItemFormProps) => {
  const { t } = useLocale();
  const { darkMode } = useDarkMode();
  const THEME_VALUES = darkMode ? BABY_FORM_DARK_THEME : BABY_FORM_LIGHT_THEME;

  const categoryNames: Record<string, string> = {
    '喂养': t('baby.items.icon.feeding'),
    '口腔': t('baby.items.icon.oral'),
    '日用': t('baby.items.icon.daily'),
  };

  const [name, setName] = useState(editItem?.name ?? '');
  const [selectedIcon, setSelectedIcon] = useState(editItem?.icon ?? 'pacifier');
  const [purchaseDate, setPurchaseDate] = useState(editItem?.purchaseDate ?? '');

  const isEdit = !!editItem;

  const submit = () => {
    if (!name.trim()) return;
    const suggested = REPLACE_SUGGESTIONS[selectedIcon] || '每6个月';
    onSubmit({ name: name.trim(), icon: selectedIcon, purchaseDate, recommendedUsage: '', replaceEvery: suggested });
  };
  const save = useOperation({ operation: 'items.save', stage: 'items', label: '保存物品', success: submit, ready: () => !!name.trim(), edit: () => {} });
  const handleSubmit = () => { if (name.trim()) save(); };

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
          {isEdit ? t('baby.items.edit') : t('baby.items.add')}
        </span>
        <div className="w-10" />
      </div>

      <OperationState operation="items.save" />
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Icon Selection by Category */}
        <div className="mx-4 mt-3 rounded-xl p-4" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <span className="text-xs font-normal mb-3 block" style={{ color: THEME_VALUES.textSecondary }}>
            {t('baby.items.select.icon')}
          </span>
          <div className="space-y-4">
            {ICON_CATEGORIES.map((category) => (
              <div key={category.name}>
                <span className="text-[11px] font-medium mb-2 block" style={{ color: THEME_VALUES.textTertiary }}>
                  {categoryNames[category.name] || category.name}
                </span>
                <div className="flex gap-3">
                  {category.icons.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedIcon(opt.id)}
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: selectedIcon === opt.id ? THEME_VALUES.iconSelectedBg : THEME_VALUES.iconDefaultBg,
                        boxShadow: selectedIcon === opt.id ? `0 0 0 2px ${THEME_VALUES.iconSelectedBorder}` : 'none',
                      }}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${THEME_VALUES.border}` }}>
            <span className="text-xs block mb-1.5" style={{ color: THEME_VALUES.textSecondary }}>{t('baby.items.name')}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('baby.items.name.placeholder')}
              className="w-full text-sm outline-none bg-transparent"
              style={{ color: THEME_VALUES.textPrimary }}
            />
          </div>
          <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${THEME_VALUES.border}` }}>
            <span className="text-xs block mb-1.5" style={{ color: THEME_VALUES.textSecondary }}>{t('baby.items.purchase.date')}</span>
            <input
              type="text"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              placeholder={t('baby.items.purchase.date.placeholder')}
              className="w-full text-sm outline-none bg-transparent"
              style={{ color: THEME_VALUES.textPrimary }}
            />
          </div>
          <div className="px-4 py-3.5">
            <span className="text-xs block mb-1.5" style={{ color: THEME_VALUES.textSecondary }}>{t('baby.items.replace.cycle.label')}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: THEME_VALUES.textPrimary }}>
                {REPLACE_SUGGESTIONS[selectedIcon] || '每6个月'}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: THEME_VALUES.iconSelectedBg, color: THEME_VALUES.iconSelectedBorder }}
              >
                Scientific
              </span>
            </div>
            <span className="text-[11px] mt-1 block" style={{ color: THEME_VALUES.textTertiary }}>
              {REPLACE_REASONS[selectedIcon] || t('baby.items.replace.cycle.placeholder')}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mx-4 mt-6">
          <button
            data-connector="action" aria-label="保存物品"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              backgroundColor: name.trim() ? THEME_VALUES.submitEnabledBg : THEME_VALUES.submitDisabledBg,
              color: name.trim() ? THEME_VALUES.submitEnabledText : THEME_VALUES.submitDisabledText,
              boxShadow: name.trim() ? `0 4px 12px ${THEME_VALUES.submitShadow}` : 'none',
            }}
          >
            {isEdit ? t('baby.items.save') : t('baby.items.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BabyItemForm;
