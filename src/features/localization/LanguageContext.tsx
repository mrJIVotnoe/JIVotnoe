import React, { useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/app.store';
import { translations } from '../../translations'; // Adjust path if needed, assumed correct based on structure
import { Language } from '../../types';

// Backward compatibility interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// The Provider is now just an Initializer Component.
// It doesn't actually provide Context anymore, but runs startup logic.
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initLanguage = useAppStore((state) => state.initLanguage);

  useEffect(() => {
    initLanguage();
  }, [initLanguage]);

  return <>{children}</>;
};

// The hook now connects directly to the Store
export const useLanguage = (): LanguageContextType => {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const t = useCallback((key: string): string => {
    // Fallback logic matches original
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  return { language, setLanguage, t };
};