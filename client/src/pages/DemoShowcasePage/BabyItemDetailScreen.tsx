import { ChevronLeft, Calendar, AlertCircle, Sparkles, Droplets, RefreshCw, Pencil } from 'lucide-react';
import { useLocale } from './useLocale';
import { useDarkMode } from './useDarkMode';
import { BABY_DETAIL_DARK_THEME } from './dark-themes';
import { BABY_DETAIL_LIGHT_THEME } from './light-themes';

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

interface BabyItemDetailScreenProps {
  item: BabyItem;
  onBack: () => void;
  onEdit?: (item: BabyItem) => void;
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

const BabyItemDetailScreen = ({ item, onBack, onEdit }: BabyItemDetailScreenProps) => {
  const { t } = useLocale();
  const { darkMode } = useDarkMode();
  const THEME_VALUES = darkMode ? BABY_DETAIL_DARK_THEME : BABY_DETAIL_LIGHT_THEME;

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
          {t('baby.items.detail')}
        </span>
        <button
          onClick={() => onEdit?.(item)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        >
          <Pencil className="w-4 h-4" style={{ color: THEME_VALUES.primary }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Hero Section */}
        <div className="mx-4 mt-3 rounded-xl p-6 flex flex-col items-center" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: THEME_VALUES.headerIconBg }}
          >
            <span className="text-3xl">{ICON_EMOJI[item.icon] || '🧸'}</span>
          </div>
          <span className="text-lg font-semibold" style={{ color: THEME_VALUES.textPrimary }}>
            {item.name}
          </span>
        </div>

        {/* Basic Info */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${THEME_VALUES.border}` }}>
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: THEME_VALUES.primary }} />
            <span className="text-sm" style={{ color: THEME_VALUES.textSecondary }}>{t('baby.items.purchase.date')}</span>
            <span className="ml-auto text-sm" style={{ color: THEME_VALUES.textPrimary }}>{item.purchaseDate}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <RefreshCw className="w-4 h-4 flex-shrink-0" style={{ color: THEME_VALUES.warning }} />
            <span className="text-sm" style={{ color: THEME_VALUES.textSecondary }}>{t('baby.items.replace.cycle')}</span>
            <span className="ml-auto text-sm" style={{ color: THEME_VALUES.textPrimary }}>{item.replaceEvery}</span>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mx-4 mt-4 rounded-xl p-4" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-4 h-4" style={{ color: THEME_VALUES.primary }} />
            <span className="text-sm font-medium" style={{ color: THEME_VALUES.textPrimary }}>{t('baby.items.care')}</span>
          </div>
          <div className="space-y-2.5">
            {item.careInstructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: THEME_VALUES.stepDotBg }}
                >
                  <span className="text-[10px] font-medium" style={{ color: THEME_VALUES.primary }}>
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm leading-relaxed" style={{ color: THEME_VALUES.textSecondary }}>
                  {instruction}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Advice */}
        <div className="mx-4 mt-4 rounded-xl p-4" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: THEME_VALUES.warning }} />
            <span className="text-sm font-medium" style={{ color: THEME_VALUES.textPrimary }}>{t('baby.items.science')}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: THEME_VALUES.textSecondary }}>
            {item.scientificAdvice}
          </p>
        </div>

        {/* Replacement Reminder */}
        <div className="mx-4 mt-4 rounded-xl p-4" style={{ backgroundColor: THEME_VALUES.reminderBg }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" style={{ color: THEME_VALUES.warning }} />
            <span className="text-sm font-medium" style={{ color: THEME_VALUES.textPrimary }}>{t('baby.items.reminder')}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: THEME_VALUES.textSecondary }}>
            {t('baby.items.reminder.desc', { cycle: item.replaceEvery })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BabyItemDetailScreen;
