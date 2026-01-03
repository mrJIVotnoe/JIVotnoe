
export type Language = 
  | 'ru' | 'en' | 'uk' | 'de' | 'fr' | 'es' 
  | 'kk' | 'uz' | 'az' | 'hy' | 'be' | 'ky' | 'tg' | 'tk' 
  | 'zh' | 'fa' | 'tr' | 'ar' | 'pt' | 'id';

export type LocalizedString = Record<string, string>; // Flexible record for many languages

export enum StrategyType {
  STANDARD = 'STANDARD',
  TELEGRAM_FIX = 'TELEGRAM_FIX',
  SHUTDOWN_OZON = 'SHUTDOWN_OZON',
  SHUTDOWN_VK = 'SHUTDOWN_VK',
  SHUTDOWN_WB = 'SHUTDOWN_WB',
}

export interface StrategyConfig {
  id: StrategyType;
  name: LocalizedString;
  description: LocalizedString;
  command: string;
  tags: string[];
  recommended: boolean;
}

export interface DnsProvider {
  name: string;
  primary: string;
  secondary: string;
  description: LocalizedString;
  type: 'security' | 'privacy' | 'backup';
}
