import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem('byedpi_lang') as Language;
    const validLanguages: Language[] = ['ru', 'en', 'uk', 'de', 'fr', 'es'];
    
    if (saved && validLanguages.includes(saved)) {
      setLanguage(saved);
    } else {
      // Auto-detect
      const browserLang = navigator.language.split('-')[0] as Language;
      if (validLanguages.includes(browserLang)) {
        setLanguage(browserLang);
      } else {
        setLanguage('en');
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('byedpi_lang', lang);
  };

  const t = (key: string): string => {
    // Try current language, fallback to English, then key itself
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};