
import React, { useState, useEffect } from 'react';
import { MessageSquare, ExternalLink, ShieldCheck, Heart, Copy, Check, Send, AlertTriangle, Wifi, Globe, Smartphone, Monitor, MapPin, UserCheck, Lock } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { useTelegram } from '../../telegram/TelegramContext';
import { ObservationResult, SourceAuthority, ObservationContext, Platform } from '../../../core/domain/types';
import { APP_VERSION } from '../../../config/constants';

export const FeedbackSystem: React.FC = () => {
  const { t } = useLanguage();
  const { webApp, isTelegram, platform: tgPlatform } = useTelegram();
  const [copied, setCopied] = useState(false);
  
  // Structured State for Reality Expertise
  const [result, setResult] = useState<ObservationResult | null>(null);
  const [platform, setPlatform] = useState<Platform>('android');
  const [network, setNetwork] = useState<'wifi' | 'mobile'>('wifi');
  const [vpnActive, setVpnActive] = useState(false);
  const [region, setRegion] = useState('');
  const [comment, setComment] = useState('');
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Auto-detect platform from Telegram
  useEffect(() => {
    if (tgPlatform === 'ios') setPlatform('ios');
    else if (tgPlatform === 'android') setPlatform('android');
    else if (tgPlatform === 'tdesktop') setPlatform('windows'); // Approximate
  }, [tgPlatform]);

  const generateReport = () => {
    const context: ObservationContext = {
        platform: platform,
        networkType: network,
        vpnActive: vpnActive,
        locationRegion: region || "UNKNOWN",
        isHumanVerified: isHumanVerified,
        appVersion: APP_VERSION
    };

    const authority = isHumanVerified ? SourceAuthority.VERIFIED_USER : SourceAuthority.CONDITIONAL_USER;

    // This is the JSON payload for the User Knowledge Base
    const payload = {
        type: "UKB_OBSERVATION_V2",
        authority: authority,
        timestamp: new Date().toISOString(),
        context: context,
        result: result,
        user_comment: comment || undefined,
        _signature: isHumanVerified ? `HUMAN_SIG_${Date.now().toString(36)}` : null
    };
    return JSON.stringify(payload, null, 2);
  };

  const handleCopy = async () => {
    const report = generateReport();
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
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
               <p className="text-xs text-gray-400">User Knowledge Base Contribution</p>
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

            {/* 2. Reality Context (The Filter) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_context_network')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setNetwork('wifi')} className={`p-2 rounded-lg flex-1 flex justify-center items-center ${network === 'wifi' ? 'bg-blue-600 text-white' : 'bg-cyber-900 text-gray-500'}`}><Wifi size={14}/></button>
                        <button onClick={() => setNetwork('mobile')} className={`p-2 rounded-lg flex-1 flex justify-center items-center ${network === 'mobile' ? 'bg-blue-600 text-white' : 'bg-cyber-900 text-gray-500'}`}><Globe size={14}/></button>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">Extra Layers</label>
                    <button 
                        onClick={() => setVpnActive(!vpnActive)} 
                        className={`w-full p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold ${vpnActive ? 'bg-orange-600 text-white' : 'bg-cyber-900 text-gray-500'}`}
                    >
                        <Lock size={14} />
                        VPN {vpnActive ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* 3. Location & Verification */}
            <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">Region (Optional)</label>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input 
                            type="text" 
                            value={region} 
                            onChange={(e) => setRegion(e.target.value)} 
                            placeholder="RU-MOW" 
                            className="w-full bg-cyber-900 border border-cyber-700 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-cyber-500"
                        />
                    </div>
                 </div>
            </div>

            {/* 4. Human Verification Gate */}
            <div 
                onClick={() => setIsHumanVerified(!isHumanVerified)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isHumanVerified 
                    ? 'bg-green-900/20 border-green-500/50' 
                    : 'bg-cyber-900/50 border-cyber-700 hover:bg-cyber-900'
                }`}
            >
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${isHumanVerified ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                    {isHumanVerified && <Check size={14} className="text-black" />}
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-200 flex items-center gap-1">
                        <UserCheck size={12} className={isHumanVerified ? 'text-green-400' : 'text-gray-500'} />
                        I am a Human
                    </div>
                    <div className="text-[10px] text-gray-500">Verifies data as "Empirical Reality"</div>
                </div>
            </div>

            {/* 5. Output */}
            <div className="pt-2">
                <button 
                    onClick={handleCopy}
                    disabled={!result}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                        copied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : !result ? 'bg-cyber-800 text-gray-600 cursor-not-allowed' : 'bg-cyber-700 hover:bg-cyber-600 text-gray-300'
                    }`}
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? t('feedback_copied') : "1. " + t('feedback_copy_btn')}
                </button>
            </div>
        </div>

        {/* Send to Bot */}
        <button 
            onClick={openSupport}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-xs transition-all border ${
                copied
                ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-500/20 animate-pulse'
                : 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20'
            }`}
        >
            <Send size={14} />
            2. {t('feedback_send_to_bot')}
        </button>

        <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
                <ShieldCheck size={12} />
                UKB LINKED
            </div>
        </div>
      </div>
    </div>
  );
};
