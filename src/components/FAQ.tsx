
import React from 'react';
import { HelpCircle, ChevronDown, ShieldQuestion, LifeBuoy, AlertCircle, Terminal, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { FeedbackSystem } from './FeedbackSystem';

export const FAQ: React.FC = () => {
  const { t } = useLanguage();

  const qa = [
    { q: t('faq_q1'), a: t('faq_a1'), icon: <AlertCircle className="text-red-400" /> },
    { q: t('faq_q2'), a: t('faq_a2'), icon: <Terminal className="text-teal-400" /> },
    { q: t('faq_q3'), a: t('faq_a3'), icon: <Globe className="text-blue-400" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-gradient-to-r from-orange-900/30 to-cyber-800 p-6 rounded-2xl border border-orange-500/30">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <LifeBuoy className="text-orange-400" />
          {t('faq_title')}
        </h3>
      </div>

      <div className="space-y-4">
        {qa.map((item, index) => (
          <div key={index} className="bg-cyber-800 p-5 rounded-2xl border border-cyber-700 shadow-lg hover:border-cyber-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-black/20 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-100 mb-2 leading-snug">{item.q}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <FeedbackSystem />
      </div>
    </div>
  );
};
