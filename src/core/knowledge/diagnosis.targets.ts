
export interface DiagnosticTarget {
  id: string;
  name: string;
  url: string; // Must be HTTPS to verify TLS handshake
  category: 'SOCIAL' | 'VIDEO' | 'MESSAGING' | 'AI' | 'GAMING' | 'SEARCH' | 'INFRASTRUCTURE';
}

export const DIAGNOSTIC_TARGETS: DiagnosticTarget[] = [
  // User Apps
  { id: 'yt', name: 'YouTube', url: 'https://www.youtube.com', category: 'VIDEO' },
  { id: 'googlevideo', name: 'G-Video (CDN)', url: 'https://rr1---sn-gvnuxaxjvh-n8vz.googlevideo.com', category: 'VIDEO' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com', category: 'MESSAGING' },
  { id: 'tg_web', name: 'Telegram Web', url: 'https://web.telegram.org', category: 'MESSAGING' },
  { id: 'openai', name: 'ChatGPT', url: 'https://chatgpt.com', category: 'AI' },
  { id: 'gemini', name: 'Google Gemini', url: 'https://aistudio.google.com', category: 'AI' },
  { id: 'insta', name: 'Instagram', url: 'https://www.instagram.com', category: 'SOCIAL' },
  
  // Infrastructure Heuristics (SNI Candidates)
  { id: 'sni_ozon', name: 'Ozon (SNI)', url: 'https://www.ozon.ru', category: 'INFRASTRUCTURE' },
  { id: 'sni_vk', name: 'VK (SNI)', url: 'https://vk.com', category: 'INFRASTRUCTURE' },
  { id: 'sni_google', name: 'Google (SNI)', url: 'https://www.google.com', category: 'INFRASTRUCTURE' },
  { id: 'sni_cloudflare', name: 'Cloudflare', url: 'https://www.cloudflare.com', category: 'INFRASTRUCTURE' }
];
