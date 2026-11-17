import { useState, useEffect, useCallback } from 'react';
import { localeStore, type Locale } from './locale-store';
import { translations, type TranslationKey } from './translations';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(localeStore.get().locale);

  useEffect(() => {
    return localeStore.subscribe(() => {
      setLocaleState(localeStore.get().locale);
    });
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const text = translations[locale]?.[key] ?? translations.zh[key] ?? key;
    if (!params) return text;
    return Object.entries(params).reduce(
      (result, [paramKey, value]) => result.replace(`{${paramKey}}`, String(value)),
      text,
    );
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    localeStore.set({ locale: newLocale });
  }, []);

  return { locale, t, setLocale };
}
