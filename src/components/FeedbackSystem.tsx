import React, { useState } from 'react';
import { MessageSquare, ExternalLink, ShieldCheck, Heart, Copy, Check, Mail, Github, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTelegram } from '../TelegramContext';

export const FeedbackSystem: React.FC = () => {
  const { t } = useLanguage();
  const { webApp } = useTelegram();
  const [reportText, setReportText] = useState('');
  const [copied, setCopied] = useState(false);

  const getSystemInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const lang = navigator.language;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    return `\n\n--- Tech Info ---\nUA: ${userAgent}\nPlatform: ${platform}\nLang: ${lang}\nRes: ${screenRes}\nApp: v1.1.0 Maestro`;
  };

  const handleCopy = async () => {
    const finalReport = `Bug Report:\n${reportText || 'No description provided'}${getSystemInfo()}`;
    try {
      await navigator.clipboard.writeText(finalReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const openLink = (url: string) => {
     if (webApp) {
         webApp.openLink(url);
     } else {
         window.open(url, '_blank');
     }
  };

  return (
    <div className="bg-cyber-800 p-8 rounded-[2.5rem] border border-cyber-700 shadow-xl overflow-hidden relative group">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-30"></div>
      <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <MessageSquare size={200} className="text-cyber-accent" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyber-700 to-cyber-600 p-3 rounded-2xl shadow-inner">
            <MessageSquare className="text-white" size={24} />
            </div>
            <div>
            <h3 className="text-xl font-black text-white tracking-tight">{t('feedback_title')}</h3>
            <p className="text-xs text-gray-400">{t('feedback_desc')}</p>
            </div>
        </div>

        {/* Diagnostic Input */}
        <div className="bg-black/30 p-1 rounded-2xl border border-cyber-700 mb-6 focus-within:border-cyber-500 transition-colors">
            <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder={t('feedback_placeholder')}
            className="w-full bg-transparent border-none rounded-xl p-4 text-xs text-white focus:outline-none min-h-[100px] resize-none font-mono placeholder-gray-600"
            />
            <div className="px-1 pb-1">
                <button 
                    onClick={handleCopy}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                        copied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-cyber-700 hover:bg-cyber-600 text-gray-300'
                    }`}
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? t('feedback_copied') : t('feedback_copy_btn')}
                </button>
            </div>
        </div>

        {/* Action Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
                onClick={() => openLink('https://t.me/ntc_party')}
                className="flex items-center justify-between px-5 py-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl group transition-all"
            >
                <div className="flex items-center gap-3">
                    <Send size={18} className="text-blue-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-xs font-black text-blue-100">{t('feedback_channel_tg')}</span>
                </div>
                <ExternalLink size={14} className="text-blue-500 opacity-50" />
            </button>

            <button 
                onClick={() => openLink('https://github.com/hufrea/byedpi/issues')}
                className="flex items-center justify-between px-5 py-4 bg-gray-700/20 hover:bg-gray-700/30 border border-gray-500/20 hover:border-gray-500/40 rounded-2xl group transition-all"
            >
                <div className="flex items-center gap-3">
                    <Github size={18} className="text-gray-300" />
                    <span className="text-xs font-black text-gray-200">{t('feedback_channel_gh')}</span>
                </div>
                <ExternalLink size={14} className="text-gray-500 opacity-50" />
            </button>
        </div>

        <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
                <ShieldCheck size={12} />
                MAESTRO EDITION 2025
            </div>
        </div>
      </div>
    </div>
  );
};