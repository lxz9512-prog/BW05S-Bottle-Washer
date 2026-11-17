import { ChevronLeft, ChevronRight, Timer, AlertTriangle, CheckCircle2 } from 'lucide-react';
import IPhoneFrame from '@client/src/components/IPhoneFrame';

interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  appName: string;
  title: string;
  body: string;
  time: string;
  iconBg: string;
}

const DEVICE_NAME = "Cleaning Machine";

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'time-extended',
    icon: <Timer className="w-3.5 h-3.5 text-white" />,
    appName: DEVICE_NAME,
    title: DEVICE_NAME,
    body: 'Heavy soiling detected. Cleaning time has been extended by approximately 5 minutes.',
    time: 'now',
    iconBg: '#FF9500',
  },
  {
    id: 'not-started',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-white" />,
    appName: DEVICE_NAME,
    title: DEVICE_NAME,
    body: 'The cleaning machine has not started. You may have forgotten to turn it on.',
    time: '2m ago',
    iconBg: '#FF3B30',
  },
  {
    id: 'completed',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-white" />,
    appName: DEVICE_NAME,
    title: DEVICE_NAME,
    body: 'This cleaning cycle has been completed.',
    time: '5m ago',
    iconBg: '#34C759',
  },
];

const DESCRIPTION = [
  '本页模拟 iOS 锁屏推送通知的展示效果。',
  '包含三类典型通知场景：',
  '**1. 清洁时间延长** — 检测到重度脏污，自动延长清洗时间约 5 分钟。',
  '**2. 清洗未启动** — 提醒用户清洗机未启动工作，可能是忘了开启。',
  '**3. 清洗完成** — 通知用户本次清洗工作已完成。',
  '每条通知包含 App 图标、设备名称（#设备名称）、时间戳和提示文案。',
];


const NotificationsScreen = () => {
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* iOS Lock Screen Header */}
        <div className="shrink-0 flex flex-col items-center pt-10 pb-2">
          <span
            className="text-[14px] font-medium tracking-wide"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Monday, July 13
          </span>
          <span
            className="text-[72px] font-bold leading-none tracking-tight"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 12px rgba(0,0,0,0.15)',
              fontWeight: 200,
              fontSize: '68px',
              letterSpacing: '-2px',
            }}
          >
            11:29
          </span>
        </div>

        {/* Notification stack */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4">
          <div className="space-y-[10px] pb-8">
            {NOTIFICATIONS.map((notification, index) => (
              <div
                key={notification.id}
                className="ios-notification rounded-[16px] p-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  border: '0.5px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* App header row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: notification.iconBg }}
                  >
                    {notification.icon}
                  </div>
                  <span
                    className="text-[12px] font-semibold uppercase tracking-[0.02em] flex-1 truncate"
                    style={{ color: 'rgba(0, 0, 0, 0.55)' }}
                  >
                    {notification.appName}
                  </span>
                  <span
                    className="text-[12px] shrink-0"
                    style={{ color: 'rgba(0, 0, 0, 0.4)' }}
                  >
                    {notification.time}
                  </span>
                </div>

                {/* Body */}
                <p
                  className="text-[13px] leading-[1.35]"
                  style={{ color: 'rgba(0, 0, 0, 0.7)' }}
                >
                  {notification.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar - iOS style */}
        <div className="shrink-0 flex items-center justify-center py-4 pb-6">
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
            <span className="text-[12px] font-medium" style={{ color: 'rgba(0,0,0,0.5)' }}>
              3 Notifications
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .ios-notification {
          animation: slideDown 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

const NotificationsDemoPage = () => {
  return (
      <IPhoneFrame background="#536e68" statusBarColor="#FFFFFF">
        <NotificationsScreen />
      </IPhoneFrame>
  );
};

export default NotificationsDemoPage;
