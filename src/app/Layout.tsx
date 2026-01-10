import React, { ReactNode, PropsWithChildren, useEffect, useState } from 'react';
import { Activity, Star, Share2, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTelegram } from '../shared/hooks/useTelegram';
import { Navigation } from '../shared/ui/Navigation';
import { ExtensionProxyToggle } from '../components/ExtensionProxyToggle';
import { PrivacyModal } from '../components/PrivacyModal';
import { AVAILABLE_LANGUAGES } from '../config/constants';

export function Layout({ children }: PropsWithChildren<{}>) {
  const { t, language, setLanguage } = useLanguage();
  const { isTelegram, webApp } = useTelegram();
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Remove loader once layout mounts
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 500);
    }
  }, []);

  // Deep Linking: Scroll to section if hash is present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay to ensure content is rendered/suspended
    }
  }, []);

  const handleShare = () => {
    if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred('light');
    if (navigator.share) {
      navigator.share({
        title: t('app_title'),
        text: t('subtitle'),
        url: window.location.href
      }).catch(console.error);
    } else {
      console.log("Share API not supported");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-200 pb-24 font-sans selection:bg-cyber-accent selection:text-cyber-900">
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      
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
                  {AVAILABLE_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
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
         <p className="font-mono text-[9px] text-gray-600 max-w-sm leading-relaxed uppercase tracking-[0.2em] mb-4">{t('research_footer')}</p>
         
         <button 
           onClick={() => setShowPrivacy(true)}
           className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
         >
           <Shield size={10} />
           {t('privacy_link')}
         </button>
      </footer>
    </div>
  );
}
