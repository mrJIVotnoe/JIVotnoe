
import { Language } from '../types';

export const APP_VERSION = "1.8.0";

export const DEFAULT_BRIDGE_URL = "https://silent-base-fce1.newjiv.workers.dev";

export const AVAILABLE_LANGUAGES: {code: Language, label: string}[] = [
  {code: 'ru', label: '🇷🇺 Русский'}, 
  {code: 'en', label: '🇺🇸 English'}, 
  {code: 'uk', label: '🇺🇦 Українська'},
  {code: 'be', label: '🇧🇾 Беларуская'},
  {code: 'kk', label: '🇰🇿 Қазақша'},
  {code: 'uz', label: '🇺🇿 Oʻzbekcha'},
  {code: 'az', label: '🇦🇿 Azərbaycan'},
  {code: 'ky', label: '🇰🇬 Кыргызча'},
  {code: 'tg', label: '🇹🇯 Тоҷикӣ'},
  {code: 'hy', label: '🇦🇲 Հայերեն'},
  {code: 'tk', label: '🇹🇲 Türkmençe'},
  {code: 'zh', label: '🇨🇳 中文'},
  {code: 'tr', label: '🇹🇷 Türkçe'},
  {code: 'fa', label: '🇮🇷 فارسی'},
  {code: 'ar', label: '🇸🇦 العربية'},
  {code: 'es', label: '🇪🇸 Español'},
  {code: 'pt', label: '🇵🇹 Português'},
  {code: 'id', label: '🇮🇩 Indonesia'},
  {code: 'de', label: '🇩🇪 Deutsch'},
  {code: 'fr', label: '🇫🇷 Français'}
];

export const WORKER_CODE_TEMPLATE = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Securely inject API Key on the server side
    url.searchParams.set("key", env.API_KEY);
    
    const targetUrl = "https://generativelanguage.googleapis.com" + url.pathname + url.search;
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return fetch(newRequest);
  },
};`;
