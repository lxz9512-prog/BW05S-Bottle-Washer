import { ChevronRight } from 'lucide-react';
import { getDeviceName, getMachineModel } from './machine-models';
import { DeviceHeader, DeviceSurface, useDeviceCopy } from './DeviceUI';
import { ConsumablesSummary } from './ConsumablesScreen';

interface SettingsScreenProps {
  onBack: () => void;
  onBabyItems?: () => void;
  onDeviceInfo?: () => void;
  onOtherSettings?: () => void;
  onConsumables?: () => void;
}

export default function SettingsScreen({ onBack, onBabyItems, onDeviceInfo, onOtherSettings, onConsumables }: SettingsScreenProps) {
  const { t } = useDeviceCopy();
  const model = getMachineModel();
  const items = [
    { label: t('settings.smart.assistant') }, { label: t('settings.online.service') },
    { label: t('settings.firmware'), badge: 'New' }, { label: t('settings.share.device') },
    { label: t('settings.other'), onClick: onOtherSettings },
  ];
  return <DeviceSurface>
    <DeviceHeader title={t('settings.title')} onBack={onBack} />
    <div className="bw-scroll bw-settings-content">
      <button className="bw-setting-row bw-device-info" onClick={onDeviceInfo}><img src={model.image} alt={model.name} /><span>{getDeviceName()}</span><ChevronRight size={17} /></button>
      <ConsumablesSummary onOpen={onConsumables} />
      <h2>{t('settings.device.func')}</h2>
      <button className="bw-setting-row" onClick={onBabyItems}><span>{t('settings.baby.items')}</span><ChevronRight size={17} /></button>
      <h2>{t('settings.general')}</h2>
      <div className="bw-settings-rows">{items.map(item => <button key={item.label} className="bw-setting-row" onClick={item.onClick}><span>{item.label}</span>{item.badge && <small>{item.badge}</small>}<ChevronRight size={17} /></button>)}</div>
      <button className="bw-setting-row bw-setting-action">{t('settings.restart')}</button>
      <button className="bw-setting-row bw-setting-action bw-danger">{t('settings.delete')}</button>
    </div>
  </DeviceSurface>;
}
