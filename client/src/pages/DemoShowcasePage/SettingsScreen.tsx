import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Wind, X } from 'lucide-react';
import deviceImage from '@client/src/assets/device-bw05s.png';
import { useLocale } from './useLocale';
import { useDarkMode } from './useDarkMode';
import { SETTINGS_DARK_THEME } from './dark-themes';
import { SETTINGS_LIGHT_THEME } from './light-themes';

interface SettingsScreenProps {
  onBack: () => void;
  onBabyItems?: () => void;
  onDeviceInfo?: () => void;
  onOtherSettings?: () => void;
}

const MOCK_TDS_VALUE = 72;
const MOCK_FILTER_PERCENT = 60;

function getTdsStatus(darkMode: boolean, tds: number, t: (key: string) => string): { label: string; color: string; bgColor: string; iconBg: string } {
  const theme = darkMode ? SETTINGS_DARK_THEME : SETTINGS_LIGHT_THEME;
  if (tds >= 100) return { label: t('settings.status.replace.now'), color: theme.statusDangerColor, bgColor: theme.statusDangerBg, iconBg: theme.statusDangerIconBg };
  if (tds >= 50) return { label: t('settings.status.replace.soon'), color: theme.statusWarningColor, bgColor: theme.statusWarningBg, iconBg: theme.statusWarningIconBg };
  return { label: t('settings.status.normal'), color: theme.statusNormalColor, bgColor: theme.statusNormalBg, iconBg: theme.statusNormalIconBg };
}

function getFilterStatus(darkMode: boolean, percent: number, t: (key: string) => string): { label: string; color: string; bgColor: string; iconBg: string } {
  const theme = darkMode ? SETTINGS_DARK_THEME : SETTINGS_LIGHT_THEME;
  if (percent <= 30) return { label: t('settings.status.replace.soon'), color: theme.statusWarningColor, bgColor: theme.statusWarningBg, iconBg: theme.statusWarningIconBg };
  return { label: t('settings.status.normal'), color: theme.statusNormalColor, bgColor: theme.statusNormalBg, iconBg: theme.statusNormalIconBg };
}

