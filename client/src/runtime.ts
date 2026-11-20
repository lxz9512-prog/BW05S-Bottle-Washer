// The entry is fixed for this document, so modes never share live stores or timers.
export function resolveEntry(hash: string, compact: boolean) {
  const path = hash.replace(/^#/, '').split('?')[0];
  if (/^\/app(?:\/|$)/.test(path)) return { mode: 'app' as const, base: '/app' };
  if (/^\/demo(?:\/|$)/.test(path)) return { mode: 'demo' as const, base: '/demo' };
  if (!path || path === '/') return compact
    ? { mode: 'app' as const, base: '/app' }
    : { mode: 'demo' as const, base: '/demo' };
  return { mode: 'demo' as const, base: '' };
}

export function experienceHash(hash: string, mode: 'app' | 'demo') {
  const route = hash.replace(/^#/, '').replace(/^\/(?:app|demo)(?=\/|\?|$)/, '');
  const [path] = route.split('?');
  const businessRoute = /^\/cleaning-machine(?:\/|$)/.test(path);
  const notifications = mode === 'demo' && path === '/notifications';
  return `#/${mode}${businessRoute || notifications ? route : ''}`;
}

const compact = window.matchMedia('(max-width: 768px)').matches;
const phone = window.matchMedia('(max-width: 1023px) and (pointer: coarse)').matches;
const url = new URL(window.location.href);
// Shared PC links should not put a second phone frame inside a real phone.
if (phone && url.searchParams.get('preview') !== 'pc' && resolveEntry(url.hash, compact).mode === 'demo') {
  url.hash = experienceHash(url.hash, 'app');
  window.history.replaceState(null, '', url);
}
const entry = resolveEntry(window.location.hash, compact);
export const isApp = entry.mode === 'app';
export const entryBase = entry.base;
export const entryPath = (path = '/') => `${entryBase}${path === '/' ? '' : path}` || '/';

if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${entryPath()}`);
}
document.documentElement.dataset.experience = entry.mode;
window.addEventListener('hashchange', () => {
  const next = resolveEntry(window.location.hash, window.matchMedia('(max-width: 768px)').matches);
  if (next.mode !== entry.mode || next.base !== entry.base) window.location.reload();
});
