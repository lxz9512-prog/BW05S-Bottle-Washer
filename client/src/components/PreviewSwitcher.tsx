import { Monitor, Smartphone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { experienceHash, isApp } from '../runtime';
import './preview.css';

export default function PreviewSwitcher() {
  const location = useLocation();
  const route = `#${location.pathname}${location.search}`;
  return <div className="preview-switcher" role="group" aria-label="预览版本">
    <button type="button" aria-pressed={!isApp} title="PC 版" onClick={() => { if (isApp) window.location.hash = experienceHash(route, 'demo'); }}><Monitor size={15} /><span>PC 版</span></button>
    <button type="button" aria-pressed={isApp} title="移动版" onClick={() => { if (!isApp) window.location.hash = experienceHash(route, 'app'); }}><Smartphone size={15} /><span>移动版</span></button>
  </div>;
}
