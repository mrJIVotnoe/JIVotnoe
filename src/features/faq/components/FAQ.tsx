
import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, ShieldAlert, Smartphone, Zap, Search, LifeBuoy, WifiOff, VolumeX } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { FeedbackSystem } from './FeedbackSystem';
import { Collapsible } from '../../../shared/ui/Collapsible';

export const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  // Structure matches src/translations.ts EXACTLY
  const categories = [
    {
      id: 'basics',
      title: t('faq_cat_basics'),
      items: [
        { q: t('faq_q_yt'), a: t('faq_a_yt'), icon: <Zap className="text-red-400" /> },
        { q: t('faq_q_sni'), a: t('faq_a_sni'), icon: <HelpCircle className="text-blue-400" /> },
        { q: t('faq_q_vpn'), a: t('faq_a_vpn'), icon: <ShieldAlert className="text-orange-400" /> },
      ]
    },
    {
      id: 'trouble',
      title: t('faq_cat_trouble'),
      items: [
        { q: t('faq_q_av'), a: t('faq_a_av'), icon: <AlertTriangle className="text-yellow-400" /> },
        { q: t('faq_q_discord'), a: t('faq_a_discord'), icon: <VolumeX className="text-indigo-400" /> },
        { q: t('faq_q_blocked'), a: t('faq_a_blocked'), icon: <WifiOff className="text-red-500" /> },
      ]
    },
    {
      id: 'mobile',
      title: t('faq_cat_security'), 
      items: [
        { q: t('faq_q_mobile'), a: t('faq_a_mobile'), icon: <Smartphone className="text-green-400" /> },
      ]
    }
  ];

  // Search filter
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(search.toLowerCase()) || 
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="bg-gradient-to-r from-orange-900/30 to-cyber-800 p-6 rounded-[2.5rem] border border-orange-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
           <LifeBuoy size={100} />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
            <LifeBuoy className="text-orange-400" size={28} />
            {t('faq_title')}
          </h3>
          
          <div className="relative max-w-md">
             <input 
               type="text" 
               placeholder={t('faq_search')}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-black/40 border border-cyber-600 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-500"
             />
             <Search className="absolute left-3 top-3.5 text-gray-500" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <div className="h-px bg-cyber-700 w-8"></div>
                {category.title}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {category.items.map((item, idx) => (
                  <Collapsible 
                    key={idx}
                    title={
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-black/30 rounded-lg shrink-0 border border-white/5">{item.icon}</div>
                        <span className="font-bold text-gray-200 leading-snug">{item.q}</span>
                      </div>
                    }
                    className="border-cyber-700 hover:border-cyber-500 transition-colors bg-cyber-800/50"
                  >
                    <div className="text-sm text-gray-400 leading-relaxed p-2 pl-12 whitespace-pre-line">
                       {item.a}
                    </div>
                  </Collapsible>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-black/20 rounded-3xl border border-cyber-800 border-dashed">
             <Search size={32} className="mx-auto mb-2 opacity-50"/>
             No results found for "{search}"
          </div>
        )}
      </div>

      {/* Integrated Feedback System */}
      <div className="mt-12">
        <FeedbackSystem />
      </div>
    </div>
  );
};
