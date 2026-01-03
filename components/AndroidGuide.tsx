
import React from 'react';
import { Download, Terminal, Play, CheckCircle, ListFilter, Package, Shield, Bot, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const AndroidGuide: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { 
      icon: <Shield size={20} className="text-blue-400" />, 
      title: t('android_instr_1'), 
      desc: t('android_instr_1_desc') 
    },
    { 
      icon: <Terminal size={20} className="text-green-400" />, 
      title: t('android_instr_2'), 
      desc: t('android_instr_2_desc') 
    },
    { 
      icon: <Globe size={20} className="text-indigo-400" />, 
      title: t('android_instr_3'), 
      desc: t('android_instr_3_desc') 
    },
    { 
      icon: <ListFilter size={20} className="text-orange-400" />, 
      title: t('android_instr_4'), 
      desc: t('android_instr_4_desc')
    },
    { 
      icon: <Play size={20} className="text-purple-400" />, 
      title: t('android_instr_5'), 
      desc: t('android_instr_5_desc') 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="bg-cyber-800 p-6 rounded-3xl border border-cyber-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Bot size={120} className="text-cyber-accent" />
        </div>

        <div className="flex items-center gap-4 mb-6 relative">
          <div className="bg-gradient-to-br from-cyber-700 to-cyber-600 p-3 rounded-2xl shadow-lg">
            <Bot size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{t('android_install_title')}</h3>
            <p className="text-xs text-cyber-400 uppercase tracking-widest font-mono">Consumer Friendly Edition</p>
          </div>
        </div>
        
        <div className="ml-0 md:ml-4 space-y-8 relative">
          <div className="bg-cyber-900/40 p-5 rounded-2xl border border-cyber-700/50">
             <p className="text-gray-300 text-sm mb-6 leading-relaxed">
               {t('android_download_desc')}
             </p>

             <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-4 bg-cyber-800/80 rounded-2xl border border-cyber-700 hover:border-indigo-500/30 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-600/20 p-2 rounded-xl">
                      <Package size={24} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-mono text-white text-sm font-bold">ByeDPIManager.apk</div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{t('android_file_desc_apk')}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <CheckCircle size={18} className="text-green-500/50" />
                  </div>
                </div>
             </div>

             <a 
               href="https://github.com/romanvht/ByeDPIManager/releases" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black transition-all w-full md:w-auto justify-center shadow-xl shadow-blue-500/20 active:scale-[0.98]"
             >
               <Download size={20} />
               {t('android_download_btn')}
             </a>
          </div>

          <div className="space-y-4">
             {steps.map((step, index) => (
               <div key={index} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="bg-cyber-800 border-2 border-cyber-700 rounded-xl w-10 h-10 flex items-center justify-center z-10 shadow-lg group-hover:border-cyber-accent transition-colors">
                      {step.icon}
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="w-0.5 h-full bg-cyber-700/50 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                     <h5 className="font-black text-white text-sm mb-1 uppercase tracking-tight">{step.title}</h5>
                     <p className="text-xs text-gray-400 leading-relaxed">
                        {step.desc}
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};
