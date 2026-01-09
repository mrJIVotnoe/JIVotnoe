import React, { useState } from 'react';
import { MessageSquare, ExternalLink, ShieldCheck, Heart, Copy, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTelegram } from '../shared/hooks/useTelegram';

export const FeedbackSystem: React.FC = () => {
  const { t } = useLanguage();
  const { webApp } = useTelegram();
  const [reportText, setReportText] = useState('');
  const [copied, setCopied] = useState(false);

  const getSystemInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const lang = navigator.language;
    return `\n\n--- Tech Info ---\nUA: ${userAgent}\nPlatform: ${platform}\nLang: ${lang}\nApp: v1.1.0`;
  };

  const handleCopyAndOpen = async () => {
    if (!reportText.trim()) return;

    const finalReport = `Bug Report:\n${reportText}${getSystemInfo()}`;

    try {
      await navigator.clipboard.writeText(finalReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Give a moment for the user to see the "Copied" feedback before opening Telegram
      setTimeout(() => {
        if (webApp) {
          webApp.openTelegramLink('https://t.me/ByeDPI_Mate_Support');
        } else {
          window.open('https://t.me/ByeDPI_Mate_Support', '_blank');
        }
      }, 800);
      
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="bg-cyber-800 p-6 rounded-3xl border border-cyber-700 shadow-xl overflow-hidden relative group">
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <MessageSquare size={120} className="text-cyber-accent" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-cyber-accent/10 p-3 rounded-2xl">
          <MessageSquare className="text-cyber-accent" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">{t('feedback_report_issue')}</h3>
          <p className="text-xs text-gray-400">{t('feedback_instruction')}</p>
        </div>
      </div>

      <div className="mb-4">
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder={t('feedback_placeholder')}
          className="w-full bg-black/40 border border-cyber-600 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyber-accent transition-all min-h-[80px] resize-none font-medium placeholder-gray-600"
        />
      </div>

      <button 
        onClick={handleCopyAndOpen}
        disabled={!reportText.trim()}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
            copied 
            ? 'bg-green-500 text-white shadow-green-500/20'
            : !reportText.trim()
                ? 'bg-cyber-700 text-gray-500 cursor-not-allowed'
                : 'bg-cyber-accent text-cyber-900 hover:scale-[1.02] active:scale-[0.98] shadow-cyber-accent/20'
        }`}
      >
        {copied ? (
            <>
                <Check size={16} />
                COPIED! OPENING...
            </>
        ) : (
            <>
                {t('feedback_copy_btn')}
                <ExternalLink size={14} />
            </>
        )}
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
