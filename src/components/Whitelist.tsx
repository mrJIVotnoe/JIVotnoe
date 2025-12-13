import React from 'react';
import { ShieldCheck, Network, AlertCircle } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { SNI_DOMAINS, DIRECT_DOMAINS } from '../data';

export const Whitelist: React.FC = () => {
  const directListString = DIRECT_DOMAINS.join(',');

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-r from-blue-900/40 to-cyber-800 p-6 rounded-xl border border-blue-800/50">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="text-blue-400" />
          Белый список (Whitelist)
        </h3>
        <p className="text-gray-300 text-sm">
          Здесь собраны домены, которые либо <b>нужно</b> использовать для обхода (SNI), либо <b>нельзя</b> туннелировать (банки, госуслуги).
        </p>
      </div>

      {/* SNI List */}
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
          <Network className="text-cyber-accent" size={20} />
          Рабочие SNI (для аргумента -n)
        </h4>
        <p className="text-xs text-gray-400 mb-4">
          Эти домены можно вставлять в аргумент <code>-n domain.com</code>. Они работают на большинстве операторов (MTS, Megafon, T2, Yota, RTK).
          <br/>
          <span className="text-red-400 font-bold mt-1 block">Внимание: Для Билайн рабочих SNI почти нет. Рекомендуем сменить оператора.</span>
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyber-700 text-gray-500 text-xs uppercase">
                <th className="p-3">Домен</th>
                <th className="p-3">Операторы</th>
                <th className="p-3">Действие</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SNI_DOMAINS.map((item, idx) => (
                <tr key={idx} className="border-b border-cyber-700/50 hover:bg-cyber-700/30 transition-colors">
                  <td className="p-3 font-mono text-green-400">{item.domain}</td>
                  <td className="p-3 text-gray-400 text-xs">{item.note}</td>
                  <td className="p-3">
                    <CopyButton text={item.domain} className="p-1.5 h-8 w-8" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct List */}
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
          <AlertCircle className="text-yellow-500" size={20} />
          Прямое подключение (Split Tunneling)
        </h4>
        <p className="text-sm text-gray-400 mb-4">
          Эти приложения (банки, маркетплейсы, госуслуги) могут не работать через VPN/DPI. 
          Скопируйте этот список и вставьте в настройки <b>"Раздельное туннелирование"</b> или <b>"Исключения"</b> в вашем клиенте (V2Ray, ByeDPI, Tun2Socks).
        </p>

        <div className="bg-black/40 p-4 rounded-lg border border-cyber-700 relative group">
           <div className="absolute top-2 right-2">
             <CopyButton text={directListString} />
           </div>
           <code className="text-xs font-mono text-yellow-200/80 break-all leading-relaxed">
             {directListString}
           </code>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          * Список скопируется через запятую, что подходит для большинства приложений.
        </p>
      </div>
    </div>
  );
};