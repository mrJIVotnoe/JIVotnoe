import React, { useState, useEffect } from 'react';
import { Activity, Smartphone, HelpCircle, Bot, Monitor, ListFilter, Globe, ExternalLink, Terminal, Share2, TerminalSquare, QrCode, X, Download } from 'lucide-react';
import { StrategySelector } from './components/StrategySelector';
import { DnsConfig } from './components/DnsConfig';
import { TelegramFix } from './components/TelegramFix';
import { IosGuide } from './components/IosGuide';
import { WindowsGuide } from './components/WindowsGuide';
import { LinuxGuide } from './components/LinuxGuide';
import { Whitelist } from './components/Whitelist';
import { VpnRegionGuide } from './components/VpnRegionGuide';
import { ExtensionProxyToggle } from './components/ExtensionProxyToggle';
import { AndroidTvGuide } from './components/AndroidTvGuide';
import { AndroidGuide } from './components/AndroidGuide';
import { StrategyType, Language } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { TelegramProvider, useTelegram } from './TelegramContext';

declare const chrome: any;

const isExtensionEnv = () => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.getManifest;
};

const QrModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  const isChinese = language === 'zh';
  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&bgcolor=1e293b&color=10b981`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cyber-800 border-2 border-cyber-accent/30 p-8 rounded-[2rem] max-w-sm w-full relative shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden">
        {/* Poster Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-accent to-transparent"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 z-10">
          <X size={24} />
        </button>

        <div className="text-center relative">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-cyber-accent/10 rounded-2xl border border-cyber-accent/20">
               {isChinese ? <Globe className="text-cyber-accent" size={32} /> : <Activity className="text-cyber-accent" size={32} />}
             </div>
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
            {t('app_title')}
          </h3>
          <p className="text-cyber-400 font-mono text-xs mb-8 uppercase tracking-widest">
            {t('subtitle')}
          </p>

          <div className="bg-white p-5 rounded-[1.5rem] inline-block shadow-2xl relative">
             <img src={qrUrl} alt="QR Code" className="w-56 h-56" />
             {/* Tiny center icon mimicry */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-lg">
                <div className="bg-cyber-900 p-1 rounded-md">
                   <div className="w-6 h-6 bg-cyber-accent rounded-sm flex items-center justify-center text-[10px] text-cyber-900 font-bold">A</div>
                </div>
             </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="px-4 py-2 bg-black/40 rounded-xl border border-cyber-700">
               <p className="text-[10px] text-gray-500 font-mono break-all opacity-60">{currentUrl}</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
               <p className="text-sm text-white font-bold animate-pulse">
                  {t('qr_hint')}
               </p>
               <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                  {t('qr_long_press')}
               </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-cyber-700/50">
             <p className="text-[9px] text-gray-600 font-mono leading-tight">
               GLOBAL ACADEMIC NETWORK NEUTRALITY INITIATIVE<br/>
               VERIFICATION_CODE: {Math.random().toString(36).substring(7).toUpperCase()}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isTelegram, webApp, platform } = useTelegram();
  const [isExtension, setIsExtension] = useState(isExtensionEnv);
  const [showQr, setShowQr] = useState(false);
  
  const isChinese = language === 'zh';
  
  const [activeTab, setActiveTab] = useState<'android' | 'windows' | 'linux' | 'ios' | 'whitelist' | 'vpn' | 'faq'>(() => {
    if (isExtensionEnv()) return 'windows';
    if (platform === 'ios') return 'ios';
    if (['tdesktop', 'macos', 'windows', 'webk', 'weba'].includes(platform)) return 'windows';
    if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('linux')) return 'linux';
    return 'android';
  });
  
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);

  useEffect(() => {
    const ext = isExtensionEnv();
    setIsExtension(ext);
  }, []);

  useEffect(() => {
    if (!isTelegram || !webApp) return;
    let homeTab: typeof activeTab = 'android';
    if (platform === 'ios') homeTab = 'ios';
    else if (['tdesktop', 'macos', 'windows'].includes(platform)) homeTab = 'windows';

    const handleBack = () => {
      setActiveTab(homeTab);
      webApp.HapticFeedback.impactOccurred('light');
    };

    if (activeTab !== homeTab) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(handleBack);
    } else {
      webApp.BackButton.hide();
    }
    return () => webApp.BackButton.offClick(handleBack);
  }, [activeTab, isTelegram, webApp, platform]);

  const handleShare = () => {
    if (isChinese) {
      setShowQr(true);
    } else if (webApp?.openTelegramLink) {
      const appUrl = "https://t.me/byedpi_mate_bot/app";
      const text = encodeURIComponent("ByeDPI Mate: Global Network Neutrality Tool. 🛡");
      const url = `https://t.me/share/url?url=${appUrl}&text=${text}`;
      webApp.openTelegramLink(url);
    } else {
      setShowQr(true);
    }
  };

  const renderTabButton = (id: typeof activeTab, label: string, icon: React.ReactNode, colorClass: string) => {
    if (isExtension && (id === 'android' || id === 'ios')) return null;
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          if (isTelegram && webApp) webApp.HapticFeedback.impactOccurred('light');
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap text-sm flex-shrink-0 ${
          activeTab === id
            ? `${colorClass} text-white shadow-lg shadow-black/20`
            : 'bg-cyber-800 text-gray-400 hover:bg-cyber-700'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  const availableLanguages: {code: Language, label: string}[] = [
    {code: 'ru', label: '🇷🇺 RU'}, {code: 'en', label: '🇺🇸 EN'}, {code: 'uk', label: '🇺🇦 UA'},
    {code: 'zh', label: '🇨🇳 ZH'}, {code: 'tr', label: '🇹🇷 TR'}, {code: 'kk', label: '🇰🇿 KZ'},
    {code: 'uz', label: '🇺🇿 UZ'}, {code: 'pt', label: '🇧🇷 PT'}, {code: 'id', label: '🇮🇩 ID'}
  ];

  return (
    <div className={`min-h-screen bg-cyber-900 text-slate-200 ${isExtension ? 'pb-4' : 'pb-24'}`}>
      <QrModal isOpen={showQr} onClose={() => setShowQr(false)} />
      <header className="bg-cyber-800 border-b border-cyber-700 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
        <div className={`mx-auto px-4 flex items-center justify-between ${isExtension ? 'py-3' : 'py-3 max-w-4xl'}`}>
          <div className="flex items-center gap-3">
            {isChinese ? <Globe className="text-cyber-accent" size={22} /> : <Activity className="text-cyber-accent" size={22} />}
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{t('app_title')}</h1>
              {!isExtension && <p className="text-[10px] text-cyber-400 font-mono opacity-80">{t('subtitle')}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-cyber-700 text-gray-200 text-xs font-bold py-1.5 px-2 rounded-lg border border-cyber-600 focus:outline-none max-w-[80px]"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <button onClick={handleShare} className="text-gray-400 hover:text-white bg-cyber-700 p-1.5 rounded-lg border border-cyber-600">
              {isChinese ? <QrCode size={18} /> : <Share2 size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 ${isExtension ? 'py-4' : 'py-6 max-w-4xl'}`}>
        {!isTelegram && <ExtensionProxyToggle />}
        {!isExtension && !isTelegram && (
          <section className="mb-8 bg-gradient-to-r from-cyber-800 to-cyber-900 p-6 rounded-2xl border border-cyber-700">
            <h2 className="text-2xl font-bold text-white mb-2">{t('intro_title')}</h2>
            <p className="text-gray-400 leading-relaxed text-sm">{t('intro_text')}</p>
          </section>
        )}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar-in-extension">
          {renderTabButton('android', t('tab_android'), <Bot size={18} />, 'bg-cyber-500')}
          {renderTabButton('windows', isExtension ? t('tab_pc_settings') : t('tab_windows'), <Monitor size={18} />, 'bg-blue-600')}
          {renderTabButton('linux', t('tab_linux'), <TerminalSquare size={18} />, 'bg-teal-600')}
          {renderTabButton('vpn', t('tab_vpn'), <Globe size={18} />, 'bg-indigo-600')}
          {renderTabButton('ios', t('tab_ios'), <Smartphone size={18} />, 'bg-purple-600')}
          {renderTabButton('whitelist', t('tab_whitelist'), <ListFilter size={18} />, 'bg-emerald-600')}
          {renderTabButton('faq', t('tab_faq'), <HelpCircle size={18} />, 'bg-orange-600')}
        </div>
        <div className="animate-in fade-in duration-300">
          {activeTab === 'android' && (
            <div className="space-y-8">
              <AndroidGuide />
              <StrategySelector selectedId={selectedStrategy} onSelect={setSelectedStrategy} />
              <DnsConfig />
              <AndroidTvGuide />
            </div>
          )}
          {activeTab === 'windows' && <WindowsGuide />}
          {activeTab === 'linux' && <LinuxGuide />}
          {activeTab === 'vpn' && <VpnRegionGuide />}
          {activeTab === 'ios' && <IosGuide />}
          {activeTab === 'whitelist' && <Whitelist />}
          {activeTab === 'faq' && <TelegramFix />}
        </div>
        <div className="mt-12 pt-6 border-t border-cyber-700/50 flex flex-col items-center text-center opacity-60">
           <Terminal size={16} className="text-cyber-500 mb-2" />
           <p className="font-mono text-[10px] text-cyber-400">{t('research_footer')}</p>
        </div>
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