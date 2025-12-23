
import React from 'react';
import { Smartphone, ShieldCheck, Key, Zap, CheckCircle, Apple } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { useLanguage } from '../LanguageContext';

export const IosGuide: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-gradient-to-br from-purple-900/40 to-black/40 border border-purple-500/30 p-6 rounded-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/10 p-3 rounded-2xl">
            <Apple className="text-white" size={32} />
          </div>
          <div>
            <h4 className="font-bold text-white text-xl">{t('ios_title')}</h4>
            <p className="text-purple-200/60 text-sm">{t('ios_desc')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl flex items-center gap-5">
           <div className="bg-blue-600 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20 shrink-0">1</div>
           <div className="flex-1">
              <h3 className="font-bold text-white text-lg">{t('ios_step_1')}</h3>
              <p className="text-xs text-gray-400">{t('ios_step_1_desc')}</p>
           </div>
           <a href="https://apps.apple.com/app/v2box/id6446814690" target="_blank" className="bg-cyber-700 p-2 rounded-lg hover:bg-cyber-600 transition-colors">
              <Zap size={20} className="text-blue-400" />
           </a>
        </div>

        {/* Step 2 */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-5 mb-4">
              <div className="bg-purple-600 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-500/20 shrink-0">2</div>
              <div className="flex-1">
                 <h3 className="font-bold text-white text-lg">{t('ios_step_2')}</h3>
                 <p className="text-xs text-gray-400">{t('ios_step_2_desc')}</p>
              </div>
           </div>
           <div className="bg-black/30 p-4 rounded-xl border border-dashed border-gray-600 flex gap-3 items-center">
              <Key className="text-yellow-500 shrink-0" size={20} />
              <code className="text-[10px] font-mono text-green-400 break-all opacity-80 leading-tight">
                vless://uuid@ip:443?security=reality&sni=google.com&fp=chrome&type=grpc&serviceName=grpc#ByeDPI-Mobile
              </code>
              <CopyButton text="vless://..." className="shrink-0" />
           </div>
        </div>

        {/* Step 3 */}
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl flex items-center gap-5">
           <div className="bg-green-600 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-green-500/20 shrink-0">3</div>
           <div className="flex-1">
              <h3 className="font-bold text-white text-lg">{t('ios_step_3')}</h3>
              <p className="text-xs text-gray-400">{t('ios_step_3_desc')}</p>
           </div>
           <CheckCircle className="text-green-400" size={24} />
        </div>
      </div>

      <div className="bg-blue-900/10 p-5 rounded-2xl border border-blue-500/20 text-center">
         <p className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-2">Совет от эксперта Сбера:</p>
         <p className="text-xs text-gray-400 italic">"Если ключ не подключается — проверьте, что вы не под лимитом трафика. Мобильный интернет иногда блокирует VLESS, переключитесь на Wi-Fi."</p>
      </div>

    </div>
  );
};
