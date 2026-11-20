import { Monitor, Smartphone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { experienceHash, isApp } from '../runtime';
import './preview.css';

export default function PreviewSwitcher() {
  const location = useLocation();
  const route = `#${location.pathname}${location.search}`;
  const switchTo = (mode: 'app' | 'demo') => {
    const url = new URL(window.location.href);
    if (mode === 'demo') url.searchParams.set('preview', 'pc');
    else url.searchParams.delete('preview');
    window.history.replaceState(null, '', url);
    window.location.hash = experienceHash(route, mode);
  };
  return <div className="preview-switcher" role="group" aria-label="预览版本">
    <button type="button" aria-pressed={!isApp} title="PC 版" onClick={() => { if (isApp) switchTo('demo'); }}><Monitor size={15} /><span>PC 版</span></button>
    <button type="button" aria-pressed={isApp} title="移动版" onClick={() => { if (!isApp) switchTo('app'); }}><Smartphone size={15} /><span>移动版</span></button>
  </div>;
}
