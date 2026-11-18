import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IPhoneFrame from "@client/src/components/IPhoneFrame";
import { cleaningMachineStore } from "../DemoShowcasePage/cleaning-machine-store";
import type { CleaningMachineState } from "../DemoShowcasePage/cleaning-machine-store";
import deviceImage from '../../assets/device-bw05s.png';
import { OperationState, useDemo, useDemoPage, useOperation } from '../../demo/react';
import { cycleProgress, cycleSteps } from '../DemoShowcasePage/machine-cycle';
import { entryPath } from '../../runtime';
import monitorPreview from '../../assets/monitor-preview.jpg';
import monitorCamera from '../../assets/mobile-home/monitor-camera.png';
import tabHome from '../../assets/mobile-home/tab-home.png';
import tabDevice from '../../assets/mobile-home/tab-device.png';
import tabCommunity from '../../assets/mobile-home/tab-community.png';
import tabMe from '../../assets/mobile-home/tab-me.png';
import './device-home.css';

const MODE_LABELS: Record<string, string> = {
  smart: 'Smart Mode',
  auto: 'Standard',
  rapid: 'Rapid',
  'self-clean': 'Self Clean',
  baby: 'Breast Pump',
  bottles: 'Teethers',
  'food-bowl': 'Baby Dish',
  'delicate-wash': 'Adaptive Material Care',
  'breast-pump': 'Breast Pump',
  custom: 'Custom',
};

const DeviceList: React.FC = () => {
  useDemoPage('devices');
  useOperation({ operation: 'devices.load', stage: 'devices', label: '查找设备', success: () => {} });
  const { active } = useDemo();
  const navigate = useNavigate();
  const [machineState, setMachineState] = useState<CleaningMachineState>(cleaningMachineStore.get());

  useEffect(() => {
    const unsubscribe = cleaningMachineStore.subscribe(() => {
      setMachineState(cleaningMachineStore.get());
    });
    setMachineState(cleaningMachineStore.get());
    return unsubscribe;
  }, []);
  const isDeviceActive = machineState.cycleActive || !!machineState.scheduleAt;
  const complete = cycleProgress(cycleSteps(machineState.selectedMode, machineState.customConfig), machineState.elapsedSeconds).complete;
  const statusText = machineState.scheduleAt ? 'Scheduled' : isDeviceActive
    ? (complete ? 'Done' : machineState.isRunning ? 'In Progress' : 'Paused')
    : 'Standby';
  const statusColor = isDeviceActive
    ? (machineState.isRunning || machineState.scheduleAt ? '#287dcc' : '#b56c15')
    : '#9E9E9E';
  const modeLabel = machineState.selectedMode
    ? (machineState.modeConfig?.modeLabel || MODE_LABELS[machineState.selectedMode] || '')
    : '';

  return (
    <IPhoneFrame background="#fcf9f7">
      <div className="device-home">
        <header className="home-header">
          <h1>Clara's Family</h1>
          <motion.button type="button" aria-label="添加设备" whileTap={{ scale: 0.95 }} className="home-add">
            <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
          </motion.button>
        </header>

        <section className="home-content" aria-label="设备列表">
          {active?.request.operation === 'devices.load' ? <OperationState operation="devices.load" replace /> : <>
          <div className="home-card monitor-card">
            <div className="monitor-heading">
              <img className="monitor-icon" src={monitorCamera} alt="Camera" />
              <div className="monitor-meta">
                <p className="monitor-title">Clara's Baby Monitor 01</p>
                <div className="monitor-battery">
                    <svg width="16" height="10" viewBox="0 0 24 14" fill="none">
                      <rect x="0.5" y="0.5" width="20" height="13" rx="2.5" stroke="#7042d8" strokeWidth="1.5" />
                      <rect x="2" y="2" width="15" height="10" rx="1.5" fill="#7042d8" />
                      <path d="M22 5v4a2 2 0 000-4z" fill="#7042d8" fillOpacity="0.5" />
                    </svg>
                    <span>80%</span>
                </div>
              </div>
              <ChevronRight size={20} aria-hidden="true" />
            </div>
            <div className="monitor-preview-frame">
              <img src={monitorPreview} alt="Baby Monitor" className="monitor-preview" />
            </div>
          </div>

          <motion.button
            type="button"
            data-connector="device"
            whileTap={{ scale: 0.98 }}
            onClick={() => { const screen = isDeviceActive ? machineState.selectedMode === 'smart' ? 'smart-mode' : 'run-control' : 'home'; cleaningMachineStore.set({ activeScreen: screen }); navigate(entryPath(`/cleaning-machine/${screen}`)); }}
            className="home-card device-card"
          >
            <span className="device-image">
              <img src={deviceImage} alt="Cleaning Machine" />
            </span>
            <span className="device-meta">
              <span className="device-heading">
                <span className="device-title">Cleaning Machine</span>
                <ChevronRight size={20} aria-hidden="true" />
              </span>
              <span className="device-status">
                <span className="device-status-dot" style={{ backgroundColor: statusColor }} />
                <span style={{ color: statusColor }}>{statusText}</span>
                {isDeviceActive && modeLabel && <span className="device-mode">· {modeLabel}</span>}
              </span>
            </span>
          </motion.button>
          </>}
        </section>

        <nav className="home-tabs" aria-label="底部导航">
          {[
            { id: 'home', icon: tabHome, label: 'Home' },
            { id: 'device', icon: tabDevice, label: 'Device' },
            { id: 'community', icon: tabCommunity, label: 'Community' },
            { id: 'me', icon: tabMe, label: 'Me' },
          ].map(tab => (
            <button type="button" key={tab.id} className="home-tab" aria-current={tab.id === 'device' ? 'page' : undefined}>
              <img className="home-tab-icon" src={tab.icon} alt="" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </IPhoneFrame>
  );
};

export default DeviceList;
