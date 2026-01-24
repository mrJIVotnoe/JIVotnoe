export {}

declare global {
  interface TelegramWebApp {
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
    isVersionAtLeast(version: string): boolean;
    colorScheme: 'light' | 'dark';
    themeParams: Record<string, any>;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    BackButton: {
      isVisible: boolean;
      show(): void;
      hide(): void;
      onClick(cb: () => void): void;
      offClick(cb: () => void): void;
    };
    MainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isActive: boolean;
      show(): void;
      hide(): void;
      onClick(cb: () => void): void;
      offClick(cb: () => void): void;
    };
    HapticFeedback: {
      impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    };
    ready(): void;
    expand(): void;
    close(): void;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    openTelegramLink(url: string): void;
    openLink(url: string): void;
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}