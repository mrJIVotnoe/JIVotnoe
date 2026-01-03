import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Re-export the global type to ensure compatibility with existing imports
export type TelegramWebApp = globalThis.TelegramWebApp;

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