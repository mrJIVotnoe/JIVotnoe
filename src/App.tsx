
import React, { useState, useEffect } from 'react';
import { Activity, Smartphone, HelpCircle, Bot, Monitor, ListFilter, Globe, Share2, TerminalSquare, Sparkles, X, Music, Star } from 'lucide-react';
import { StrategySelector } from './components/StrategySelector';
import { DnsConfig } from './components/DnsConfig';
import { FAQ } from './components/FAQ';
import { IosGuide } from './components/IosGuide';
import { WindowsGuide } from './components/WindowsGuide';
import { LinuxGuide } from './components/LinuxGuide';
import { Whitelist } from './components/Whitelist';
import { VpnRegionGuide } from './components/VpnRegionGuide';
import { ExtensionProxyToggle } from './components/ExtensionProxyToggle';
import { AndroidTvGuide } from './components/AndroidTvGuide';
import { AndroidGuide } from './components/AndroidGuide';
import { AiAnalyst } from './components/AiAnalyst';
import { StrategyType, Language } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { TelegramProvider, useTelegram } from './TelegramContext';

declare const chrome: any;

const isExtensionEnv = () => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.getManifest;
};

const QrModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&bgcolor=1e293b&color=10b981`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cyber-800 border-2 border-cyber-accent/30 p-8 rounded-[2.5rem] max-w-sm w-full relative shadow-[0_0_60px_rgba(16,185,129,0.2)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-accent to-transparent"></div>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 z-10">
          <X size={24} />
        </button>
        <div className="text-center relative">
          <div className="flex justify-center mb-6"><Activity className="text-cyber-accent" size={40} /></div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{t('app_title')}</h3>
          <p className="text-cyber-400 font-mono text-[10px] mb-10 uppercase tracking-[0.2em]">{t('subtitle')}</p>
          <div className="bg-white p-6 rounded-[2rem] inline-block shadow-2xl transition-transform hover:scale-[1.02] duration-300">
            <img src={qrUrl} alt="QR Code" className="w-52 h-52" />
          </div>
          <p className="mt-8 text-xs text-gray-500 font-mono uppercase tracking-widest">{t('share_cta')}</p>
        </div>
      </div>
    </div>
  );
};

const MainApp = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isTelegram, webApp } = useTelegram();
  const [isExtension, setIsExtension] = useState(isExtensionEnv);
  const [showQr, setShowQr] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'ai' | 'android' | 'windows' | 'linux' | 'ios' | 'whitelist' | 'vpn' | 'faq'>(() => {
    if (isExtensionEnv()) return 'windows';
    return 'ai';
  });
  
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);

  useEffect(() => {
    setIsExtension(isExtensionEnv());
  }, []);

  const handleShare = () => {
    if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred('light');
    setShowQr(true);
  };

  const renderTabButton = (id: typeof activeTab, label: string, icon: React.ReactNode, colorClass: string) => {
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred('soft');
        }}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all whitespace-nowrap text-xs flex-shrink-0 uppercase tracking-tight ${
          activeTab === id
            ? `${colorClass} text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] scale-[1.05] z-10 ring-2 ring-white/20`
            : 'bg-cyber-800 text-gray-500 hover:bg-cyber-700 hover:text-gray-300 border border-cyber-700'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  const availableLanguages: {code: Language, label: string}[] = [
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

  return (
    <div className={`min-h-screen bg-cyber-900 text-slate-200 ${isExtension ? 'pb-4' : 'pb-24'}`}>
      <QrModal isOpen={showQr} onClose={() => setShowQr(false)} />
      
      <header className="bg-cyber-800/80 border-b border-cyber-700 sticky top-0 z-20 backdrop-blur-xl">
        <div className={`mx-auto px-6 flex items-center justify-between py-5 ${isExtension ? '' : 'max-w-4xl'}`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Activity className="text-cyber-accent animate-pulse" size={26} />
              <div className="absolute inset-0 blur-md bg-cyber-accent/30 animate-pulse"></div>
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
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-cyber-700 text-gray-200 text-[10px] font-black py-2.5 px-3 rounded-xl border border-cyber-600 focus:outline-none uppercase tracking-widest shadow-inner cursor-pointer"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <button onClick={handleShare} className="text-gray-400 hover:text-white bg-cyber-700 p-2.5 rounded-xl border border-cyber-600 transition-all active:scale-90 shadow-lg shadow-black/20 group">
              <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 ${isExtension ? 'py-4' : 'py-8 max-w-4xl'}`}>
        {!isTelegram && <ExtensionProxyToggle />}
        
        {activeTab === 'ai' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500 rounded-r-2xl animate-in fade-in slide-in-from-left-4 duration-1000">
            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-1">
              <Music size={20} className="text-indigo-400" />
              {t('maestro_welcome')}
            </h2>
            <p className="text-xs text-gray-500 font-medium">{t('ai_desc')}</p>
          </div>
        )}

        <div className="flex gap-3 mb-10 overflow-x-auto py-2 no-scrollbar-in-extension scroll-smooth">
          {renderTabButton('ai', t('tab_ai'), <Sparkles size={18} />, 'bg-gradient-to-r from-indigo-600 to-fuchsia-600')}
          {renderTabButton('android', t('tab_android'), <Bot size={18} />, 'bg-blue-600')}
          {renderTabButton('windows', t('tab_windows'), <Monitor size={18} />, 'bg-slate-700')}
          {renderTabButton('linux', t('tab_linux'), <TerminalSquare size={18} />, 'bg-teal-700')}
          {renderTabButton('vpn', t('tab_vpn'), <Globe size={18} />, 'bg-indigo-700')}
          {renderTabButton('ios', t('tab_ios'), <Smartphone size={18} />, 'bg-purple-700')}
          {renderTabButton('whitelist', t('tab_whitelist'), <ListFilter size={18} />, 'bg-emerald-700')}
          {renderTabButton('faq', t('tab_faq'), <HelpCircle size={18} />, 'bg-orange-700')}
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          {activeTab === 'ai' && <AiAnalyst />}
          {activeTab === 'android' && (
            <div className="space-y-12">
              <AndroidGuide />
              <div className="bg-cyber-800 p-8 rounded-[3rem] border border-cyber-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Music size={24} className="text-blue-400" />
                  <h4 className="text-white font-black text-sm uppercase tracking-widest">{t('select_strategy')}</h4>
                </div>
                <StrategySelector selectedId={selectedStrategy} onSelect={setSelectedStrategy} />
              </div>
              <DnsConfig />
              <AndroidTvGuide />
            </div>
          )}
          {activeTab === 'windows' && <WindowsGuide />}
          {activeTab === 'linux' && <LinuxGuide />}
          {activeTab === 'vpn' && <VpnRegionGuide />}
          {activeTab === 'ios' && <IosGuide />}
          {activeTab === 'whitelist' && <Whitelist />}
          {activeTab === 'faq' && <FAQ />}
        </div>

        <footer className="mt-24 pb-12 pt-12 border-t border-cyber-700/50 flex flex-col items-center text-center">
           <div className="flex items-center gap-3 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-cyber-accent animate-bounce [animation-delay:0.4s]"></div>
           </div>
           <p className="font-mono text-[9px] text-gray-500 max-w-sm leading-relaxed uppercase tracking-[0.2em]">{t('research_footer')}</p>
        </footer>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <TelegramProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </TelegramProvider>
  );
}