const SettingsScreen = ({ onBack, onBabyItems, onDeviceInfo, onOtherSettings }: SettingsScreenProps) => {
  const [showTdsPopup, setShowTdsPopup] = useState(false);
  const { t } = useLocale();
  const { darkMode } = useDarkMode();
  const THEME_VALUES = darkMode ? SETTINGS_DARK_THEME : SETTINGS_LIGHT_THEME;
  const tdsStatus = getTdsStatus(darkMode, MOCK_TDS_VALUE, t);
  const filterStatus = getFilterStatus(darkMode, MOCK_FILTER_PERCENT, t);
  const deviceFunctionItems = [
    { label: t('settings.baby.items'), hasArrow: true },
  ];

  const generalItems = [
    { label: t('settings.smart.assistant'), hasArrow: true, onClick: undefined as (() => void) | undefined },
    { label: t('settings.online.service'), hasArrow: true, onClick: undefined as (() => void) | undefined },
    { label: t('settings.firmware'), hasArrow: true, badge: 'New', hasDot: true, onClick: undefined as (() => void) | undefined },
    { label: t('settings.share.device'), hasArrow: true, onClick: undefined as (() => void) | undefined },
    { label: t('settings.other'), hasArrow: true, onClick: onOtherSettings },
  ];

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
          {t('settings.title')}
        </span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Device Info Card */}
        <div className="mx-4 mt-3 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <button
            onClick={onDeviceInfo}
            className="w-full flex items-center px-4 py-4 active:opacity-70 transition-opacity"
          >
            <img
              src={deviceImage}
              alt="Device"
              className="w-12 h-12 object-contain mr-4"
            />
            <span className="flex-1 text-left text-sm font-medium" style={{ color: THEME_VALUES.textPrimary }}>
              BW05S
            </span>
            <ChevronRight className="w-5 h-5" style={{ color: THEME_VALUES.textTertiary }} />
          </button>
        </div>

        {/* Consumables Management */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <div className="px-4 pt-3.5 pb-2">
            <span className="text-sm font-medium" style={{ color: THEME_VALUES.textPrimary }}>
              {t('settings.consumables')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
            <button
              onClick={() => setShowTdsPopup(true)}
              className="flex flex-col items-center rounded-xl py-3 px-2 active:opacity-70 transition-opacity"
              style={{ backgroundColor: THEME_VALUES.iconBg }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: THEME_VALUES.iconContainerBg }}
              >
                <Droplets className="w-5 h-5" style={{ color: tdsStatus.color }} />
              </div>
              <span className="text-xs" style={{ color: THEME_VALUES.textSecondary }}>
                {t('settings.water.softener')}
              </span>
              <span className="text-base font-semibold mt-0.5" style={{ color: THEME_VALUES.textPrimary }}>
                {t('settings.tds', { value: MOCK_TDS_VALUE })}
              </span>
              <span
                className="text-[10px] font-medium mt-1 px-2 py-0.5 rounded-full"
                style={{ color: tdsStatus.color, backgroundColor: THEME_VALUES.statusLabelBg }}
              >
                {tdsStatus.label}
              </span>
            </button>
            <button
              className="flex flex-col items-center rounded-xl py-3 px-2 active:opacity-70 transition-opacity"
              style={{ backgroundColor: THEME_VALUES.iconBgWarm }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: THEME_VALUES.iconContainerBg }}
              >
                <Wind className="w-5 h-5" style={{ color: filterStatus.color }} />
              </div>
              <span className="text-xs" style={{ color: THEME_VALUES.textSecondary }}>
                {t('settings.hepa.life')}
              </span>
              <span className="text-base font-semibold mt-0.5" style={{ color: THEME_VALUES.textPrimary }}>
                {t('settings.remain', { percent: MOCK_FILTER_PERCENT })}
              </span>
              <span
                className="text-[10px] font-medium mt-1 px-2 py-0.5 rounded-full"
                style={{ color: filterStatus.color, backgroundColor: THEME_VALUES.statusLabelBg }}
              >
                {filterStatus.label}
              </span>
            </button>
          </div>
        </div>

        {/* Device Functions Section */}
        <div className="mt-5 px-4">
          <span className="text-xs font-normal" style={{ color: THEME_VALUES.textSecondary }}>
            {t('settings.device.func')}
          </span>
        </div>
        <div className="mx-4 mt-2 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <button
            onClick={onBabyItems}
            className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
          >
            <span className="text-sm font-normal" style={{ color: THEME_VALUES.textPrimary }}>
              {t('settings.baby.items')}
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: THEME_VALUES.textTertiary }} />
          </button>
        </div>

        {/* General Settings Section */}
        <div className="mt-5 px-4">
          <span className="text-xs font-normal" style={{ color: THEME_VALUES.textSecondary }}>
            {t('settings.general')}
          </span>
        </div>
        <div className="mx-4 mt-2 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          {generalItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
              style={{
                borderBottom: index < generalItems.length - 1 ? `1px solid ${THEME_VALUES.border}` : 'none',
              }}
            >
              <span className="text-sm font-normal" style={{ color: THEME_VALUES.textPrimary }}>
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-xs" style={{ color: THEME_VALUES.textTertiary }}>
                    {item.badge}
                  </span>
                )}
                {item.hasDot && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: THEME_VALUES.red }}
                  />
                )}
                <ChevronRight className="w-4 h-4" style={{ color: THEME_VALUES.textTertiary }} />
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mx-4 mt-5 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <button
            className="w-full py-3.5 text-center text-sm font-normal active:opacity-70 transition-opacity"
            style={{ color: THEME_VALUES.orange }}
          >
            {t('settings.restart')}
          </button>
        </div>

        <div className="mx-4 mt-3 rounded-xl overflow-hidden mb-8" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          <button
            className="w-full py-3.5 text-center text-sm font-normal active:opacity-70 transition-opacity"
            style={{ color: THEME_VALUES.red }}
          >
            {t('settings.delete')}
          </button>
        </div>
      </div>

      {/* TDS Popup */}
      {showTdsPopup && (
        <div data-screen-overlay className="absolute inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: THEME_VALUES.overlayBg }}
            onClick={() => setShowTdsPopup(false)}
          />
          <div
            className="relative w-[280px] rounded-2xl p-5"
            style={{ backgroundColor: THEME_VALUES.dialogBg }}
          >
            <button
              onClick={() => setShowTdsPopup(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: THEME_VALUES.bg }}
            >
              <X className="w-4 h-4" style={{ color: THEME_VALUES.textTertiary }} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5" style={{ color: THEME_VALUES.primary }} />
              <span className="text-[15px] font-semibold" style={{ color: THEME_VALUES.textPrimary }}>
                {t('tds.popup.title')}
              </span>
            </div>
            <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: tdsStatus.bgColor }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: THEME_VALUES.textSecondary }}>{t('tds.popup.current')}</span>
                <span className="text-lg font-semibold" style={{ color: tdsStatus.color }}>{MOCK_TDS_VALUE}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tdsStatus.color }} />
                <span className="text-xs font-medium" style={{ color: tdsStatus.color }}>{tdsStatus.label}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <p className="text-xs leading-relaxed" style={{ color: THEME_VALUES.textSecondary }}>
                {t('tds.popup.desc')}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: THEME_VALUES.statusNormalColor }} />
                  <span className="text-xs leading-relaxed" style={{ color: THEME_VALUES.textPrimary }}>
                    {t('tds.popup.good')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: THEME_VALUES.statusWarningColor }} />
                  <span className="text-xs leading-relaxed" style={{ color: THEME_VALUES.textPrimary }}>
                    {t('tds.popup.warn')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: THEME_VALUES.statusDangerColor }} />
                  <span className="text-xs leading-relaxed" style={{ color: THEME_VALUES.textPrimary }}>
                    {t('tds.popup.danger')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
