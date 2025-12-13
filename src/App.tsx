import React, { useState, useEffect } from 'react';
import { Activity, Smartphone, HelpCircle, Bot, Monitor, ListFilter, Globe, ExternalLink, Terminal, Share2 } from 'lucide-react';
import { StrategySelector } from './components/StrategySelector';
import { DnsConfig } from './components/DnsConfig';
import { TelegramFix } from './components/TelegramFix';
import { IosGuide } from './components/IosGuide';
import { WindowsGuide } from './components/WindowsGuide';
import { Whitelist } from './components/Whitelist';
import { VpnRegionGuide } from './components/VpnRegionGuide';
import { ExtensionProxyToggle } from './components/ExtensionProxyToggle';
import { AndroidTvGuide } from './components/AndroidTvGuide';
import { AndroidGuide } from './components/AndroidGuide';
import { StrategyType, Language } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { TelegramProvider, useTelegram } from './TelegramContext';

// Declare chrome to satisfy TS compiler checks in this file
declare const chrome: any;

const isExtensionEnv = () => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.getManifest;
};

// Main Content Component separated to use Context
const MainApp = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isTelegram, webApp, platform } = useTelegram();
  
  // Initialize state directly from environment check to avoid UI flash
  const [isExtension, setIsExtension] = useState(isExtensionEnv);
  
  // Smart Tab Logic: Auto-detect device
  const [activeTab, setActiveTab] = useState<'android' | 'windows' | 'ios' | 'whitelist' | 'vpn' | 'faq'>(() => {
    if (isExtensionEnv()) return 'windows';
    
    // Telegram Platform Detection
    if (platform === 'ios') return 'ios';
    if (['tdesktop', 'macos', 'windows', 'webk', 'weba'].includes(platform)) return 'windows';
    
    return 'android'; // Default for Android and unknown
  });
  
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);

  // Re-check extension env on mount
  useEffect(() => {
    const ext = isExtensionEnv();
    setIsExtension(ext);
  }, []);

  // Telegram BackButton Logic
  useEffect(() => {
    if (!isTelegram || !webApp) return;

    // Define the "Home" tab based on platform
    const homeTab = platform === 'ios' ? 'ios' : (['tdesktop', 'macos', 'windows'].includes(platform) ? 'windows' : 'android');

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

    return () => {
      webApp.BackButton.offClick(handleBack);
    };
  }, [activeTab, isTelegram, webApp, platform]);

  // Handle Share Action
  const handleShare = () => {
    if (webApp && webApp.openTelegramLink) {
      const appUrl = "https://t.me/byedpi_mate_bot/app";
      const text = encodeURIComponent("ByeDPI Mate: Настройка обхода блокировок в 2 клика. 🛡");
      const url = `https://t.me/share/url?url=${appUrl}&text=${text}`;
      webApp.openTelegramLink(url);
    }
  };

  const renderTabButton = (id: typeof activeTab, label: string, icon: React.ReactNode, colorClass: string) => {
    // Hide mobile tabs in Extension, hide Desktop tabs in Mobile if needed (optional, keeping all for now)
    if (isExtension && (id === 'android' || id === 'ios')) return null;

    return (
      <button
        onClick={() => {
          setActiveTab(id);
          if (isTelegram && webApp) {
             webApp.HapticFeedback.impactOccurred('light');
          }
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

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const availableLanguages: {code: Language, label: string}[] = [
    {code: 'ru', label: '🇷🇺'},
    {code: 'uk', label: '🇺🇦'},
    {code: 'en', label: '🇺🇸'},
    {code: 'de', label: '🇩🇪'},
    {code: 'fr', label: '🇫🇷'},
    {code: 'es', label: '🇪🇸'},
  ];

  return (
    <div className={`min-h-screen bg-cyber-900 text-slate-200 ${isExtension ? 'pb-4' : 'pb-24'}`}>
      {/* Header */}
      <header className="bg-cyber-800 border-b border-cyber-700 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
        <div className={`mx-auto px-4 flex items-center justify-between ${isExtension ? 'py-3' : 'py-3 max-w-4xl'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-cyber-accent/10 p-2 rounded-lg">
              <Activity className="text-cyber-accent" size={isExtension ? 20 : 22} />
            </div>
            <div>
              <h1 className={`${isExtension ? 'text-lg' : 'text-lg'} font-bold text-white tracking-tight leading-tight`}>
                {t('app_title')} {isExtension && <span className="text-cyber-accent text-[10px] uppercase border border-cyber-accent/30 px-1 rounded ml-1 align-middle">Ext</span>}
              </h1>
              {!isExtension && <p className="text-[10px] text-cyber-400 font-mono tracking-wider opacity-80">{t('subtitle')}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
                <select 
                  value={language} 
                  onChange={handleLangChange}
                  className="appearance-none bg-cyber-700 hover:bg-cyber-600 text-gray-200 text-xs font-bold py-1.5 pl-3 pr-7 rounded-lg border border-cyber-600 focus:outline-none focus:border-cyber-accent transition-colors cursor-pointer uppercase"
                >
                  {availableLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
             </div>

            {isExtension ? (
              <a href="https://byedpi-mate.vercel.app" target="_blank" rel="noreferrer" title={t('open_web')} className="text-gray-400 hover:text-white transition-colors p-1.5">
                <ExternalLink size={18} />
              </a>
            ) : isTelegram ? (
              <button onClick={handleShare} className="text-gray-400 hover:text-white transition-colors bg-cyber-700 p-1.5 rounded-lg border border-cyber-600 active:scale-95">
                <Share2 size={18} />
              </button>
            ) : (
              <div className="hidden sm:block">
                  <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-900/50 text-xs font-bold animate-pulse">
                    SHUTDOWN
                  </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 ${isExtension ? 'py-4' : 'py-6 max-w-4xl'}`}>
        
        {!isTelegram && <ExtensionProxyToggle />}

        {/* Intro Card - Hide in Telegram to save space */}
        {!isExtension && !isTelegram && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-cyber-800 to-cyber-900 p-6 rounded-2xl border border-cyber-700">
              <h2 className="text-2xl font-bold text-white mb-2">{t('intro_title')}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t('intro_text')}
              </p>
            </div>
          </section>
        )}
        
        {/* Telegram Greeting with Device Info */}
        {isTelegram && activeTab !== 'faq' && activeTab !== 'whitelist' && (
           <div className="mb-6 bg-cyber-800/50 p-4 rounded-xl border border-cyber-700/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <Bot className="text-cyber-accent shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-2">
                   Mini App Mode 
                   <span className="px-1.5 py-0.5 rounded bg-cyber-700 text-[10px] text-gray-300 uppercase">{platform}</span>
                </p>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                   {t('intro_text')}
                </p>
              </div>
           </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 custom-scrollbar no-scrollbar-in-extension">
          {renderTabButton('android', t('tab_android'), <Bot size={18} />, 'bg-cyber-500')}
          {renderTabButton('windows', isExtension ? t('tab_pc_settings') : t('tab_windows'), <Monitor size={18} />, 'bg-blue-600')}
          {renderTabButton('vpn', t('tab_vpn'), <Globe size={18} />, 'bg-indigo-600')}
          {renderTabButton('ios', t('tab_ios'), <Smartphone size={18} />, 'bg-purple-600')}
          {renderTabButton('whitelist', t('tab_whitelist'), <ListFilter size={18} />, 'bg-emerald-600')}
          {renderTabButton('faq', t('tab_faq'), <HelpCircle size={18} />, 'bg-orange-600')}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'android' && (
            <div className="space-y-8">
              <AndroidGuide />

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-cyber-700 text-white text-xs font-bold px-2 py-1 rounded">{t('step_2')}</span>
                  <h3 className="text-xl font-bold text-white">{t('select_strategy')}</h3>
                </div>
                <StrategySelector selectedId={selectedStrategy} onSelect={setSelectedStrategy} />
              </section>

              <section>
                 <div className="flex items-center gap-2 mb-4">
                  <span className="bg-cyber-700 text-white text-xs font-bold px-2 py-1 rounded">{t('step_3')}</span>
                  <h3 className="text-xl font-bold text-white">{t('dns_config')}</h3>
                </div>
                <DnsConfig />
              </section>

              <AndroidTvGuide />
            </div>
          )}

          {activeTab === 'windows' && <WindowsGuide />}
          
          {activeTab === 'vpn' && <VpnRegionGuide />}

          {activeTab === 'ios' && <IosGuide />}

          {activeTab === 'whitelist' && <Whitelist />}

          {activeTab === 'faq' && <TelegramFix />}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-cyber-700/50 flex flex-col items-center text-center opacity-60 hover:opacity-100 transition-opacity">
           <Terminal size={16} className="text-cyber-500 mb-2" />
           <p className="font-mono text-[10px] text-cyber-400 whitespace-pre-wrap leading-relaxed">
             {t('research_footer')}
           </p>
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