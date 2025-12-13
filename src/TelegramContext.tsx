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
  platform: string;
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
  platform: string;
  user: any;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize synchronously to have data ready for initial render
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(() => 
    typeof window !== 'undefined' ? window.Telegram?.WebApp || null : null
  );
  
  const isTelegram = !!webApp?.initData;
  const platform = webApp?.platform || 'unknown';
  const user = webApp?.initDataUnsafe?.user || null;

  useEffect(() => {
    if (webApp) {
      // Initialize
      webApp.ready();
      try {
        webApp.expand(); // Request full screen
      } catch (e) {
        console.warn('Expand not supported');
      }
      
      // Force Cyberpunk Theme Colors (Only for version > 6.1)
      try {
        if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('6.1')) {
          webApp.setHeaderColor('#0f172a'); // bg-cyber-900
          webApp.setBackgroundColor('#0f172a');
        }
      } catch (e) {
        console.error("Error setting TG colors", e);
      }
    }
  }, [webApp]);

  return (
    <TelegramContext.Provider value={{ webApp, isTelegram, platform, user }}>
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