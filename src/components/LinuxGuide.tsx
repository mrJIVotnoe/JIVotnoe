
import React, { useState } from 'react';
import { Terminal, Zap, ShieldAlert, Monitor, TerminalSquare, Play, RefreshCw, Globe, ArrowRight } from 'lucide-react';
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

  const magicCommand = `sudo chmod +x ciadpi-x86_64; sudo ./ciadpi-x86_64 -i 127.0.0.1 -p ${port} -D 8.8.8.8 ${strategyArgs}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-teal-900/40 to-cyber-800 p-6 rounded-2xl border border-teal-500/30">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <TerminalSquare className="text-teal-400" />
          {t('tab_linux')}
        </h3>
        <p className="text-gray-300 text-sm">Linux требует чуть больше внимания, но взамен дает полную свободу от блокировок.</p>
      </div>

      <section>
        <StrategySelector selectedId={selectedStrategyId} onSelect={setSelectedStrategyId} showCommandPreview={false} />
      </section>

      <div className="space-y-4">
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="bg-teal-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">1</div>
              <div>
                <h3 className="font-bold text-white">Права и запуск</h3>
                <p className="text-xs text-gray-500">Сделайте файл исполняемым и запустите его.</p>
              </div>
           </div>
           
           <div className="bg-black/95 rounded-xl border border-teal-500/40 p-4 relative group">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Команда в терминал</span>
                 <CopyButton text={magicCommand} />
              </div>
              <code className="block text-xs font-mono text-teal-300 break-all leading-relaxed">
                 {magicCommand}
              </code>
           </div>
        </div>

        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">2</div>
              <div>
                <h3 className="font-bold text-white">Системный прокси</h3>
                <p className="text-xs text-gray-500">Настройки -> Сеть -> Прокси.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-xl border border-cyber-700">
                 <div className="text-[10px] text-gray-500 uppercase mb-2">Type</div>
                 <div className="text-sm font-bold text-white">SOCKS Host</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-cyber-700">
                 <div className="text-[10px] text-gray-500 uppercase mb-2">Address / Port</div>
                 <div className="text-sm font-bold text-white">127.0.0.1 : {port}</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
