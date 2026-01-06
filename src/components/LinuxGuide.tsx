import React, { useState } from 'react';
import { Zap, ShieldAlert, Monitor, TerminalSquare, Settings, Server, Cpu, FileCode, ArrowRight, Globe, RefreshCw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { StrategySelector } from './StrategySelector';
import { StrategyType } from '../types';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';
import { SniScanner } from './SniScanner';

export const LinuxGuide: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);
  const [activeSubTab, setActiveSubTab] = useState<'desktop' | 'server' | 'systemd'>('desktop');
  const [customSni, setCustomSni] = useState<string>('');
  
  const currentStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];
  const effectiveSni = customSni || t('local_sni_example');
  
  // Replace SNI and remove -d1 (daemon mode) for manual Linux running if needed, 
  // though ciadpi usually runs in foreground by default unless daemonized.
  // We use effectiveSni to generate the correct command.
  const strategyArgs = currentStrategy.command
    .replace('{{SNI}}', effectiveSni)
    .replace(/-n [^\s]+/, `-n ${effectiveSni}`) // Double safety for direct replacements
    .replace(/-d1\s?/, '');

  const port = "1080"; 

  const magicCommand = `./ciadpi-x86_64 -i 127.0.0.1 -p ${port} ${strategyArgs}`;
  
  const systemdUnit = `[Unit]
Description=ByeDPI Proxy Service
After=network.target

[Service]
Type=simple
# Change /path/to/ your actual directory
WorkingDirectory=/home/${language === 'ru' ? 'пользователь' : 'user'}/byedpi
ExecStart=/home/${language === 'ru' ? 'пользователь' : 'user'}/byedpi/ciadpi-x86_64 -i 127.0.0.1 -p ${port} ${strategyArgs}
Restart=on-failure

[Install]
WantedBy=multi-user.target`;

  const envExport = `export all_proxy=socks5h://127.0.0.1:${port}
export http_proxy=http://127.0.0.1:${port}
export https_proxy=http://127.0.0.1:${port}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-teal-900/40 to-cyber-800 p-6 rounded-[2rem] border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <TerminalSquare size={80} />
        </div>
        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
          <TerminalSquare className="text-teal-400" size={24} />
          {t('linux_title')}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{t('linux_desc')}</p>
      </div>

      <section className="bg-cyber-800 p-2 rounded-3xl border border-cyber-700 flex gap-1">
        <button 
          onClick={() => setActiveSubTab('desktop')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeSubTab === 'desktop' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Monitor size={14} /> {t('linux_mode_desktop')}
        </button>
        <button 
          onClick={() => setActiveSubTab('server')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeSubTab === 'server' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Server size={14} /> {t('linux_mode_server')}
        </button>
        <button 
          onClick={() => setActiveSubTab('systemd')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeSubTab === 'systemd' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Settings size={14} /> {t('linux_systemd')}
        </button>
      </section>

      <div className="bg-cyber-800 p-8 rounded-[3rem] border border-cyber-700 shadow-2xl">
         <div className="flex items-center gap-3 mb-8">
            <Zap size={20} className="text-teal-400" />
            <h4 className="text-white font-black text-sm uppercase tracking-widest">{t('select_strategy')}</h4>
         </div>
         
         <div className="mb-6">
           <SniScanner onSelect={setCustomSni} />
         </div>

         <StrategySelector 
            selectedId={selectedStrategyId} 
            onSelect={setSelectedStrategyId} 
            showCommandPreview={false} 
            customSni={customSni}
         />
      </div>

      <div className="space-y-6">
        {activeSubTab === 'desktop' && (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-left-4">
            <div className="bg-cyber-800 p-8 rounded-[3rem] border border-cyber-700 shadow-xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-teal-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">1</div>
                  <h3 className="font-black text-white text-lg uppercase tracking-tight">Бинарный запуск</h3>
               </div>
               
               <div className="bg-black/60 rounded-2xl border border-teal-500/30 p-5 relative group mb-6">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em]">Terminal</span>
                     <CopyButton text={`chmod +x ciadpi-x86_64 && ${magicCommand}`} />
                  </div>
                  <code className="block text-xs font-mono text-teal-300 break-all leading-relaxed">
                     chmod +x ciadpi-x86_64 && {magicCommand}
                  </code>
               </div>

               <div className="flex items-start gap-4 p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-2xl">
                  <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
                  <p className="text-[11px] text-yellow-200/70 leading-relaxed italic">{t('linux_security_warn')}</p>
               </div>
            </div>

            <div className="bg-cyber-800 p-8 rounded-[3rem] border border-cyber-700 shadow-xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">2</div>
                  <h3 className="font-black text-white text-lg uppercase tracking-tight">{t('linux_proxy_settings')}</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-5 rounded-2xl border border-cyber-700 flex flex-col items-center text-center">
                     <Globe size={24} className="text-blue-400 mb-3" />
                     <div className="text-[10px] text-gray-500 uppercase font-black mb-1">SOCKS5 Host</div>
                     <div className="text-sm font-mono text-white">127.0.0.1</div>
                  </div>
                  <div className="bg-black/30 p-5 rounded-2xl border border-cyber-700 flex flex-col items-center text-center">
                     <RefreshCw size={24} className="text-teal-400 mb-3" />
                     <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Port</div>
                     <div className="text-sm font-mono text-white">{port}</div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeSubTab === 'server' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="bg-cyber-800 p-8 rounded-[3rem] border border-cyber-700 shadow-xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-indigo-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"><Cpu size={20}/></div>
                  <h3 className="font-black text-white text-lg uppercase tracking-tight">{t('linux_env_vars')}</h3>
               </div>
               <p className="text-xs text-gray-400 mb-6 leading-relaxed">Для проксирования команд в терминале (curl, wget, apt) используйте временные переменные:</p>
               <div className="bg-black/60 rounded-2xl border border-indigo-500/30 p-5 relative group">
                  <div className="absolute top-2 right-2"><CopyButton text={envExport} /></div>
                  <pre className="text-xs font-mono text-indigo-300 leading-relaxed overflow-x-auto">
                    {envExport}
                  </pre>
               </div>
             </div>
          </div>
        )}

        {activeSubTab === 'systemd' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
             <div className="bg-cyber-800 p-8 rounded-[3rem] border border-cyber-700 shadow-xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-fuchsia-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"><FileCode size={20}/></div>
                  <h3 className="font-black text-white text-lg uppercase tracking-tight">{t('linux_service_config')}</h3>
               </div>
               <p className="text-xs text-gray-400 mb-6 leading-relaxed">Создайте файл <code className="text-fuchsia-400">/etc/systemd/system/byedpi.service</code>:</p>
               <div className="bg-black/60 rounded-2xl border border-fuchsia-500/30 p-5 relative group mb-6">
                  <div className="absolute top-2 right-2"><CopyButton text={systemdUnit} /></div>
                  <pre className="text-[10px] font-mono text-fuchsia-300 leading-relaxed overflow-x-auto">
                    {systemdUnit}
                  </pre>
               </div>
               <div className="p-4 bg-cyber-900/50 rounded-2xl border border-cyber-700">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-widest">{t('linux_commands')}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-300 bg-black/20 p-2 rounded-lg">
                      <span>sudo systemctl enable --now byedpi</span>
                      <CopyButton text="sudo systemctl enable --now byedpi" className="p-1 h-6 w-6" />
                    </div>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="bg-teal-500/5 border border-teal-500/20 p-6 rounded-3xl flex gap-4">
        <ArrowRight className="text-teal-400 shrink-0" size={20} />
        <p className="text-[11px] text-gray-400 leading-relaxed italic">
          {t('linux_distro_tip')}
        </p>
      </div>
    </div>
  );
};