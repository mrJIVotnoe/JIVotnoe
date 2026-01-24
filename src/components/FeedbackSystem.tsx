import React from 'react';
import { MessageSquare, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTelegram } from '../features/telegram/TelegramContext';

export const FeedbackSystem: React.FC = () => {
  const { t } = useLanguage();
  const { webApp } = useTelegram();

  const openSupport = () => {
    if (webApp) {
      webApp.openTelegramLink('https://t.me/ByeDPI_Mate_Support');
    } else {
      window.open('https://t.me/ByeDPI_Mate_Support', '_blank');
    }
  };

  return (
    <div className="bg-cyber-800 p-6 rounded-3xl border border-cyber-700 shadow-xl overflow-hidden relative group">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <MessageSquare size={120} className="text-cyber-accent" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-cyber-accent/10 p-3 rounded-2xl">
          <MessageSquare className="text-cyber-accent" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">{t('feedback_report_issue')}</h3>
          <p className="text-xs text-gray-400">{t('feedback_placeholder')}</p>
        </div>
      </div>

      <button 
        onClick={openSupport}
        className="w-full flex items-center justify-center gap-3 bg-cyber-accent text-cyber-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyber-accent/20"
      >
        {t('feedback_send_to_bot')}
        <ExternalLink size={14} />
      </button>

      <div className="mt-6 pt-6 border-t border-cyber-700/50 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-cyber-accent" />
          COMMUNITY DRIVEN
        </div>
        <div className="flex items-center gap-1">
          MADE WITH <Heart size={10} className="text-red-500 animate-pulse" /> IN 2025
        </div>
      </div>
    </div>
  );
};