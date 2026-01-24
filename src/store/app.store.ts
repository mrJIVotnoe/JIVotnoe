import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language } from '../types';

interface AppState {
  language: Language;
  activeSectionId: string;
  setLanguage: (lang: Language) => void;
  setActiveSectionId: (id: string) => void;
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
      language: 'en',
      activeSectionId: 'ai', // Default starting page
      
      setLanguage: (language: Language) => {
        set({ language });
      },

      setActiveSectionId: (id: string) => {
        set({ activeSectionId: id });
        window.scrollTo(0, 0); // Reset scroll on "page" change
      },

      initLanguage: () => {
        const stored = localStorage.getItem('byedpi-storage');
        if (!stored) {
           let detected: Language = 'en';
           if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
             const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code.split('-')[0] as Language;
             if (VALID_LANGUAGES.includes(tgLang)) detected = tgLang;
           } else {
             const browserLang = navigator.language.split('-')[0] as Language;
             if (VALID_LANGUAGES.includes(browserLang)) detected = browserLang;
           }
           set({ language: detected });
        }
      }
    }),
    {
      name: 'byedpi-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        language: state.language,
        activeSectionId: state.activeSectionId 
      }),
    }
  )
);