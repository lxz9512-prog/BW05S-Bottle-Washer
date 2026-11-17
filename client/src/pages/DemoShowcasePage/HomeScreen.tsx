import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock3 } from 'lucide-react';
import { ModeIcon } from './ModeIcon';
import { DEFAULT_CUSTOM_MODES, type ModeConfig, type SubModeConfig } from './demo-constants';
import { ChildLock, DeviceSurface, DeviceHeader, DeviceProduct, DeviceSheet, CustomEditor, ScheduleSheet, useDeviceCopy, useDeviceUnavailable } from './DeviceUI';
import { usePhoneToast } from './usePhoneToast';
import { useOperation } from '../../demo/react';

interface HomeScreenProps {
  onNavigate: (config: ModeConfig) => void;
  selectedMode: string | null;
  onSelectMode: (modeId: string | null) => void;
  lastUsedMode: string | null;
  onSettings?: () => void;
  onSchedule: (config: ModeConfig, minutes: number) => void;
  initialCustom?: boolean;
}

const optionModes = ['baby', 'bottles', 'food-bowl', 'delicate-wash', 'custom'];

export default function HomeScreen({ onNavigate, selectedMode, onSelectMode, lastUsedMode, onSettings, onSchedule, initialCustom = false }: HomeScreenProps) {
  const navigate = useNavigate();
  const { t, copy } = useDeviceCopy();
  const unavailable = useDeviceUnavailable();
  const { showToast, ToastElement } = usePhoneToast();
  const [sheet, setSheet] = useState<'options' | 'schedule' | null>(initialCustom ? 'options' : null);
  const [option, setOption] = useState<string | null>(null);
  const [customSteps, setCustomSteps] = useState<SubModeConfig[]>(() => DEFAULT_CUSTOM_MODES.map(step => ({ ...step })));
  useEffect(() => { if (initialCustom) onSelectMode('custom'); }, [initialCustom]);
  useEffect(() => { if (unavailable) setSheet(null); }, [unavailable]);
  const labels: Record<string, string> = {
    smart: t('mode.smart'), auto: t('mode.standard'), rapid: t('mode.rapid'), 'self-clean': t('mode.self.clean'),
    baby: t('mode.breast.pump'), bottles: t('mode.teethers'), 'food-bowl': t('mode.baby.dish'),
    'delicate-wash': t('mode.adaptive.material'), custom: t('mode.custom'),
  };
  const groups = [
    { title: t('group.recommended'), modes: ['smart'] },
    { title: t('group.daily'), modes: ['auto', 'rapid', 'self-clean'] },
    { title: t('group.delicate'), modes: ['baby', 'bottles', 'food-bowl', 'delicate-wash'] },
    { title: t('group.custom'), modes: ['custom'] },
  ];
  const needsOptions = optionModes.includes(selectedMode ?? '');
  const options = selectedMode === 'baby' ? ['1', '2'] : selectedMode === 'bottles' ? ['1-5', '6-10', '11-15'] : selectedMode === 'food-bowl' ? ['1', '1+'] : ['Plastic', 'Silicone', 'Glass'];
  const optionLabel = (value: string) => selectedMode === 'food-bowl'
    ? value === '1' ? copy('1 set', '1套') : copy('More than 1 set', '1套以上')
    : value === 'Plastic' ? copy('Plastic', '塑料') : value === 'Silicone' ? copy('Silicone', '硅胶') : value === 'Glass' ? copy('Glass', '玻璃') : value;
  const ready = !!selectedMode && (selectedMode === 'custom' ? customSteps.some(step => step.enabled) : !needsOptions || !!option);
  const config = (): ModeConfig => ({ modeId: selectedMode!, modeLabel: labels[selectedMode!],
    ...(selectedMode === 'baby' ? { breastPumpSets: Number(option) } : {}),
    ...(selectedMode === 'bottles' ? { teetherRange: option! } : {}),
    ...(selectedMode === 'food-bowl' ? { babyDishCount: option! } : {}),
    ...(selectedMode === 'delicate-wash' ? { materialType: option! } : {}),
    ...(selectedMode === 'custom' ? { customSteps } : {}),
  });
  const start = useOperation({ operation: 'cleaning.start', stage: 'cleaning', label: '启动清洗', ready: () => ready, edit: () => {}, success: () => onNavigate(config()) });
  const select = (id: string) => {
    onSelectMode(id); setOption(null);
    setSheet(optionModes.includes(id) ? 'options' : null);
  };
  const begin = () => {
    if (unavailable) return;
    if (!selectedMode) { showToast(copy('Please select a mode to start', '请选择模式后启动')); return; }
    if (!ready) { setSheet('options'); return; }
    start();
  };
  return <DeviceSurface>
    {ToastElement}
    <DeviceHeader onBack={() => navigate('/')} onSettings={onSettings} />
    <div className="bw-scroll" data-connector="content">
      <DeviceProduct />
      {groups.map(group => <section className="bw-mode-group" key={group.title}><h2>{group.title}</h2><div className="bw-mode-grid">
        {group.modes.map(id => <button disabled={unavailable} key={id} className={`bw-mode-card ${selectedMode === id ? 'selected' : ''}`} aria-pressed={selectedMode === id} onClick={() => select(id)}>
          <ModeIcon mode={id} /><span>{labels[id]}</span>
          {lastUsedMode === id && <span className="bw-recent">{copy('Recent', '最近')}</span>}
        </button>)}
      </div></section>)}
      <ChildLock />
    </div>
    <div className="bw-dock" inert={!!sheet || unavailable}>
      <button className="bw-icon" aria-label={copy('Delay Start', '定时启动')} title={copy('Delay Start', '定时启动')} onClick={() => ready ? setSheet('schedule') : selectedMode ? setSheet('options') : showToast(copy('Please select a mode to start', '请选择模式后启动'))}><Clock3 size={19} /></button>
      <button data-connector="action" aria-label="开始清洗" aria-disabled={!selectedMode} className={`bw-primary ${!selectedMode ? 'is-disabled' : ''}`} onClick={begin}><Play size={17} fill="currentColor" />{t('start')}</button>
    </div>
    {sheet === 'options' && selectedMode && <DeviceSheet title={labels[selectedMode]} onClose={() => setSheet(null)}>
      <p className="bw-sheet-context">{selectedMode === 'custom' ? copy('Select the cleaning stages to run', '选择需要执行的清洗步骤') : selectedMode === 'delicate-wash' ? copy('Choose the material', '选择材质') : copy('Select the amount to clean', '选择清洗数量')}</p>
      {selectedMode === 'custom' ? <CustomEditor steps={customSteps} onChange={setCustomSteps} onInvalid={() => showToast(copy('Value out of range. Retry.', '数值超出范围，请重试。'))} /> : <div className="bw-options">{options.map(value => <button key={value} className={option === value ? 'selected' : ''} aria-pressed={option === value} onClick={() => setOption(value)}>{optionLabel(value)}</button>)}</div>}
      <button className="bw-primary" aria-label="开始清洗" disabled={!ready} onClick={begin}>{selectedMode === 'custom' ? t('power.on.start') : t('start')}</button>
      <button className="bw-text-button" disabled={!ready} onClick={() => setSheet('schedule')}>{copy('Delay Start', '定时启动')}</button>
    </DeviceSheet>}
    {sheet === 'schedule' && <ScheduleSheet modeLabel={labels[selectedMode!]} onClose={() => setSheet(needsOptions ? 'options' : null)} onSave={minutes => onSchedule(config(), minutes)} />}
  </DeviceSurface>;
}
