import React, { useState } from 'react';
import { Radar, Play } from 'lucide-react';
import { SNI_DOMAINS } from '../../../data/regions'; // Using region data for scanning list
import { useLanguage } from '../../localization/LanguageContext';

export const SniScanner = ({ onSelect }: { onSelect?: (domain: string) => void }) => {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Record<string, 'ok' | 'fail' | 'pending'>>({});

  const checkDomain = async (domain: string) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    try {
        await fetch(`https://${domain}`, { mode: 'no-cors', signal: controller.signal });
        clearTimeout(id);
        return true;
    } catch (e) {
        clearTimeout(id);
        return false;
    }
  };

  const startScan = async () => {
    setScanning(true);
    setResults({});
    
    // Process in chunks to avoid browser limits
    for (const item of SNI_DOMAINS) {
        setResults(prev => ({ ...prev, [item.domain]: 'pending' }));
        const isReachable = await checkDomain(item.domain);
        setResults(prev => ({ 
            ...prev, 
            [item.domain]: isReachable ? 'ok' : 'fail' 
        }));
        await new Promise(r => setTimeout(r, 100));
    }
    setScanning(false);
  };

  return (
    <div className="bg-cyber-900/50 rounded-2xl border border-cyber-700 p-5 mt-4 overflow-hidden relative">
       {/* Header */}
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${scanning ? 'bg-cyber-accent/20 animate-pulse' : 'bg-cyber-800'}`}>
                <Radar size={20} className={scanning ? 'text-cyber-accent animate-spin' : 'text-gray-400'} />
             </div>
             <div>
                <h4 className="font-bold text-gray-200 text-sm">{t('scanner_title')}</h4>
                <p className="text-[10px] text-gray-500">{t('scanner_desc')}</p>
             </div>
          </div>
          <button 
             onClick={startScan} 
             disabled={scanning}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 scanning 
                 ? 'bg-cyber-800 text-gray-500 cursor-not-allowed' 
                 : 'bg-cyber-700 hover:bg-cyber-accent hover:text-cyber-900 text-white'
             }`}
          >
             {scanning ? t('scanner_checking') : t('scanner_btn')}
          </button>
       </div>

       {/* Results Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
          {SNI_DOMAINS.map((item) => {
             const status = results[item.domain];
             return (
                <div key={item.domain} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                    status === 'ok' ? 'bg-green-900/20 border-green-500/30' :
                    status === 'fail' ? 'bg-red-900/10 border-red-500/20 opacity-50' :
                    status === 'pending' ? 'bg-cyber-800 border-cyber-600 animate-pulse' :
                    'bg-cyber-800/50 border-cyber-700/50'
                }`}>
                   <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-mono truncate ${status === 'ok' ? 'text-green-300' : 'text-gray-400'}`}>
                         {item.domain}
                      </span>
                      {status && (
                          <span className={`text-[9px] font-black uppercase ${
                              status === 'ok' ? 'text-green-500' : 'text-red-500'
                          }`}>
                             {status === 'ok' ? t('scanner_reachable') : status === 'fail' ? t('scanner_unreachable') : '...'}
                          </span>
                      )}
                   </div>
                   
                   {status === 'ok' && onSelect && (
                      <button 
                        onClick={() => onSelect(item.domain)}
                        className="p-1.5 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-md transition-colors"
                        title={t('scanner_use_btn')}
                      >
                         <Play size={12} fill="currentColor" />
                      </button>
                   )}
                </div>
             );
          })}
       </div>
    </div>
  );
};