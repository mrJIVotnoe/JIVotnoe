import React, { useState } from 'react';
import { Terminal, Download, Settings, Package, FileCode, CheckCircle, Monitor, Code } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { StrategySelector } from './StrategySelector';
import { StrategyType } from '../types';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';

export const LinuxGuide: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);
  
  const currentStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];

  const desktopFileContent = `[Desktop Entry]
Name=ByeDPI Mate
Comment=Bypass DPI Proxy
Exec=gnome-terminal -- bash -c "./ciadpi --ip 127.0.0.1 --port 1080 ${currentStrategy.command}; exec bash"
Icon=utilities-terminal
Terminal=false
Type=Application
Categories=Network;Proxy;`;

  const launchCommand = `./ciadpi --ip 127.0.0.1 --port 1080 ${currentStrategy.command}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Step 1: Download Binary */}
      <section className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-blue-600 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">1</div>
           <h3 className="text-xl font-bold text-white">{t('linux_step_1_title')}</h3>
        </div>
        <div className="ml-0 md:ml-14">
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {t('linux_download_desc')} {language === 'ru' ? 'Выберите версию amd64 для Intel/AMD процессоров.' : 'Choose amd64 version for Intel/AMD CPUs.'}
          </p>
          
          <div className="bg-black/30 p-4 rounded-lg mb-6 border border-cyber-700">
             <h4 className="font-bold text-white mb-3 flex items-center gap-2">
               <Package size={16} className="text-cyber-accent"/>
               {t('win_which_file')}
             </h4>
             <div className="p-3 bg-gray-800/50 rounded border border-green-900/50 flex justify-between items-center group">
               <div>
                  <div className="font-mono text-green-400 text-sm font-bold mb-1">...linux-amd64.tar.gz</div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Recommended for Mint</p>
               </div>
               <a href="https://github.com/hufrea/byedpi/releases" target="_blank" rel="noreferrer" className="bg-cyber-700 p-2 rounded hover:bg-cyber-500 transition-colors">
                  <Download size={18} className="text-white"/>
               </a>
             </div>
          </div>

          <div className="p-4 bg-cyber-900/50 rounded-lg border border-dashed border-cyber-600">
             <h5 className="text-xs font-bold text-gray-300 mb-2 uppercase flex items-center gap-2">
                <Code size={14} className="text-blue-400"/>
                Permissions (Terminal)
             </h5>
             <div className="flex items-center justify-between bg-black/50 p-3 rounded font-mono text-sm text-blue-300">
                <code>chmod +x ciadpi</code>
                <CopyButton text="chmod +x ciadpi" className="p-1 h-7 w-7" />
             </div>
          </div>
        </div>
      </section>

      {/* Step 2: Strategy */}
      <section>
         <div className="flex items-center gap-3 mb-4">
           <div className="bg-cyber-700 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0">2</div>
           <h3 className="text-xl font-bold text-white">{t('win_step_2')}</h3>
        </div>
        <StrategySelector 
          selectedId={selectedStrategyId} 
          onSelect={setSelectedStrategyId} 
          showCommandPreview={false} 
        />
      </section>

      {/* Step 3: Command Launch */}
      <section className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-purple-600 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">3</div>
           <h3 className="text-xl font-bold text-white">{t('linux_step_2_title')}</h3>
        </div>
        
        <div className="ml-0 md:ml-14 space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('linux_step_2_desc')} {language === 'ru' ? 'Просто вставьте эту команду в терминал в папке с программой.' : 'Just paste this command into terminal in the program folder.'}
          </p>
          
          <div className="bg-black/80 rounded-lg border border-cyber-700 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-cyber-900 border-b border-cyber-700">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                <Terminal size={14} />
                Terminal Bash
              </div>
              <CopyButton text={launchCommand} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-green-400 leading-relaxed whitespace-pre-wrap">
              {launchCommand}
            </pre>
          </div>
        </div>
      </section>

      {/* Step 4: System Proxy Config */}
      <section className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-cyber-700 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0">4</div>
           <h3 className="text-xl font-bold text-white">{t('linux_step_3_title')}</h3>
        </div>
        
        <div className="ml-0 md:ml-14 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-4 bg-black/20 rounded-lg border border-cyber-700">
              <h5 className="font-bold text-gray-200 mb-2 flex items-center gap-2 text-sm">
                 <Settings size={16} className="text-blue-400"/>
                 {language === 'ru' ? 'Системные настройки Mint' : 'Mint System Settings'}
              </h5>
              <p className="text-xs text-gray-400 mb-3">
                 {t('linux_step_3_desc')}
              </p>
              <div className="bg-black/40 p-2 rounded border border-cyber-600 text-[10px] font-mono text-green-400 flex justify-between items-center">
                 <span>SOCKS Host: 127.0.0.1 : 1080</span>
                 <CheckCircle size={12} className="text-green-500"/>
              </div>
           </div>

           <div className="p-4 bg-black/20 rounded-lg border border-cyber-700">
              <h5 className="font-bold text-gray-200 mb-2 flex items-center gap-2 text-sm">
                 <Monitor size={16} className="text-purple-400"/>
                 {t('linux_desktop_file')}
              </h5>
              <p className="text-xs text-gray-400 mb-3">
                 {t('linux_desktop_desc')}
              </p>
              <div className="flex justify-between items-center bg-cyber-900 p-2 rounded">
                 <span className="text-[10px] font-mono text-gray-500">byedpi.desktop</span>
                 <CopyButton text={desktopFileContent} className="h-6 w-6 p-1 bg-cyber-800" />
              </div>
           </div>
        </div>
      </section>

      <div className="flex justify-center pt-2">
         <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-400 rounded-full border border-green-900/50 text-xs font-bold animate-pulse">
            <Terminal size={14} />
            Root Privileges Not Required
         </div>
      </div>
    </div>
  );
};