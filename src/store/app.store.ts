import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language } from '../types';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  // This action allows us to set language without persistence check if needed,
  // but for now simple setLanguage is enough.
  initLanguage: () => void;
}

const VALID_LANGUAGES: Language[] = [
  'ru', 'en', 'uk', 'de', 'fr', 'es', 
  'kk', 'uz', 'az', 'hy', 'be', 'ky', 'tg', 'tk', 
  'zh', 'fa', 'tr', 'ar', 'pt', 'id'
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en', // Default fallback
      
      setLanguage: (language: Language) => {
        set({ language });
      },

      initLanguage: () => {
        // We only auto-detect if the state hasn't been hydrated/set effectively by persistence yet
        // However, Zustand persist handles hydration automatically. 
        // This function is for "First Launch" logic if storage is empty.
        // We can check if we are in a default state or if specific logic is needed.
        
        // Since persist runs first, we only override if we think we are in a fresh state
        // or if we want to enforce Telegram language over browser language on first load.
        // For simplicity, we trust persistence, but if it's strictly default ('en'), 
        // we might try to detect.
        
        // In a real app, 'persist' usually handles this. But for the sake of the existing logic:
        const current = get().language;
        const stored = localStorage.getItem('byedpi-storage');
        
        if (!stored) {
           // No storage found, auto-detect
           let detected: Language = 'en';
           
           // 1. Try Telegram
           if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
             const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code.split('-')[0] as Language;
             if (VALID_LANGUAGES.includes(tgLang)) detected = tgLang;
           } 
           // 2. Try Browser
           else {
             const browserLang = navigator.language.split('-')[0] as Language;
             if (VALID_LANGUAGES.includes(browserLang)) detected = browserLang;
           }
           
           set({ language: detected });
        }
      }
    }),
    {
      name: 'byedpi-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ language: state.language }), // Persist only language for now
    }
  )
);