
import React, { useState, useEffect } from 'react';
import { Activity, Smartphone, HelpCircle, Bot, Monitor, ListFilter, Globe, Terminal, Share2, TerminalSquare, Sparkles, X } from 'lucide-react';
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
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&bgcolor=1e293b&color=10b981`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cyber-800 border-2 border-cyber-accent/30 p-8 rounded-[2rem] max-w-sm w-full relative shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-accent to-transparent"></div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 z-10">
          <X size={24} />
        </button>
        <div className="text-center relative">
          <div className="flex justify-center mb-4"><Activity className="text-cyber-accent" size={32} /></div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{t('app_title')}</h3>
          <p className="text-cyber-400 font-mono text-xs mb-8 uppercase tracking-widest">{t('subtitle')}</p>
          <div className="bg-white p-5 rounded-[1.5rem] inline-block shadow-2xl"><img src={qrUrl} alt="QR Code" className="w-56 h-56" /></div>
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
  
  const [activeTab, setActiveTab] = useState<'ai' | 'android' | 'windows' | 'linux' | 'ios' | 'whitelist' | 'vpn' | 'faq'>(() => {
    if (isExtensionEnv()) return 'windows';
    return 'ai';
  });
  
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);

  useEffect(() => {
    setIsExtension(isExtensionEnv());
  }, []);

  const handleShare = () => setShowQr(true);

  const renderTabButton = (id: typeof activeTab, label: string, icon: React.ReactNode, colorClass: string) => {
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap text-sm flex-shrink-0 ${
          activeTab === id
            ? `${colorClass} text-white shadow-lg scale-105 z-10`
            : 'bg-cyber-800 text-gray-400 hover:bg-cyber-700'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  const availableLanguages: {code: Language, label: string}[] = [
    {code: 'ru', label: '🇷🇺 RU'}, {code: 'en', label: '🇺🇸 EN'}, {code: 'uk', label: '🇺🇦 UA'}
  ];

  return (
    <div className={`min-h-screen bg-cyber-900 text-slate-200 ${isExtension ? 'pb-4' : 'pb-24'}`}>
      <QrModal isOpen={showQr} onClose={() => setShowQr(false)} />
      <header className="bg-cyber-800 border-b border-cyber-700 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
        <div className={`mx-auto px-4 flex items-center justify-between py-3 ${isExtension ? '' : 'max-w-4xl'}`}>
          <div className="flex items-center gap-3">
            <Activity className="text-cyber-accent" size={22} />
            <h1 className="text-lg font-bold text-white tracking-tight">{t('app_title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-cyber-700 text-gray-200 text-xs font-bold py-1.5 px-2 rounded-lg border border-cyber-600 focus:outline-none"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <button onClick={handleShare} className="text-gray-400 hover:text-white bg-cyber-700 p-1.5 rounded-lg border border-cyber-600">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 ${isExtension ? 'py-4' : 'py-6 max-w-4xl'}`}>
        {!isTelegram && <ExtensionProxyToggle />}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar-in-extension">
          {renderTabButton('ai', t('tab_ai'), <Sparkles size={18} />, 'bg-gradient-to-r from-indigo-600 to-fuchsia-600')}
          {renderTabButton('android', t('tab_android'), <Bot size={18} />, 'bg-cyber-500')}
          {renderTabButton('windows', t('tab_windows'), <Monitor size={18} />, 'bg-blue-600')}
          {renderTabButton('linux', t('tab_linux'), <TerminalSquare size={18} />, 'bg-teal-600')}
          {renderTabButton('vpn', t('tab_vpn'), <Globe size={18} />, 'bg-indigo-600')}
          {renderTabButton('ios', t('tab_ios'), <Smartphone size={18} />, 'bg-purple-600')}
          {renderTabButton('whitelist', t('tab_whitelist'), <ListFilter size={18} />, 'bg-emerald-600')}
          {renderTabButton('faq', t('tab_faq'), <HelpCircle size={18} />, 'bg-orange-600')}
        </div>
        <div className="animate-in fade-in duration-300">
          {activeTab === 'ai' && <AiAnalyst />}
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
          {activeTab === 'faq' && <FAQ />}
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
