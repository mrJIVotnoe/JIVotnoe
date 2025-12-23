import React from 'react';
import { Smartphone, ShieldAlert, Key, ChevronRight } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { useLanguage } from '../LanguageContext';

export const IosGuide: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-red-900/40 to-black/40 border border-red-500/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="bg-red-500/10 p-3 rounded-full shrink-0">
          <ShieldAlert className="text-red-400" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-red-100 text-lg">{t('ios_warning_title')}</h4>
          <p className="text-red-200/60 text-sm mt-1 leading-relaxed">
             {t('ios_warning_text')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">1</div>
              <h3 className="text-xl font-bold text-white">{t('ios_step_1')}</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col p-4 bg-cyber-900/50 border border-cyber-600/50 rounded-xl">
                <span className="font-bold text-white text-lg">V2Box</span>
                <p className="text-xs text-gray-400">{t('zh' ? '免费的安卓/iOS客户端' : t('ios_step_1_desc'))}</p>
              </div>
           </div>
        </div>

        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">2</div>
              <h3 className="text-xl font-bold text-white">{t('ios_step_2')}</h3>
           </div>
           <p className="text-sm text-gray-400 mb-4">{t('ios_step_2_desc')}</p>
           <div className="bg-black/30 p-4 rounded-xl border border-dashed border-gray-600 flex gap-3 items-center mb-4">
              <Key className="text-yellow-500 shrink-0" size={20} />
              <code className="text-xs font-mono text-green-400 break-all opacity-80">
                vless://uuid@ip:443?security=reality&sni={t('local_sni_example')}...
              </code>
           </div>
        </div>

        <div className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyber-600 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white">3</div>
              <h3 className="text-xl font-bold text-white">{t('ios_step_3')}</h3>
           </div>
           <p className="text-sm text-gray-400 mb-4">{t('ios_step_3_desc')}</p>
           <div className="bg-black/40 p-4 rounded-xl border border-cyber-700 flex items-center justify-between group">
              <div className="text-sm font-mono text-gray-300 truncate mr-4">
                {t('local_services_list')}
              </div>
              <CopyButton text={t('local_services_list')} />
           </div>
        </div>
      </div>
    </div>
  );
};