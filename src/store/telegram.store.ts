import { create } from 'zustand';

interface TelegramState {
  webApp: TelegramWebApp | null;
  isTelegram: boolean;
  platform: string;
  user: any;
  init: () => void;
}

export const useTelegramStore = create<TelegramState>((set, get) => ({
  webApp: null,
  isTelegram: false,
  platform: 'web',
  user: null,

  init: () => {
    if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
      return;
    }

    const webApp = window.Telegram.WebApp;
    
    // Initialize logic
    webApp.ready();
    
    try {
      webApp.expand();
      // Enforce Cyberpunk theme integration
      if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('6.1')) {
        webApp.setHeaderColor('#0f172a'); 
        webApp.setBackgroundColor('#0f172a');
      }
    } catch (e) {
      console.warn('Telegram initialization warning:', e);
    }

    set({
      webApp,
      isTelegram: !!webApp.initData,
      platform: webApp.platform || 'web',
      user: webApp.initDataUnsafe?.user || null
    });
  }
}));