export const telegram = {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  },

  init() {
    if (!this.isAvailable()) return;
    
    const webApp = window.Telegram!.WebApp;
    webApp.ready();
    
    try {
      webApp.expand();
      // Enforce Cyberpunk theme integration if version allows
      if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('6.1')) {
        webApp.setHeaderColor('#0f172a'); 
        webApp.setBackgroundColor('#0f172a');
      }
    } catch (e) {
      console.warn('Telegram init error:', e);
    }
  },

  close() {
    if (this.isAvailable()) {
      window.Telegram!.WebApp.close();
    }
  },

  get platform() {
    return window.Telegram?.WebApp?.platform || 'web';
  },

  get webApp() {
    return window.Telegram?.WebApp;
  }
};
