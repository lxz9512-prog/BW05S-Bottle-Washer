export type Locale = 'zh' | 'en';

export interface LocaleState {
  locale: Locale;
  darkMode: boolean;
}

const DEFAULT_STATE: LocaleState = {
  locale: 'zh',
  darkMode: false,
};

let state: LocaleState = { ...DEFAULT_STATE };
let listeners: Array<() => void> = [];

export const localeStore = {
  get(): LocaleState {
    return { ...state };
  },

  set(partial: Partial<LocaleState>) {
    state = { ...state, ...partial };
    listeners.forEach(fn => fn());
  },

  reset() {
    state = { ...DEFAULT_STATE };
    listeners.forEach(fn => fn());
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
