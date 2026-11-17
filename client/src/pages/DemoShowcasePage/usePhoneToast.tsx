import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, LockOpen, CheckCircle } from 'lucide-react';

interface PhoneToastHook {
  toastMessage: string | null;
  toastIcon: 'lock' | 'unlock' | null;
  showToast: (message: string, icon?: 'lock' | 'unlock') => void;
  ToastElement: React.ReactNode;
}

export function usePhoneToast(): PhoneToastHook {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<'lock' | 'unlock' | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, icon?: 'lock' | 'unlock') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastMessage(message);
    setToastIcon(icon ?? null);
    timerRef.current = setTimeout(() => {
      setToastMessage(null);
      setToastIcon(null);
    }, 1800);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const ToastElement = (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          role="status"
          className="absolute top-14 left-1/2 z-[80] w-max max-w-[calc(100%-32px)] -translate-x-1/2 pointer-events-none"
        >
          <div className="flex items-center gap-2 rounded-2xl bg-black/80 px-4 py-2 backdrop-blur-md">
            {toastIcon === 'lock' && <Lock className="h-4 w-4 text-white" />}
            {toastIcon === 'unlock' && <LockOpen className="h-4 w-4 text-white" />}
            {!toastIcon && <CheckCircle className="h-4 w-4 shrink-0 text-white" />}
            <span className="text-sm font-medium text-white">{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { toastMessage, toastIcon, showToast, ToastElement };
}
