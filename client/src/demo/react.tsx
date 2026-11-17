import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { demoEngine, type Request } from './engine';
import { pages, getScene, type Operation, type Stage } from './catalog';
import { cleaningMachineStore } from '../pages/DemoShowcasePage/cleaning-machine-store';
import { localeStore } from '../pages/DemoShowcasePage/locale-store';
import { demoLocal } from './storage';
import { entryPath, isApp } from '../runtime';

demoEngine.setScenariosEnabled(!isApp);

export const useDemo = () => useSyncExternalStore(demoEngine.subscribe, demoEngine.getSnapshot);
let pageId = 'devices';
const pageListeners = new Set<() => void>();
export function setDemoPage(id: string) {
  if (pageId === id) return;
  demoEngine.routeChanged();
  pageId = id;
  pageListeners.forEach(fn => fn());
}
export function usePage() {
  const id = useSyncExternalStore(fn => { pageListeners.add(fn); return () => { pageListeners.delete(fn); }; }, () => pageId);
  return pages[id] ?? pages.home;
}
export function useDemoPage(id: string) {
  useLayoutEffect(() => { setDemoPage(id); }, [id]);
}
const registry = new Map<Operation, Request>();
export function useOperation(request: Request) {
  const latest = useRef(request);
  latest.current = request;
  const proxy = useRef<Request>({
    ...request,
    success: () => latest.current.success(),
    edit: request.edit ? () => { demoEngine.normal(); latest.current.edit?.(); } : undefined,
    ready: () => latest.current.ready?.() ?? true,
    cancel: () => latest.current.cancel?.(),
  });
  useLayoutEffect(() => {
    const current = proxy.current;
    registry.set(request.operation, current);
    return () => {
      if (registry.get(request.operation) === current) registry.delete(request.operation);
      if (demoEngine.getSnapshot().active?.request.operation === request.operation) demoEngine.normal();
    };
  }, [request.operation]);
  return () => {
    const active = demoEngine.getSnapshot().active;
    if (active?.request.operation === request.operation) {
      if (active.status === 'loading') return;
      demoEngine.retry();
    } else demoEngine.run(proxy.current);
  };
}
export function selectScene(id: string, operations: Operation[], retry: 'success' | 'failure') {
  if (isApp) return;
  demoEngine.normal();
  const scene = getScene(id);
  if (!scene) return;
  const operation = operations.find(op => scene.stage === 'global' || scene.operations.includes(op));
  const request = operation && registry.get(operation);
  if (!request) return;
  request.edit?.();
  demoEngine.run(request, { previewId: id, injection: { sceneId: id, policy: 'once', retry } });
}
export function resetDemo(stage?: Stage) {
  demoEngine.normal();
  if (!stage) {
    demoLocal.clear();
    cleaningMachineStore.reset();
    localeStore.reset();
    window.location.hash = entryPath();
    setDemoPage('devices');
  } else {
    if (stage === 'cleaning' || stage === 'running') cleaningMachineStore.reset();
    if (stage === 'settings') { demoLocal.remove('device-name'); localeStore.reset(); }
    if (stage === 'items') demoLocal.remove('items');
  }
  demoEngine.reset(stage);
}
export function RouteBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { revision } = useDemo();
  useLayoutEffect(() => {
    demoEngine.routeChanged();
    if (location.pathname === entryPath() || location.pathname === `${entryPath()}/`) setDemoPage('devices');
    if (location.pathname === entryPath('/notifications')) setDemoPage('notifications');
  }, [location.pathname, location.search]);
  useEffect(() => () => demoEngine.normal(), []);
  return <div className="demo-route" key={`${location.pathname}:${revision}`}>{children}</div>;
}
export function OperationState({ operation, replace = false }: { operation?: Operation; replace?: boolean }) {
  const { active } = useDemo();
  if (!active || (operation && active.request.operation !== operation)) return null;
  if (!active.scene && !replace) return null;
  return <section className={`operation-state ${replace ? 'operation-replace' : ''}`} role="status" data-operation-state>
    <p>{active.status === 'loading' ? active.scene?.process ?? '正在处理…' : active.scene?.message}</p>
    {active.status === 'loading' ? <progress max="100" value={active.progress} aria-label="处理进度" /> : <button onClick={demoEngine.retry}>重试</button>}
    <button onClick={demoEngine.normal}>取消</button>
  </section>;
}
