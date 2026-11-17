import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IPhoneFrame from "@client/src/components/IPhoneFrame";
import { cleaningMachineStore } from "../DemoShowcasePage/cleaning-machine-store";
import type { CleaningMachineState } from "../DemoShowcasePage/cleaning-machine-store";
import deviceImage from '../../assets/device-bw05s.png';
import { OperationState, useDemo, useDemoPage, useOperation } from '../../demo/react';
import { cycleProgress, cycleSteps } from '../DemoShowcasePage/machine-cycle';

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
    <IPhoneFrame background="#f0ecff url('https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/75e322f6-8b3d-4e00-8384-7b3a431dda1b/raw') center/cover">
      <div
        className="relative flex h-full flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-8">
          <h1
            className="text-[24px] font-bold leading-tight"
            style={{ color: "#121212" }}
          >
            Clara's Family
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-white"
            style={{
              boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </motion.button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 pt-5 pb-28">
          {active?.request.operation === 'devices.load' ? <OperationState operation="devices.load" replace /> : <>
          {/* Baby Monitor Card */}
          <div
            className="rounded-[20px] p-4"
            style={{ background: "#f0ecff" }}
          >
            {/* Monitor Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Camera Icon */}
                <img
                  src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/85cb8fe4-88ab-4fcf-8275-7191a943ec21/raw"
                  alt="Camera"
                  className="h-9 w-9 shrink-0 object-contain"
                />
                <div className="flex flex-col gap-0.5">
                  <p
                    className="text-[16px] font-semibold leading-tight"
                    style={{ color: "#7042d8" }}
                  >
                    Clara's Baby Monitor 01
                  </p>
                  <div className="flex items-center gap-1">
                    <svg width="16" height="10" viewBox="0 0 24 14" fill="none">
                      <rect x="0.5" y="0.5" width="20" height="13" rx="2.5" stroke="#7042d8" strokeWidth="1.5" />
                      <rect x="2" y="2" width="15" height="10" rx="1.5" fill="#7042d8" />
                      <path d="M22 5v4a2 2 0 000-4z" fill="#7042d8" fillOpacity="0.5" />
                    </svg>
                    <span
                      className="text-[12px]"
                      style={{ color: "#7042d8", fontWeight: 500 }}
                    >
                      80%
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0" style={{ color: "#b8a5e8" }} />
            </div>

            {/* Video Preview */}
            <div
              className="relative overflow-hidden rounded-[14px]"
              style={{ aspectRatio: "16/9" }}
            >
              <img
                src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/8a1ec7e0-f506-4a02-b394-62c7e554ab2e/raw"
                alt="Baby Monitor"
                className="h-full w-full object-cover"
              />

            </div>
          </div>

          {/* Cleaning Machine Device Card */}
          <motion.div
            data-connector="device"
            whileTap={{ scale: 0.98 }}
            onClick={() => { cleaningMachineStore.set({ activeScreen: isDeviceActive ? machineState.selectedMode === 'smart' ? 'smart-mode' : 'run-control' : 'home' }); navigate("/cleaning-machine"); }}
            className="flex cursor-pointer items-center gap-4 rounded-[20px] px-4 py-4"
            style={{
              background: "#e8f3ff",
            }}
          >
            {/* Device Image */}
            <div
              className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-[16px] bg-white"
              style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.04)" }}
            >
              <img
                src={deviceImage}
                alt="Cleaning Machine"
                className="h-[60px] w-[60px] object-contain"
              />
            </div>

            {/* Device Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-center justify-between">
                <span
                  className="text-[18px]"
                  style={{ color: "#244e7c", fontWeight: 600 }}
                >
                  Cleaning Machine
                </span>
                <ChevronRight className="h-5 w-5" style={{ color: "#729dcc" }} />
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className="text-[12px]" style={{ color: statusColor }}>
                  {statusText}
                </span>
                {isDeviceActive && modeLabel && (
                  <span className="text-[11px]" style={{ color: '#497ba8' }}>
                    · {modeLabel}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
          </>}
        </div>

        {/* Bottom Tab Bar - Liquid Glass */}
        <div
          className="liquid-glass absolute bottom-8 left-4 right-4"
          style={{ height: 62, borderRadius: 31 }}
        >
          <div className="relative z-10 flex h-full items-center justify-around">
          <TabItem
            icon={
              <img
                src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/a3dd92a2-9bc7-406c-a9ea-b7b62dfcf98d/raw"
                alt="Home"
                className="h-6 w-6"
              />
            }
            label="Home"
            active={false}
          />
          <TabItem
            icon={
              <img
                src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/f83ee628-7a91-4fed-894c-1f7d4763f83b/raw"
                alt="Device"
                className="h-6 w-6"
              />
            }
            label="Device"
            active={true}
          />
          <TabItem
            icon={
              <img
                src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/01cbbc92-a939-4726-ae54-0e49f3c80db4/raw"
                alt="Community"
                className="h-6 w-6"
              />
            }
            label="Community"
            active={false}
          />
          <TabItem
            icon={
              <img
                src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/321f0f3e-e355-4bd0-afc3-8d77bc9f2a59/raw"
                alt="Me"
                className="h-6 w-6"
              />
            }
            label="Me"
            active={false}
          />
          </div>
        </div>
      </div>
    </IPhoneFrame>
  );
};

interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, active }) => (
  <button className="flex flex-col items-center justify-center gap-1 w-14">
    <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
    <span
      className="text-[10px] leading-none"
      style={{ color: active ? "#121212" : "#999497", fontWeight: 500 }}
    >
      {label}
    </span>
  </button>
);

export default DeviceList;
