import React, { useEffect, useState, useCallback } from 'react';
import { Power, Radio, ShieldCheck, AlertCircle, Monitor, ArrowDown, FileTerminal } from 'lucide-react';
import { useLanguage } from '../features/localization/LanguageContext';

declare const chrome: any;

export const ExtensionProxyToggle: React.FC = () => {
  const { t } = useLanguage();
  const [isExtension, setIsExtension] = useState(false);
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkProxyStatus = useCallback(() => {
    if (typeof chrome === 'undefined' || !chrome.proxy || !chrome.proxy.settings) return;

    chrome.proxy.settings.get({}, (details: any) => {
      if (chrome.runtime.lastError) {
        return;
      }
      if (details.levelOfControl === 'controlled_by_other_extensions') {
        setError(t('proxy_controlled_error'));
        setProxyEnabled(false);
      } else if (details.value.mode === 'fixed_servers') {
        setProxyEnabled(true);
        setError(null);
      } else {
        setProxyEnabled(false);
        setError(null);
      }
    });
  }, [t]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.proxy && chrome.proxy.settings) {
      setIsExtension(true);
      checkProxyStatus();
    }
  }, [checkProxyStatus]);

  const toggleProxy = () => {
    if (!isExtension) return;

    if (proxyEnabled) {
      const config = { mode: "system" };
      chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
        checkProxyStatus();
      });
    } else {
      const config = {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "socks5",
            host: "127.0.0.1",
            port: 1080
          },
          bypassList: ["<local>", "localhost", "127.0.0.1", "ozon.ru", "wb.ru", "gosuslugi.ru", "sberbank.ru", "vk.com"]
        }
      };
      chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
        checkProxyStatus();
      });
    }
  };

  if (!isExtension) return null;

  return (
    <div className={`mb-6 p-4 rounded-xl border transition-all ${
      proxyEnabled 
        ? 'bg-green-900/30 border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
        : 'bg-gray-800/50 border-gray-700'
    }`}>
      
      {/* Visual Guide: Only show when disabled to teach the user */}
      {!proxyEnabled && !error && (
        <div className="mb-5 bg-black/20 p-3 rounded-lg border border-gray-700/50">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-cyber-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-black/50">1</div>
             <div className="flex-1">
                <span className="text-xs font-bold text-gray-300 block">{t('proxy_step_1')}</span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <FileTerminal size={10} /> run.cmd
                </span>
             </div>
             <Monitor size={16} className="text-blue-400 opacity-80" />
           </div>
           
           <div className="flex justify-center -my-2 relative z-10">
             <ArrowDown size={14} className="text-gray-600" />
           </div>

           <div className="flex items-center gap-3 mt-2">
             <div className="bg-cyber-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg shadow-black/50">2</div>
             <div className="flex-1">
                <span className="text-xs font-bold text-gray-300 block">{t('proxy_step_2')}</span>
             </div>
             <Power size={16} className="text-green-400 opacity-80" />
           </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {proxyEnabled ? (
            <div className="relative">
               <ShieldCheck className="text-green-400" size={28} />
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>
          ) : (
             <Radio className="text-gray-500" size={28} />
          )}
          <div>
            <h3 className={`font-bold leading-none mb-1 ${proxyEnabled ? 'text-white text-lg' : 'text-gray-300 text-base'}`}>
              {proxyEnabled ? t('proxy_on') : t('proxy_off')}
            </h3>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
              {proxyEnabled ? '127.0.0.1:1080' : 'System Default'}
            </p>
          </div>
        </div>
        
        <button
          onClick={toggleProxy}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-xl border-2 ${
            proxyEnabled 
              ? 'bg-green-600 border-green-400 hover:bg-green-500 text-white shadow-green-500/30' 
              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-400 hover:text-white'
          }`}
          title={proxyEnabled ? t('proxy_off') : t('proxy_on')}
        >
          <Power size={26} className={`transition-transform duration-300 ${proxyEnabled ? 'scale-110' : 'group-hover:scale-105'}`} />
        </button>
      </div>

      {proxyEnabled && (
        <div className="mt-4 pt-3 border-t border-green-500/20 text-xs text-green-200/80 text-center animate-in slide-in-from-top-2">
           {t('proxy_run_cmd_hint')}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-200 mt-4 bg-red-900/40 p-3 rounded-lg border border-red-500/30 flex items-start gap-2">
           <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
           <span>{error}</span>
        </div>
      )}
    </div>
  );
};