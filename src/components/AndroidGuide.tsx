import React from 'react';
import { Download, Settings, Terminal, Play, CheckCircle, ListFilter, Package } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { CopyButton } from './CopyButton';

export const AndroidGuide: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { 
      icon: <Settings size={20} className="text-gray-300" />, 
      title: t('android_instr_1'), 
      desc: t('android_instr_1_desc') 
    },
    { 
      icon: <Terminal size={20} className="text-green-400" />, 
      title: t('android_instr_2'), 
      desc: t('android_instr_2_desc') 
    },
    { 
      icon: <Settings size={20} className="text-yellow-400" />, 
      title: t('android_instr_3'), 
      desc: t('android_instr_3_desc') 
    },
    { 
      icon: <ListFilter size={20} className="text-blue-400" />, 
      title: t('android_instr_4'), 
      desc: t('android_instr_4_desc'),
      action: <div className="mt-2 flex items-center gap-2">
        <code className="bg-black/40 px-2 py-1 rounded text-xs text-green-400 font-mono border border-cyber-700">{t('local_sni_example')}</code>
        <CopyButton text={t('local_sni_example')} className="p-1 h-6 w-6" />
      </div>
    },
    { 
      icon: <Play size={20} className="text-purple-400" />, 
      title: t('android_instr_5'), 
      desc: t('android_instr_5_desc') 
    }
  ];

  return (
    <div className="space-y-6">
      <section className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyber-700 p-2 rounded text-white font-bold h-10 w-10 flex items-center justify-center shrink-0">1</div>
          <h3 className="text-xl font-bold text-white">{t('android_install_title')}</h3>
        </div>
        
        <div className="ml-0 md:ml-14 space-y-8">
          <div>
             <p className="text-gray-400 text-sm mb-4">{t('android_download_desc')}</p>

             <div className="bg-black/30 p-4 rounded-lg mb-4 border border-cyber-700">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Package size={16} className="text-cyber-accent"/>
                  {t('android_which_file')}
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/50 rounded border border-green-900/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-900 text-green-100 text-[10px] font-bold px-2 py-1 rounded-bl">APK</div>
                    <div className="font-mono text-green-400 text-sm font-bold mb-1">app-release.apk</div>
                    <p className="text-xs text-gray-300">
                      {t('android_file_desc_apk')}
                    </p>
                  </div>
                </div>
             </div>

             <a 
               href="https://github.com/romanvht/ByeByeDPI/releases/tag/v.1.6.8" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-cyber-500 hover:bg-cyber-400 text-white px-5 py-2.5 rounded-lg font-bold transition-colors w-full md:w-auto justify-center shadow-lg shadow-cyber-500/20 mb-8"
             >
               <Download size={20} />
               {t('android_download_btn')}
             </a>
          </div>

          <div className="relative space-y-0">
             {steps.map((step, index) => (
               <div key={index} className="relative pl-8 pb-8 last:pb-0">
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-cyber-700"></div>
                  )}
                  <div className="absolute left-0 top-0 bg-cyber-800 border border-cyber-600 rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-lg shadow-black/50">
                    <div className="w-2 h-2 rounded-full bg-cyber-400"></div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 border border-cyber-700/50 hover:border-cyber-600 transition-colors">
                     <div className="flex items-center gap-2 mb-1">
                        {step.icon}
                        <h5 className="font-bold text-gray-200 text-sm">{step.title}</h5>
                     </div>
                     <p className="text-xs text-gray-400 leading-relaxed">
                        {step.desc}
                     </p>
                     {step.action}
                  </div>
               </div>
             ))}
          </div>
          
          <div className="flex justify-center pt-2">
             <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-400 rounded-full border border-green-900/50 text-xs font-bold animate-pulse">
                <CheckCircle size={14} />
                Ready to Connect
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};