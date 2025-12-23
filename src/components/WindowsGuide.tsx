import React, { useState } from 'react';
import { StrategySelector } from './StrategySelector';
import { StrategyType } from '../types';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';
import { Download, Command, AlertTriangle, Zap, RotateCcw, Cpu } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const WindowsGuide: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);
  
  const currentStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];
  const localizedSni = t('local_sni_example');
  
  // Localized command string
  const localizedCommand = currentStrategy.command.replace(/-n [^\s]+/, `-n ${localizedSni}`);

  const isRu = language === 'ru';
  
  const batchFileContent = `@echo off
chcp 65001 >nul
title ByeDPI Mate - ${currentStrategy.name[language] || currentStrategy.name['en']}
cd /d "%~dp0"

echo =======================================================
echo  [1] ${isRu ? 'Включение системного прокси...' : 'Enabling system proxy...'}
echo =======================================================
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f >nul
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d "socks=127.0.0.1:1080" /f >nul

echo.
echo =======================================================
echo  [2] ${isRu ? 'Запуск ByeDPI' : 'Starting ByeDPI'}
echo =======================================================
echo.
echo  KEEP THIS WINDOW OPEN WHILE USING INTERNET.
echo.

ciadpi.exe --ip 127.0.0.1 --port 1080 ${localizedCommand}

echo.
echo =======================================================
echo  [3] ${isRu ? 'Отключение прокси...' : 'Disabling proxy...'}
echo =======================================================
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul
pause`;

  const cleanFileContent = `@echo off
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f
echo Proxy disabled.
pause`;

  return (
    <div className="space-y-8">
      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg flex gap-3">
        <AlertTriangle className="text-yellow-500 shrink-0" />
        <div>
          <h4 className="font-bold text-yellow-200">{t('win_how_it_works')}</h4>
          <p className="text-yellow-200/70 text-sm mt-1">
             {t('win_how_it_works_desc')}
          </p>
        </div>
      </div>

      <section className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-cyber-700 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0">1</div>
           <h3 className="text-xl font-bold text-white">{t('win_step_1')}</h3>
        </div>
        <div className="ml-0 md:ml-14">
          <a 
            href="https://github.com/hufrea/byedpi/releases" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cyber-500 hover:bg-cyber-400 text-white px-5 py-2.5 rounded-lg font-bold transition-colors w-full md:w-auto justify-center shadow-lg shadow-cyber-500/20"
          >
            <Download size={20} />
            {t('start_btn')}
          </a>
        </div>
      </section>

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

      <section className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-cyber-700 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0">3</div>
           <h3 className="text-xl font-bold text-white">{t('win_step_3')}</h3>
        </div>
        
        <div className="ml-0 md:ml-14 space-y-6">
          <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
             <p className="text-green-100 text-sm">
               <span className="font-bold">✨ {t('win_auto_title')}</span>
             </p>
          </div>

          <div className="bg-black/80 rounded-lg border border-cyber-700 overflow-hidden relative group shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-cyber-900 border-b border-cyber-700">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                <Command size={14} />
                run.cmd
              </div>
              <CopyButton text={batchFileContent} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-green-400 max-h-[300px] overflow-y-auto custom-scrollbar">
              {batchFileContent}
            </pre>
          </div>

           <div className="mt-6 pt-6 border-t border-cyber-700/50">
             <h4 className="font-bold text-gray-200 text-sm mb-2 flex items-center gap-2">
               <RotateCcw size={16} className="text-red-400" />
               {t('win_emergency')}
             </h4>
             <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-900 px-2 py-1 rounded text-red-300 font-mono border border-gray-700 truncate flex-1">
                     {cleanFileContent}
                  </code>
                  <CopyButton text={cleanFileContent} className="h-8 w-8 p-1.5" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};