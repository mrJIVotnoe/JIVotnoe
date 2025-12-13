import React from 'react';
import { Smartphone, ShieldAlert, Key, ChevronRight } from 'lucide-react';
import { CopyButton } from './CopyButton';

export const IosGuide: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Friendly Warning Card */}
      <div className="bg-gradient-to-br from-red-900/40 to-black/40 border border-red-500/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="bg-red-500/10 p-3 rounded-full shrink-0">
          <ShieldAlert className="text-red-400" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-red-100 text-lg">Почему всё не так просто?</h4>
          <p className="text-red-200/60 text-sm mt-1 leading-relaxed">
             Apple запрещает приложениям напрямую менять сетевые пакеты. 
             ByeDPI на iPhone невозможен технически. 
             <span className="block mt-2 text-white font-bold">Решение: Подключение к серверу (VLESS/V2Ray).</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        
        {/* Step 1: Apps */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">1</div>
              <h3 className="text-xl font-bold text-white">Выберите приложение</h3>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690" target="_blank" rel="noreferrer" 
                 className="flex flex-col p-4 bg-cyber-900/50 border border-cyber-600/50 rounded-xl hover:bg-cyber-700 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white text-lg group-hover:text-green-400 transition-colors">V2Box</span>
                    <span className="text-[10px] bg-green-900/40 text-green-300 px-2 py-0.5 rounded border border-green-800">FREE</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">
                    Идеально для старта. Простой, красивый, бесплатный.
                  </p>
              </a>

              <div className="flex flex-col p-4 bg-cyber-900/50 border border-cyber-600/50 rounded-xl opacity-80">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-300">Shadowrocket</span>
                    <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded border border-blue-800">PAID</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">
                    Профессиональный комбайн. Стоит денег (~$3).
                  </p>
              </div>
           </div>
        </div>

        {/* Step 2: The Key */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">2</div>
              <h3 className="text-xl font-bold text-white">Найдите ключ доступа</h3>
           </div>
           
           <p className="text-sm text-gray-400 mb-4">
             Приложение — это просто плеер. Ему нужна "кассета" (сервер). Вам нужен ключ, который выглядит так:
           </p>

           <div className="bg-black/30 p-4 rounded-xl border border-dashed border-gray-600 flex gap-3 items-center mb-4">
              <Key className="text-yellow-500 shrink-0" size={20} />
              <code className="text-xs font-mono text-green-400 break-all opacity-80">
                vless://uuid@ip:443?security=reality&sni=google.com...
              </code>
           </div>

           <div className="text-xs text-gray-500 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ChevronRight size={12} />
                <span>Попросите у друга, у которого есть свой сервер.</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={12} />
                <span>Купите у надежного VPN-провайдера (ищите протокол VLESS/V2Ray).</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={12} />
                <span>Создайте свой (AmneziaVPN / 3X-UI).</span>
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

      </div>
    </div>
  );
};