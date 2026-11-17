import { useState, useEffect, useCallback } from 'react';
import { localeStore } from './locale-store';

export function useDarkMode() {
  const [darkMode, setDarkModeState] = useState(localeStore.get().darkMode);

  useEffect(() => {
    return localeStore.subscribe(() => {
      setDarkModeState(localeStore.get().darkMode);
    });
  }, []);

  const toggleDarkMode = useCallback((value: boolean) => {
    localeStore.set({ darkMode: value });
  }, []);

  return { darkMode, toggleDarkMode };
}
