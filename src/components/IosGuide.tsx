import React from 'react';
import { Smartphone, ShieldAlert, Key, CheckCircle, Apple, ExternalLink, Zap, ChevronRight } from 'lucide-react';
import { CopyButton } from '../shared/ui/CopyButton';
import { useLanguage } from '../features/localization/LanguageContext';

export const IosGuide: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-red-900/40 to-black/40 border border-red-500/30 p-6 rounded-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-red-500/20 p-3 rounded-2xl">
            <ShieldAlert className="text-red-400" size={32} />
          </div>
          <div>
            <h4 className="font-bold text-white text-xl">{t('ios_title')}</h4>
            <p className="text-red-200/60 text-sm">{t('ios_subtitle')}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Но есть выход. Мы рекомендуем использовать современный протокол <b>VLESS (Reality)</b>, который обходит любые блокировки без замедления.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl flex items-center gap-5">
           <div className="bg-blue-600 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shrink-0">1</div>
           <div className="flex-1">
              <h3 className="font-bold text-white text-lg">{t('ios_step_1')}</h3>
              <p className="text-xs text-gray-400">{t('ios_step_1_desc')}</p>
           </div>
           <a href="https://apps.apple.com/app/v2box/id6446814690" target="_blank" className="bg-blue-600/10 p-3 rounded-xl hover:bg-blue-600/20 transition-colors">
              <ExternalLink size={20} className="text-blue-400" />
           </a>
        </div>

        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-5 mb-4">
              <div className="bg-purple-600 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shrink-0">2</div>
              <div className="flex-1">
                 <h3 className="font-bold text-white text-lg">{t('ios_step_2')}</h3>
                 <p className="text-xs text-gray-400">{t('ios_step_2_desc')}</p>
              </div>
           </div>
           <div className="bg-black/30 p-4 rounded-xl border border-dashed border-gray-600 flex gap-3 items-center">
              <Key className="text-yellow-500 shrink-0" size={20} />
              <code className="text-[10px] font-mono text-green-400 break-all opacity-80 leading-tight">
                vless://78f4078a-c632@95.216.14.33:443?security=reality&sni=google.com&fp=chrome&type=grpc&serviceName=grpc#Freedom
              </code>
              <CopyButton text="vless://78f4078a-c632@95.216.14.33:443?security=reality&sni=google.com&fp=chrome&type=grpc&serviceName=grpc#Freedom" />
           </div>
        </div>
      </div>

      {/* Step 3: Whitelist */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyber-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white">3</div>
              <h3 className="text-xl font-bold text-white">Ускорение (Routing)</h3>
           </div>
           
           <p className="text-sm text-gray-400 mb-4">
             Чтобы российские приложения (Банки, Госуслуги, Ozon) работали быстро и без сбоев, их нужно пустить <b>мимо</b> прокси.
           </p>

           <div className="bg-black/40 p-4 rounded-xl border border-cyber-700 flex items-center justify-between group">
              <div className="text-sm font-mono text-gray-300 truncate mr-4">
                ozon.ru, wb.ru, vk.com, gosuslugi.ru, sberbank.ru
              </div>
              <CopyButton text="ozon.ru,wb.ru,vk.com,gosuslugi.ru,sberbank.ru" className="bg-cyber-700 group-hover:bg-green-600 transition-colors" />
           </div>

           <div className="mt-4 p-3 bg-cyber-900/50 rounded-lg text-xs text-gray-400 border border-cyber-700/50">
             <span className="font-bold text-gray-300">Инструкция для V2Box:</span>
             <ol className="list-decimal list-inside mt-1 space-y-1 ml-1">
               <li>Settings &rarr; Routing &rarr; Add Rule</li>
               <li>Type: <b>Domain Keyword</b></li>
               <li>Action: <b>Direct</b></li>
               <li>Вставьте скопированный список</li>
             </ol>
           </div>
        </div>

      <div className="bg-indigo-900/10 p-5 rounded-2xl border border-indigo-500/20 flex gap-4">
         <Zap className="text-indigo-400 shrink-0" size={20} />
         <p className="text-xs text-gray-400">
           <b>Важно:</b> Ключи Reality живут долго, но иногда требуют обновления. Если интернет пропал — найдите новый ключ в сообществе или у проверенного провайдера.
         </p>
      </div>
    </div>
  );
};