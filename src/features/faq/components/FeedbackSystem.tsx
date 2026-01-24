
import React, { useState } from 'react';
import { MessageSquare, ExternalLink, ShieldCheck, Heart, Copy, Check, Send, AlertTriangle, Wifi, Globe, Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { useTelegram } from '../../telegram/TelegramContext';
import { ObservationResult } from '../../../core/domain/types';

export const FeedbackSystem: React.FC = () => {
  const { t } = useLanguage();
  const { webApp } = useTelegram();
  const [copied, setCopied] = useState(false);
  
  // Structured State
  const [result, setResult] = useState<ObservationResult | null>(null);
  const [platform, setPlatform] = useState<'mobile' | 'desktop'>('mobile');
  const [network, setNetwork] = useState<'wifi' | 'mobile'>('wifi');
  const [comment, setComment] = useState('');

  const generateReport = () => {
    // This is the JSON payload for the Observation Pool
    const payload = {
        type: "OBSERVATION_V1",
        timestamp: new Date().toISOString(),
        context: {
            platform: platform,
            network: network,
            app_version: "1.7.0"
        },
        result: result,
        user_comment: comment || undefined
    };
    return JSON.stringify(payload, null, 2);
  };

  const handleCopy = async () => {
    const report = generateReport();
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      // Give time for user to see success, but don't auto-hide too fast so they know what happened
      // Reset is handled manually or on re-click logic if needed, but 2s timeout is fine for UX
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const openSupport = () => {
    const url = 'https://t.me/ByeDPI_Mate_Support';
    if (webApp) webApp.openTelegramLink(url);
    else window.open(url, '_blank');
  };

  return (
    <div className="bg-cyber-800 p-6 rounded-[2.5rem] border border-cyber-700 shadow-xl overflow-hidden relative group mt-8">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-30"></div>
      
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

        {/* Structured Inputs */}
        <div className="bg-black/30 p-4 rounded-2xl border border-cyber-700 mb-6 space-y-4">
            
            {/* 1. Result */}
            <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_status_label')}</label>
                <div className="flex gap-2">
                    <button onClick={() => setResult('SUCCESS')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${result === 'SUCCESS' ? 'bg-green-600 text-white' : 'bg-cyber-900 text-gray-400 border border-cyber-700'}`}>
                        {t('feedback_status_stable')}
                    </button>
                    <button onClick={() => setResult('UNSTABLE')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${result === 'UNSTABLE' ? 'bg-yellow-600 text-white' : 'bg-cyber-900 text-gray-400 border border-cyber-700'}`}>
                        {t('feedback_status_unstable')}
                    </button>
                    <button onClick={() => setResult('FAIL')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${result === 'FAIL' ? 'bg-red-600 text-white' : 'bg-cyber-900 text-gray-400 border border-cyber-700'}`}>
                        {t('feedback_status_fail')}
                    </button>
                </div>
            </div>

            {/* 2. Context */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_context_network')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setNetwork('wifi')} className={`p-2 rounded-lg flex-1 flex justify-center ${network === 'wifi' ? 'bg-blue-600 text-white' : 'bg-cyber-900 text-gray-500'}`}><Wifi size={16}/></button>
                        <button onClick={() => setNetwork('mobile')} className={`p-2 rounded-lg flex-1 flex justify-center ${network === 'mobile' ? 'bg-blue-600 text-white' : 'bg-cyber-900 text-gray-500'}`}><Globe size={16}/></button>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_context_device')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setPlatform('mobile')} className={`p-2 rounded-lg flex-1 flex justify-center ${platform === 'mobile' ? 'bg-purple-600 text-white' : 'bg-cyber-900 text-gray-500'}`}><Smartphone size={16}/></button>
                        <button onClick={() => setPlatform('desktop')} className={`p-2 rounded-lg flex-1 flex justify-center ${platform === 'desktop' ? 'bg-purple-600 text-white' : 'bg-cyber-900 text-gray-500'}`}><Monitor size={16}/></button>
                    </div>
                </div>
            </div>

            {/* 3. Output */}
            <div className="pt-2">
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

        {/* Visual cue: Highlight "Send to Bot" when copied */}
        <button 
            onClick={openSupport}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-xs transition-all border ${
                copied
                ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-500/20 animate-pulse'
                : 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20'
            }`}
        >
            <Send size={14} />
            {t('feedback_send_to_bot')}
        </button>

        <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
                <ShieldCheck size={12} />
                RESEARCH LOOP v0.1
            </div>
        </div>
      </div>
    </div>
  );
};
