import { demoLocal } from '../../demo/storage';

export type Locale = 'zh' | 'en';

export interface LocaleState {
  locale: Locale;
  darkMode: boolean;
}

const DEFAULT_STATE: LocaleState = {
  locale: 'zh',
  darkMode: false,
};

const saved = demoLocal.get<Partial<LocaleState>>('preferences', {});
let state: LocaleState = { locale: saved.locale === 'en' ? 'en' : 'zh', darkMode: saved.darkMode === true };
let listeners: Array<() => void> = [];

export const localeStore = {
  get(): LocaleState {
    return { ...state };
  },

  set(partial: Partial<LocaleState>) {
    state = { ...state, ...partial };
    demoLocal.set('preferences', state);
    listeners.forEach(fn => fn());
  },

  reset() {
    state = { ...DEFAULT_STATE };
    demoLocal.remove('preferences');
    listeners.forEach(fn => fn());
  },

  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
