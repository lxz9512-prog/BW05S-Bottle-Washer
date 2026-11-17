import { ChevronLeft, ChevronRight, Globe, Moon, Check } from 'lucide-react';
import { useLocale } from './useLocale';
import { useDarkMode } from './useDarkMode';
import type { Locale } from './locale-store';
import { OTHER_SETTINGS_DARK_THEME } from './dark-themes';
import { OTHER_SETTINGS_LIGHT_THEME } from './light-themes';

interface OtherSettingsScreenProps {
  onBack: () => void;
}

const OtherSettingsScreen = ({ onBack }: OtherSettingsScreenProps) => {
  const { locale, setLocale, t } = useLocale();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const THEME = darkMode ? OTHER_SETTINGS_DARK_THEME : OTHER_SETTINGS_LIGHT_THEME;

  const languages: Array<{ id: Locale; label: string }> = [
    { id: 'zh', label: t('other.settings.chinese') },
    { id: 'en', label: t('other.settings.english') },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: THEME.bg }}>
      <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-3" style={{ backgroundColor: THEME.bg }}>
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: THEME.textPrimary }} />
        </button>
        <span className="text-[15px] font-semibold" style={{ color: THEME.textPrimary }}>
          {t('other.settings.title')}
        </span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="mt-3 px-4">
          <span className="text-xs font-normal" style={{ color: THEME.textSecondary }}>
            {t('other.settings.language')}
          </span>
        </div>
        <div className="mx-4 mt-2 rounded-xl overflow-hidden" style={{ backgroundColor: THEME.cardBg }}>
          {languages.map((lang, index) => (
            <button
              key={lang.id}
              onClick={() => setLocale(lang.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
              style={{
                borderBottom: index < languages.length - 1 ? `1px solid ${THEME.border}` : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" style={{ color: THEME.primary }} />
                <span className="text-sm font-normal" style={{ color: THEME.textPrimary }}>
                  {lang.label}
                </span>
              </div>
              {locale === lang.id && (
                <Check className="w-4 h-4" style={{ color: THEME.primary }} />
              )}
            </button>
          ))}
        </div>

        <div className="mt-5 px-4">
          <span className="text-xs font-normal" style={{ color: THEME.textSecondary }}>
            {t('other.settings.dark.mode')}
          </span>
        </div>
        <div className="mx-4 mt-2 rounded-xl overflow-hidden" style={{ backgroundColor: THEME.cardBg }}>
          <button
            onClick={() => toggleDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4" style={{ color: THEME.primary }} />
              <span className="text-sm font-normal" style={{ color: THEME.textPrimary }}>
                {t('other.settings.dark.mode')}
              </span>
            </div>
            <div
              className="relative w-12 h-7 rounded-full transition-colors duration-300"
              style={{ backgroundColor: darkMode ? THEME.primary : THEME.switchOffBg }}
            >
              <div
                className="absolute top-0.5 w-6 h-6 rounded-full shadow-sm transition-transform duration-300"
                style={{ backgroundColor: THEME.switchKnobBg, transform: darkMode ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherSettingsScreen;
