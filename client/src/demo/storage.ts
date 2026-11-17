export const PREFIX = 'BW05S_demo_v1:';
export const demoLocal = {
  get<T>(key: string, fallback: T): T {
    try { const value = localStorage.getItem(PREFIX + key); return value ? JSON.parse(value) : fallback; }
    catch { return fallback; }
  },
  set(key: string, value: unknown) { localStorage.setItem(PREFIX + key, JSON.stringify(value)); },
  remove(key: string) { localStorage.removeItem(PREFIX + key); },
  clear() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) localStorage.removeItem(key);
    }
  },
};
