import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  isTelegram: boolean;
  platform: string;
  user: any;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const app = window.Telegram.WebApp;
      setWebApp(app);
      app.ready();
      try {
        app.expand();
      } catch (e) {
        console.warn('Expand not supported');
      }
      
      try {
        if (app.isVersionAtLeast && app.isVersionAtLeast('6.1')) {
          app.setHeaderColor('#0f172a');
          app.setBackgroundColor('#0f172a');
        }
      } catch (e) {
        console.error("Error setting TG colors", e);
      }
    }
  }, []);

  const isTelegram = !!webApp?.initData;
  const platform = webApp?.platform || 'unknown';
  const user = webApp?.initDataUnsafe?.user || null;

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