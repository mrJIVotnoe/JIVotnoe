import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define types manually to avoid extra npm dependencies
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  version: string;
  isVersionAtLeast: (version: string) => boolean;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, any>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  isTelegram: boolean;
  user: any;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setWebApp(tg);
      // initData is populated if opened inside Telegram
      setIsTelegram(!!tg.initData); 
      
      // Initialize
      tg.ready();
      try {
        tg.expand(); // Request full screen
      } catch (e) {
        console.warn('Expand not supported');
      }

      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Force Cyberpunk Theme Colors (Only for version > 6.1)
      try {
        if (tg.isVersionAtLeast && tg.isVersionAtLeast('6.1')) {
          tg.setHeaderColor('#0f172a'); // bg-cyber-900
          tg.setBackgroundColor('#0f172a');
        }
      } catch (e) {
        console.error("Error setting TG colors", e);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, isTelegram, user }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};