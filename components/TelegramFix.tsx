import React from 'react';
import { Phone, CheckSquare, Settings } from 'lucide-react';

export const TelegramFix: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           <Phone className="text-cyber-accent" />
           Проблема: WhatsApp работает, Telegram нет?
         </h3>
         <p className="text-gray-300 mb-6">
           Если текст отправляется, но звонки срываются и фото не грузятся, проблема в протоколах UDP и MTProto. 
           ByeByeDPI лучше работает с TCP. Нужно "принудить" Telegram работать через локальный туннель.
         </p>

         <div className="space-y-4">
           <div className="flex items-start gap-4">
             <div className="bg-cyber-700 p-2 rounded-full text-white font-bold h-8 w-8 flex items-center justify-center shrink-0">1</div>
             <div>
               <h4 className="font-bold text-white">Откройте настройки Telegram</h4>
               <p className="text-sm text-gray-400">Настройки {'>'} Данные и память {'>'} Настройки прокси</p>
             </div>
           </div>

           <div className="flex items-start gap-4">
             <div className="bg-cyber-700 p-2 rounded-full text-white font-bold h-8 w-8 flex items-center justify-center shrink-0">2</div>
             <div>
               <h4 className="font-bold text-white">Добавьте SOCKS5 прокси</h4>
               <div className="bg-black/40 p-3 mt-2 rounded border border-cyber-700 font-mono text-sm grid grid-cols-2 gap-2">
                 <div className="text-gray-500">Сервер:</div>
                 <div className="text-green-400">127.0.0.1</div>
                 <div className="text-gray-500">Порт:</div>
                 <div className="text-green-400">1080</div>
                 <div className="text-gray-500">Пользователь:</div>
                 <div className="text-gray-400">(пусто)</div>
               </div>
             </div>
           </div>

           <div className="flex items-start gap-4">
             <div className="bg-cyber-700 p-2 rounded-full text-white font-bold h-8 w-8 flex items-center justify-center shrink-0">3</div>
             <div>
               <h4 className="font-bold text-white">Результат</h4>
               <p className="text-sm text-gray-400">
                 Звонки пойдут через TCP туннель. Качество может немного снизиться, но стабильность будет 100%.
               </p>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};