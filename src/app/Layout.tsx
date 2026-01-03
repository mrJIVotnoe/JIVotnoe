import React, { ReactNode } from 'react';
import { Activity, Star, Share2, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTelegram } from '../shared/hooks/useTelegram';
import { Navigation } from '../shared/ui/Navigation';
import { ExtensionProxyToggle } from '../components/ExtensionProxyToggle';

export function Layout({ children }: { children: ReactNode }) {
  const { t, language, setLanguage } = useLanguage();
  const { isTelegram, webApp } = useTelegram();

  const availableLanguages = [
    {code: 'ru', label: '🇷🇺 RU'}, 
    {code: 'en', label: '🇺🇸 EN'}, 
    {code: 'uk', label: '🇺🇦 UA'},
    {code: 'be', label: '🇧🇾 BE'},
    {code: 'kk', label: '🇰🇿 KK'},
    {code: 'uz', label: '🇺🇿 UZ'},
    {code: 'az', label: '🇦🇿 AZ'},
    {code: 'ky', label: '🇰🇬 KY'},
    {code: 'tg', label: '🇹🇯 TG'},
    {code: 'hy', label: '🇦🇲 HY'},
    {code: 'tk', label: '🇹🇲 TK'},
    {code: 'zh', label: '🇨🇳 ZH'},
    {code: 'tr', label: '🇹🇷 TR'},
    {code: 'fa', label: '🇮🇷 FA'},
    {code: 'ar', label: '🇸🇦 AR'},
    {code: 'es', label: '🇪🇸 ES'},
    {code: 'pt', label: '🇵🇹 PT'},
    {code: 'id', label: '🇮🇩 ID'},
    {code: 'de', label: '🇩🇪 DE'},
    {code: 'fr', label: '🇫🇷 FR'}
  ] as const;

  const handleShare = () => {
    if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred('light');
    // Implement QR modal logic or native share here if needed
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-200 pb-24 font-sans selection:bg-cyber-accent selection:text-cyber-900">
      <header className="bg-cyber-900/80 border-b border-cyber-700 sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto px-6 flex items-center justify-between py-5 max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-default">
              <Activity className="text-cyber-accent animate-pulse" size={26} />
              <div className="absolute inset-0 blur-md bg-cyber-accent/30 animate-pulse group-hover:bg-cyber-accent/50 transition-all"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter leading-none flex items-center gap-2">
                {t('app_title')}
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
              </h1>
              <p className="text-[10px] font-bold text-cyber-500 uppercase tracking-[0.2em] mt-1">{t('subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-cyber-accent transition-colors" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-cyber-800 text-gray-200 text-[10px] font-black py-2.5 pl-9 pr-8 rounded-xl border border-cyber-700 focus:outline-none focus:border-cyber-500 uppercase tracking-widest cursor-pointer appearance-none hover:bg-cyber-700 transition-colors w-full min-w-[100px]"
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                {/* Custom arrow for better styling */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
            </div>
            {!isTelegram && (
                <button onClick={handleShare} className="text-gray-400 hover:text-white bg-cyber-800 p-2.5 rounded-xl border border-cyber-700 transition-all active:scale-90 shadow-lg group">
                <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-8 max-w-4xl">
        {!isTelegram && <ExtensionProxyToggle />}
        
        <Navigation />

        {children}
      </main>

      <footer className="mt-12 py-12 border-t border-cyber-800 flex flex-col items-center text-center">
         <div className="flex items-center gap-3 mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-cyber-accent animate-bounce [animation-delay:0.4s]"></div>
         </div>
         <p className="font-mono text-[9px] text-gray-600 max-w-sm leading-relaxed uppercase tracking-[0.2em]">{t('research_footer')}</p>
      </footer>
    </div>
  );
}