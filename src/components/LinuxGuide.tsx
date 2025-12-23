
import React, { useState } from 'react';
import { Terminal, Zap, ShieldAlert, Info, Monitor, Chrome, AlertCircle, TerminalSquare, RefreshCw, Lock, Globe, ListChecks, Play } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { StrategySelector } from './StrategySelector';
import { StrategyType } from '../types';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';

export const LinuxGuide: React.FC = () => {
  const { t } = useLanguage();
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);
  
  const currentStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];
  const localizedSni = t('local_sni_example');
  
  const strategyArgs = currentStrategy.command
    .replace(/-n [^\s]+/, `-n ${localizedSni}`)
    .replace(/-d1\s?/, '');

  const port = "1081";

  // The most stable one-liner we developed
  const magicCommand = `sudo pkill -f ciadpi; sleep 1; FILE=$(ls ciadpi* | head -n 1); chmod +x "$FILE"; echo "🚀 ENGINE STARTING (PORT ${port})..."; sudo ./"$FILE" -i 127.0.0.1 -p ${port} -D 8.8.8.8 ${strategyArgs}`;

  const resetCommand = "sudo pkill -f ciadpi; gsettings set org.gnome.system.proxy mode 'none'";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-gradient-to-r from-teal-900/40 to-cyber-800 p-6 rounded-2xl border border-teal-500/30">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <TerminalSquare className="text-teal-400" />
          {t('linux_title')}
        </h3>
        <p className="text-gray-300 text-sm">{t('linux_desc')}</p>
      </div>

      <section>
        <StrategySelector selectedId={selectedStrategyId} onSelect={setSelectedStrategyId} showCommandPreview={false} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Play size={80} className="text-teal-400" />
           </div>
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white">1</div>
              <h3 className="font-bold text-white">{t('linux_step_1')}</h3>
           </div>
           <p className="text-xs text-gray-400 mb-4">{t('linux_step_1_desc')}</p>
           
           <div className="bg-black/95 rounded-xl border border-teal-500/40 p-4 mb-2">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest">Терминал (Engine)</span>
                 <CopyButton text={magicCommand} className="h-7 w-7" />
              </div>
              <code className="block text-[10px] font-mono text-teal-300 break-all leading-relaxed">
                 {magicCommand}
              </code>
           </div>
        </div>

        {/* Step 2 */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Chrome size={80} className="text-blue-400" />
           </div>
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white">2</div>
              <h3 className="font-bold text-white">{t('linux_step_2')}</h3>
           </div>
           <p className="text-xs text-gray-400 mb-4">{t('linux_step_2_desc')}</p>
           
           <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-center">
              <Monitor className="mx-auto text-blue-400 mb-2" size={32} />
              <span className="text-[10px] text-blue-200 uppercase font-bold">Proxy: SOCKS5 127.0.0.1:{port}</span>
           </div>
        </div>
      </div>

      {/* Rescue Kit */}
      <section className="bg-black/20 p-6 rounded-2xl border border-red-500/20">
        <h4 className="text-sm font-bold text-red-300 mb-4 flex items-center gap-2">
          <RefreshCw size={18} />
          {t('linux_restore_hint')}
        </h4>
        <p className="text-[10px] text-gray-500 mb-3">{t('linux_fail_safe_cmd')}</p>
        <div className="bg-cyber-900/50 p-3 rounded-lg border border-red-900/30 flex items-center justify-between">
           <code className="text-[10px] text-red-400 font-mono">{resetCommand}</code>
           <CopyButton text={resetCommand} className="h-6 w-6 p-1 bg-red-900/30" />
        </div>
      </section>

    </div>
  );
};
