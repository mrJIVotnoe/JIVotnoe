
import React from 'react';
import { Smartphone, ShieldAlert, Key, CheckCircle, Apple, ExternalLink, Zap } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { useLanguage } from '../LanguageContext';

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
            <h4 className="font-bold text-white text-xl">ByeDPI на iPhone невозможен</h4>
            <p className="text-red-200/60 text-sm">Apple запрещает приложениям напрямую менять пакеты.</p>
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
              <h3 className="font-bold text-white text-lg">Приложение V2Box</h3>
              <p className="text-xs text-gray-400">Лучший бесплатный клиент в AppStore.</p>
           </div>
           <a href="https://apps.apple.com/app/v2box/id6446814690" target="_blank" className="bg-blue-600/10 p-3 rounded-xl hover:bg-blue-600/20 transition-colors">
              <ExternalLink size={20} className="text-blue-400" />
           </a>
        </div>

        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-5 mb-4">
              <div className="bg-purple-600 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shrink-0">2</div>
              <div className="flex-1">
                 <h3 className="font-bold text-white text-lg">Импорт ключа</h3>
                 <p className="text-xs text-gray-400">Нажмите '+' -> 'Import from Clipboard'.</p>
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

      <div className="bg-indigo-900/10 p-5 rounded-2xl border border-indigo-500/20 flex gap-4">
         <Zap className="text-indigo-400 shrink-0" size={20} />
         <p className="text-xs text-gray-400">
           <b>Важно:</b> Ключи Reality живут долго, но иногда требуют обновления. Если интернет пропал — найдите новый ключ в сообществе или у проверенного провайдера.
         </p>
      </div>
    </div>
  );
};
