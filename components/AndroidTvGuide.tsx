import React from 'react';
import { Tv, Smartphone, ArrowRight, Download, Cloud, Share2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const AndroidTvGuide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Tv className="text-purple-400" />
        {t('tv_section_title')}
      </h3>

      <div className="bg-gradient-to-r from-purple-900/30 to-cyber-900 p-4 rounded-lg border border-purple-800/30 mb-6">
        <h4 className="font-bold text-white text-sm mb-1">{t('tv_problem')}</h4>
        <p className="text-gray-300 text-xs mb-2">
          {t('tv_solution')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Google Drive */}
        <div className="bg-black/20 p-5 rounded-xl border border-cyber-700 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cloud size={80} />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg shadow-blue-900/50">1</span>
             <h4 className="font-bold text-blue-100">{t('tv_method_cloud')}</h4>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
               <div className="mt-1"><Smartphone size={16} className="text-gray-500"/></div>
               <div>
                 <div className="text-xs font-bold text-gray-200">{t('tv_cloud_step_1')}</div>
                 <div className="text-xs text-gray-400">{t('tv_cloud_step_1_desc')}</div>
               </div>
            </div>
            
             <div className="flex gap-3">
               <div className="mt-1"><Download size={16} className="text-gray-500"/></div>
               <div>
                 <div className="text-xs font-bold text-gray-200">{t('tv_cloud_step_2')}</div>
                 <div className="text-xs text-gray-400">{t('tv_cloud_step_2_desc')}</div>
               </div>
            </div>

             <div className="flex gap-3">
               <div className="mt-1"><Tv size={16} className="text-gray-500"/></div>
               <div>
                 <div className="text-xs font-bold text-gray-200">{t('tv_cloud_step_3')}</div>
                 <div className="text-xs text-gray-400">{t('tv_cloud_step_3_desc')}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Method 2: SFTTV */}
        <div className="bg-black/20 p-5 rounded-xl border border-cyber-700 relative overflow-hidden group hover:border-green-500/50 transition-colors">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Share2 size={80} />
          </div>

          <div className="flex items-center gap-2 mb-4">
             <span className="bg-green-700 text-white text-xs font-bold px-2 py-1 rounded shadow-lg shadow-green-900/50">2</span>
             <h4 className="font-bold text-green-100">{t('tv_method_direct')}</h4>
          </div>

           <div className="space-y-4">
            <div className="flex gap-3">
               <div className="mt-1"><Download size={16} className="text-gray-500"/></div>
               <div>
                 <div className="text-xs font-bold text-gray-200">{t('tv_direct_step_1')}</div>
                 <div className="text-xs text-gray-400">{t('tv_direct_step_1_desc')}</div>
               </div>
            </div>
            
             <div className="flex gap-3">
               <div className="mt-1"><ArrowRight size={16} className="text-gray-500"/></div>
               <div>
                 <div className="text-xs font-bold text-gray-200">{t('tv_direct_step_2')}</div>
                 <div className="text-xs text-gray-400">{t('tv_direct_step_2_desc')}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};