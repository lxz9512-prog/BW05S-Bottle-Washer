import { useEffect, useSyncExternalStore } from 'react';
import { type ModeConfig } from './demo-constants';
import { useNavigate } from 'react-router-dom';
import IPhoneFrame from '../../components/IPhoneFrame';
import HomeScreen from './HomeScreen';
import RunControlScreen from './RunControlScreen';
import CustomModeScreen from './CustomModeScreen';
import SmartModeScreen from './SmartModeScreen';
import SettingsScreen from './SettingsScreen';
import DeviceInfoScreen from './DeviceInfoScreen';
import BabyItemsScreen from './BabyItemsScreen';
import OtherSettingsScreen from './OtherSettingsScreen';
import { cleaningMachineStore } from './cleaning-machine-store';
import { useDarkMode } from './useDarkMode';
import { OperationState, useDemo, useDemoPage, useOperation } from '../../demo/react';
import { demoEngine } from '../../demo/engine';

export default function DemoShowcasePage() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const machine = useSyncExternalStore(cleaningMachineStore.subscribe, cleaningMachineStore.getSnapshot);
  const { activeScreen, selectedMode, isRunning, customConfig, lastUsedMode, modeConfig } = machine;
  const { active } = useDemo();
  const setScreen = (screen: string) => cleaningMachineStore.set({ activeScreen: screen });
  useDemoPage(activeScreen === 'device-control' ? 'home' : activeScreen);
  useEffect(() => {
    const change = (event: Event) => setScreen((event as CustomEvent<string>).detail);
    window.addEventListener('bw05s:navigate', change);
    return () => window.removeEventListener('bw05s:navigate', change);
  }, []);
  const commitStart = (config: ModeConfig, delay?: number) => {
    cleaningMachineStore.set({ selectedMode: config.modeId, modeConfig: config, customConfig: config.customSteps ?? null,
      lastUsedMode: config.modeId, isRunning: !delay, standby: false, cycleActive: !delay,
      scheduleAt: delay ? Date.now() + delay * 60000 : null, elapsedSeconds: 0, runStartedAt: delay ? null : Date.now(),
      activeScreen: config.modeId === 'smart' ? 'smart-mode' : 'run-control' });
  };
  const control = useOperation({ operation: 'running.control', stage: 'running', label: '运行控制', success: () => {
    const state = cleaningMachineStore.get();
    cleaningMachineStore.set({ isRunning: !state.isRunning, cycleActive: true, runStartedAt: state.isRunning ? null : Date.now() });
  } });
  const stop = () => {
    demoEngine.normal();
    cleaningMachineStore.set({ activeScreen: 'home', selectedMode: null, modeConfig: null, customConfig: null,
      isRunning: false, cycleActive: false, scheduleAt: null, runStartedAt: null, elapsedSeconds: 0, standby: false });
  };
  const back = () => { demoEngine.normal(); navigate('/'); };
  const homeProps = { onNavigate: (config: ModeConfig) => commitStart(config), onSchedule: (config: ModeConfig, minutes: number) => commitStart(config, minutes),
    selectedMode, onSelectMode: (id: string | null) => cleaningMachineStore.set({ selectedMode: id }), lastUsedMode, onSettings: () => setScreen('settings') };
  const runningProps = { isRunning, suspended: !!active, modeConfig, onTogglePause: control, onBack: back, onStop: stop, onSettings: () => setScreen('settings') };
  let screen;
  switch (activeScreen) {
    case 'home': case 'device-control': screen = <HomeScreen {...homeProps} />; break;
    case 'custom-mode': screen = <CustomModeScreen {...homeProps} />; break;
    case 'smart-mode': screen = <SmartModeScreen {...runningProps} />; break;
    case 'run-control': screen = <RunControlScreen {...runningProps} selectedMode={selectedMode} customConfig={customConfig} onUpdateCustomConfig={config => cleaningMachineStore.set({ customConfig: config })} />; break;
    case 'settings': screen = <SettingsScreen onBack={() => setScreen(machine.scheduleAt || machine.cycleActive ? selectedMode === 'smart' ? 'smart-mode' : 'run-control' : 'home')} onBabyItems={() => setScreen('baby-items')} onDeviceInfo={() => setScreen('device-info')} onOtherSettings={() => setScreen('other-settings')} />; break;
    case 'other-settings': screen = <OtherSettingsScreen onBack={() => setScreen('settings')} />; break;
    case 'device-info': screen = <DeviceInfoScreen onBack={() => setScreen('settings')} />; break;
    case 'baby-items': screen = <BabyItemsScreen onBack={() => setScreen('settings')} />; break;
    default: screen = null;
  }
  const hasDeviceBackground = ['home', 'device-control', 'custom-mode', 'run-control', 'smart-mode'].includes(activeScreen);
  const background = darkMode ? '#121212' : hasDeviceBackground ? 'linear-gradient(180deg,#cce2ff 0%,#edf3fa 25%,#f9f7f5 46%,#f9f7f5 100%)' : '#F5F5F5';
  return <IPhoneFrame statusBarColor={darkMode ? '#FFFFFF' : '#000000'} background={background}>
    <div className="relative h-full flex flex-col">
      {['home', 'custom-mode', 'run-control', 'smart-mode'].includes(activeScreen) && <OperationState operation={['home', 'custom-mode'].includes(activeScreen) ? 'cleaning.start' : 'running.control'} />}
      <div className="flex-1 min-h-0" style={{ paddingBottom: hasDeviceBackground ? 0 : 32 }}>{screen}</div>
    </div>
  </IPhoneFrame>;
}
