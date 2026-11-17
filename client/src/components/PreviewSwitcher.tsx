import { Monitor, Smartphone } from 'lucide-react';
import { isApp } from '../runtime';
import { usePage } from '../demo/react';
import './preview.css';

export default function PreviewSwitcher() {
  const page = usePage();
  const switchMode = (app: boolean) => {
    if (app === isApp) return;
    const screen = page.id === 'devices' || (app && page.id === 'notifications')
      ? '' : page.id === 'notifications' ? '/notifications' : `/cleaning-machine/${page.id}`;
    window.location.hash = `/${app ? 'app' : 'demo'}${screen}`;
  };
  return <div className="preview-switcher" role="group" aria-label="预览版本">
    <button type="button" title="PC 版预览" aria-label="PC 版预览" aria-pressed={!isApp} onClick={() => switchMode(false)}><Monitor size={16} /><span>PC 版</span></button>
    <button type="button" title="移动版预览" aria-label="移动版预览" aria-pressed={isApp} onClick={() => switchMode(true)}><Smartphone size={16} /><span>移动版</span></button>
  </div>;
}
