
import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, ShieldAlert, Smartphone, Zap, Search, LifeBuoy, WifiOff, VolumeX } from 'lucide-react';
import { useLanguage } from '../features/localization/LanguageContext';
import { FeedbackSystem } from './FeedbackSystem';
import { Collapsible } from '../shared/ui/Collapsible';

const faqKeys = {
  title: 'faq.title',
  searchPlaceholder: 'faq.search.placeholder',
  categories: {
    basics: 'faq.category.basics',
    troubleshooting: 'faq.category.trouble',
    security: 'faq.category.security'
  },
  questions: {
    yt: { q: 'faq.q.yt', a: 'faq.a.yt' },
    sni: { q: 'faq.q.sni', a: 'faq.a.sni' },
    vpn: { q: 'faq.q.vpn', a: 'faq.a.vpn' },
    av: { q: 'faq.q.av', a: 'faq.a.av' },
    discord: { q: 'faq.q.discord', a: 'faq.a.discord' },
    blocked: { q: 'faq.q.blocked', a: 'faq.a.blocked' },
    mobile: { q: 'faq.q.mobile', a: 'faq.a.mobile' }
  }
};

export const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const categories = [
    {
      id: 'basics',
      title: t(faqKeys.categories.basics),
      items: [
        { q: t(faqKeys.questions.yt.q), a: t(faqKeys.questions.yt.a), icon: <Zap className="text-red-400" /> },
        { q: t(faqKeys.questions.sni.q), a: t(faqKeys.questions.sni.a), icon: <HelpCircle className="text-blue-400" /> },
        { q: t(faqKeys.questions.vpn.q), a: t(faqKeys.questions.vpn.a), icon: <ShieldAlert className="text-orange-400" /> },
      ]
    },
    {
      id: 'trouble',
      title: t(faqKeys.categories.troubleshooting),
      items: [
        { q: t(faqKeys.questions.av.q), a: t(faqKeys.questions.av.a), icon: <AlertTriangle className="text-yellow-400" /> },
        { q: t(faqKeys.questions.discord.q), a: t(faqKeys.questions.discord.a), icon: <VolumeX className="text-indigo-400" /> },
        { q: t(faqKeys.questions.blocked.q), a: t(faqKeys.questions.blocked.a), icon: <WifiOff className="text-red-500" /> },
      ]
    },
    {
      id: 'security',
      title: t(faqKeys.categories.security), 
      items: [
        { q: t(faqKeys.questions.mobile.q), a: t(faqKeys.questions.mobile.a), icon: <Smartphone className="text-green-400" /> },
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
            {t(faqKeys.title)}
          </h3>
          
          <div className="relative max-w-md">
             <input 
               type="text" 
               placeholder={t(faqKeys.searchPlaceholder)}
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
                        <span className="font-bold text-gray-200">{item.q}</span>
                      </div>
                    }
                    className="border-cyber-700 hover:border-cyber-500 transition-colors bg-cyber-800/50"
                  >
                    <div className="text-sm text-gray-400 leading-relaxed p-2 pl-12">
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

      <div className="mt-12">
        <FeedbackSystem />
      </div>
    </div>
  );
};
