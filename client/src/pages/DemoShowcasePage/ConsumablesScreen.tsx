import { useState } from 'react';
import { ChevronRight, Droplets, Wind } from 'lucide-react';
import { getMachineModel } from './machine-models';
import { DeviceHeader, DeviceSheet, DeviceSurface, useDeviceCopy } from './DeviceUI';

export const CONSUMABLES = [
  { id: 'water', remaining: 36, maximum: 60, Icon: Droplets },
  { id: 'hepa', remaining: 216, maximum: 360, Icon: Wind },
] as const;

export function ConsumablesSummary({ onOpen }: { onOpen?: () => void }) {
  const { copy } = useDeviceCopy();
  const consumables = CONSUMABLES.filter(item => (getMachineModel().consumables as readonly string[]).includes(item.id));
  return <button className="bw-consumables-summary" onClick={onOpen}>
    <span className="bw-summary-title"><span>{copy('Consumables', '耗材管理')}</span><span className="bw-summary-count">{copy(`${consumables.length} items`, `${consumables.length} 项耗材`)}</span><ChevronRight size={16} aria-hidden="true" /></span>
    <span className="bw-summary-items">{consumables.map(({ id, remaining, maximum, Icon }) => {
      const percentage = Math.round(remaining / maximum * 100);
      return <span key={id} className={`bw-summary-item ${id}`}>
        <span className="bw-summary-icon"><Icon size={25} strokeWidth={1.6} aria-hidden="true" /></span>
        <span className="bw-summary-info"><strong>{id === 'water' ? copy('Water softener', '软水滤芯') : copy('HEPA filter', 'HEPA 滤芯')}</strong><span>{copy(`${remaining} uses left`, `剩余 ${remaining} 次`)}</span></span>
        <span className="bw-summary-ring"><svg viewBox="0 0 48 48" aria-hidden="true"><circle className="bw-summary-ring-track" cx="24" cy="24" r="20" /><circle className="bw-summary-ring-value" cx="24" cy="24" r="20" pathLength="100" strokeDasharray={`${percentage} 100`} /></svg><span>{percentage}<small>%</small></span></span>
      </span>;
    })}</span>
  </button>;
}

export default function ConsumablesScreen({ onBack }: { onBack: () => void }) {
  const { copy } = useDeviceCopy();
  const model = getMachineModel();
  const consumables = CONSUMABLES.filter(item => (model.consumables as readonly string[]).includes(item.id));
  const [detail, setDetail] = useState<typeof CONSUMABLES[number] | null>(null);
  const label = (id: string) => id === 'water' ? copy('Water softener', '软水滤芯') : copy('HEPA filter', 'HEPA 滤芯');
  return <DeviceSurface>
    <DeviceHeader title={copy('Consumables', '耗材管理')} onBack={onBack} />
    <div className="bw-scroll bw-management">
      <div className="bw-management-product"><img src={model.image} alt={model.name} /><span>{model.name}</span></div>
      <div className="bw-consumables-list">{consumables.map(item => <button key={item.id} className={`bw-consumable-card ${item.id}`} onClick={() => setDetail(item)}>
        <span className="bw-consumable-heading"><span className="bw-consumable-icon"><item.Icon size={24} strokeWidth={1.6} aria-hidden="true" /></span><span>{label(item.id)}</span><span className="bw-consumable-info"><strong>{item.remaining}</strong><small>{copy('uses left', '次剩余')}</small></span><ChevronRight size={16} aria-hidden="true" /></span>
        <span className="bw-life-track"><span style={{ width: `${item.remaining / item.maximum * 100}%` }} /></span>
        <span className="bw-consumable-capacity">{copy(`Rated life · ${item.maximum} uses`, `额定寿命 · ${item.maximum} 次`)}</span>
      </button>)}</div>
    </div>
    {detail && <DeviceSheet title={label(detail.id)} onClose={() => setDetail(null)}><div className={`bw-consumable-detail ${detail.id}`}><detail.Icon size={42} /><strong>{detail.remaining}<small>{copy('uses left', '次剩余')}</small></strong><div className="bw-life-track"><span style={{ width: `${detail.remaining / detail.maximum * 100}%` }} /></div><p>{detail.id === 'water' ? copy('Softens wash water to help reduce mineral deposits. Replace the filter when its rated life is reached.', '软化清洗用水，减少水垢沉积。达到额定使用次数后，请及时更换滤芯。') : copy('Filters the air used for drying and storage. Replace the filter when its rated life is reached.', '过滤烘干与保管过程中使用的空气。达到额定使用次数后，请及时更换滤芯。')}</p><p>{copy(`Rated life · ${detail.maximum} uses`, `额定寿命 · ${detail.maximum} 次`)}</p></div></DeviceSheet>}
  </DeviceSurface>;
}
