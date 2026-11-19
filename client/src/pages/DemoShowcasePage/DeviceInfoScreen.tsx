import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Wifi, Edit3, Check } from 'lucide-react';
import { usePhoneToast } from './usePhoneToast';
import { useLocale } from './useLocale';
import { useDarkMode } from './useDarkMode';
import { DEVICE_INFO_DARK_THEME } from './dark-themes';
import { DEVICE_INFO_LIGHT_THEME } from './light-themes';
import { OperationState, useOperation } from '../../demo/react';
import { getDeviceName, getMachineModel, machineLocal } from './machine-models';
import { demoEngine } from '../../demo/engine';

interface DeviceInfoScreenProps {
  onBack: () => void;
}

const MOCK_DEVICE = {
  mac: 'A4:C1:38:7B:2F:9E',
  wifi: 'Home_Network_5G',
  firmware: 'v2.1.3',
};

const DeviceInfoScreen = ({ onBack }: DeviceInfoScreenProps) => {
  const model = getMachineModel();
  const [deviceName, setDeviceName] = useState(() => getDeviceName());
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(deviceName);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastElement } = usePhoneToast();
  const { t, locale } = useLocale();
  const { darkMode } = useDarkMode();
  const THEME_VALUES = darkMode ? DEVICE_INFO_DARK_THEME : DEVICE_INFO_LIGHT_THEME;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitName = () => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    machineLocal.set('device-name', trimmed); setDeviceName(trimmed); setIsEditing(false);
  };
  const save = useOperation({ operation: 'device.rename', stage: 'settings', label: '保存设备名称', success: commitName, ready: () => isEditing && !!editValue.trim(), edit: () => setIsEditing(true) });
  const dismissEdit = () => {
    demoEngine.normal();
    setEditValue(deviceName);
    setIsEditing(false);
  };
  const handleSaveName = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      save();
    } else {
      setEditValue(deviceName);
    }
    if (!trimmed) setIsEditing(false);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t('copied', { label }));
    } catch {
      showToast(t('copy.failed'));
    }
  };

  const handleWifiClick = () => {
    showToast(t('coming.soon'));
  };

  const infoRows: Array<{
    label: string;
    value: string;
    copyable?: boolean;
    copyLabel?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  }> = [
    {
      label: t('device.info.name'),
      value: deviceName,
      onClick: () => { setEditValue(deviceName); setIsEditing(true); },
      icon: <Edit3 className="w-4 h-4" style={{ color: THEME_VALUES.primary }} />,
    },
    {
      label: t('device.info.sn'),
      value: `${model.name}2024031500128`,
      copyable: true,
      copyLabel: 'SN',
    },
    {
      label: t('device.info.mac'),
      value: MOCK_DEVICE.mac,
      copyable: true,
      copyLabel: 'MAC',
    },
    {
      label: t('device.info.wifi'),
      value: MOCK_DEVICE.wifi,
      onClick: handleWifiClick,
      icon: <Wifi className="w-4 h-4" style={{ color: THEME_VALUES.primary }} />,
    },

  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: THEME_VALUES.bg }}>
      {ToastElement}
      <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-3" style={{ backgroundColor: THEME_VALUES.bg }}>
        <button
          aria-label={locale === 'en' ? 'Back' : '返回'}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: THEME_VALUES.textPrimary }} />
        </button>
        <span className="text-[15px] font-semibold" style={{ color: THEME_VALUES.textPrimary }}>
          {t('device.info.title')}
        </span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="flex flex-col items-center pt-4 pb-5">
          <div className="flex items-center justify-center mb-4">
            <img src={model.image} alt={model.name} className="w-28 h-28 object-contain" />
          </div>

        </div>

        <div className="mx-4 rounded-xl overflow-hidden" style={{ backgroundColor: THEME_VALUES.cardBg }}>
          {infoRows.map((row, index) => (
            <button
              key={row.label}
              onClick={row.onClick || (row.copyable ? () => handleCopy(row.value, row.copyLabel || row.label) : undefined)}
              className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
              style={{
                borderBottom: index < infoRows.length - 1 ? `1px solid ${THEME_VALUES.border}` : 'none',
              }}
            >
              <div className="flex min-w-0 items-center gap-2 shrink-0 max-w-[45%] text-left">
                {row.icon}
                <span className="text-sm" style={{ color: THEME_VALUES.textSecondary }}>{row.label}</span>
              </div>
              <div className="flex min-w-0 items-center justify-end gap-2 pl-3 text-right">
                <span className="text-sm font-medium break-all" style={{ color: THEME_VALUES.textPrimary }}>
                  {row.value}
                </span>
                {row.copyable && (
                  <Copy className="w-3.5 h-3.5" style={{ color: THEME_VALUES.textTertiary }} />
                )}
                {row.onClick && (
                  <ChevronRight className="w-4 h-4" style={{ color: THEME_VALUES.textTertiary }} />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mx-4 mt-4 mb-8 px-1">
          <p className="text-[11px] leading-relaxed" style={{ color: THEME_VALUES.textTertiary }}>
            {t('device.info.hint')}
          </p>
        </div>
      </div>

      {isEditing && (
        <div data-screen-overlay className="absolute inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: THEME_VALUES.overlayBg }}
            onClick={dismissEdit}
          />
          <div
            className="relative w-[260px] rounded-2xl p-5"
            style={{ backgroundColor: THEME_VALUES.dialogBg }}
          >
            <span className="text-[15px] font-semibold block mb-4" style={{ color: THEME_VALUES.textPrimary }}>
              {t('device.info.edit.title')}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') { e.stopPropagation(); dismissEdit(); }
              }}
              maxLength={20}
              className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none mb-4"
              style={{ color: THEME_VALUES.textPrimary, borderColor: THEME_VALUES.primary }}
            />
            <div className="flex gap-3">
              <button
                onClick={dismissEdit}
                className="flex-1 h-10 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform"
                style={{ backgroundColor: THEME_VALUES.bg, color: THEME_VALUES.textSecondary }}
              >
                {t('cancel')}
              </button>
              <button
                aria-label="保存设备名称" data-connector="action"
                onClick={handleSaveName}
                className="flex-1 h-10 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: THEME_VALUES.primary }}
              >
                <Check className="w-4 h-4" />
                {t('save')}
              </button>
            </div>
            <OperationState operation="device.rename" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceInfoScreen;
