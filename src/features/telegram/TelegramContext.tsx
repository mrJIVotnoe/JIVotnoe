import React, { useEffect } from 'react';
import { useTelegramStore } from '../../store/telegram.store';

// Initialization Component
export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const init = useTelegramStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
};

// Hook Adapter for backward compatibility
export const useTelegram = () => {
  const { webApp, isTelegram, platform, user } = useTelegramStore();
  
  return { 
    webApp, 
    isTelegram, 
    platform, 
    user,
    // Add helper methods directly here if needed
    close: () => webApp?.close(),
    openLink: (url: string) => {
        if (webApp) webApp.openLink(url);
        else window.open(url, '_blank');
    }
  };
};