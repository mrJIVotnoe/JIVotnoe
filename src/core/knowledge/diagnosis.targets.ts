
export interface DiagnosticTarget {
  id: string;
  name: string;
  url: string; // Must be HTTPS to verify TLS handshake
  category: 'SOCIAL' | 'VIDEO' | 'MESSAGING' | 'AI' | 'GAMING' | 'SEARCH';
}

export const DIAGNOSTIC_TARGETS: DiagnosticTarget[] = [
  { id: 'yt', name: 'YouTube', url: 'https://www.youtube.com', category: 'VIDEO' },
  { id: 'googlevideo', name: 'G-Video (CDN)', url: 'https://rr1---sn-gvnuxaxjvh-n8vz.googlevideo.com', category: 'VIDEO' }, // Sample CDN
  { id: 'insta', name: 'Instagram', url: 'https://www.instagram.com', category: 'SOCIAL' },
  { id: 'meta', name: 'Facebook/Meta', url: 'https://www.facebook.com', category: 'SOCIAL' },
  { id: 'tg_web', name: 'Telegram Web', url: 'https://web.telegram.org', category: 'MESSAGING' },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://web.whatsapp.com', category: 'MESSAGING' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com', category: 'MESSAGING' },
  { id: 'openai', name: 'ChatGPT', url: 'https://chatgpt.com', category: 'AI' },
  { id: 'gemini', name: 'Google Gemini', url: 'https://aistudio.google.com', category: 'AI' },
  { id: 'roblox', name: 'Roblox', url: 'https://www.roblox.com', category: 'GAMING' },
  { id: 'steam', name: 'Steam Community', url: 'https://steamcommunity.com', category: 'GAMING' },
  { id: 'google', name: 'Google Search', url: 'https://www.google.com', category: 'SEARCH' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com', category: 'SEARCH' }
];
