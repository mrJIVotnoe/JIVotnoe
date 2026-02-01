
import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, Heart, Copy, Check, Send, Wifi, Globe, Smartphone, Monitor, Lock, MapPin, UserCheck, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { useTelegram } from '../../telegram/TelegramContext';
import { ObservationResult, VerificationSource } from '../../../core/domain/types';
import { APP_VERSION } from '../../../config/constants';

export const FeedbackSystem: React.FC = () => {
  const { t } = useLanguage();
  const { webApp, user } = useTelegram();
  const [copied, setCopied] = useState(false);
  
  // Structured State
  const [result, setResult] = useState<ObservationResult | null>(null);
  const [platform, setPlatform] = useState<'mobile' | 'desktop'>('mobile');
  const [network, setNetwork] = useState<'wifi' | 'mobile'>('wifi');
  const [vpnActive, setVpnActive] = useState(false);
  const [regionMatch, setRegionMatch] = useState(true);
  const [humanVerify, setHumanVerify] = useState(false);
  
  // Verification Logic
  const getVerificationSource = (): VerificationSource => {
      // In a real app, we would use Cloudflare Turnstile here
      if (humanVerify && user?.id) return 'VERIFIED_USER'; // Telegram ID + Checkbox
      if (humanVerify) return 'VERIFIED_USER'; // Just Checkbox (simulated for web)
      return 'ANONYMOUS';
  };

  const getTrustWeight = (source: VerificationSource): number => {
      if (source === 'ARCHITECT') return 1.0;
      if (source === 'VERIFIED_USER') return 0.99;
      return 0.5; // Anonymous/Unverified
  };

  const generateReport = () => {
    const source = getVerificationSource();
    
    // The Signed Payload Structure
    const payload = {
        type: "OBSERVATION_PACKET_V2",
        timestamp: new Date().toISOString(),
        verification: {
            source: source,
            weight: getTrustWeight(source),
            user_hash: user?.id ? `tg_${user.id}` : 'anon_session' // Pseudo-anonymized ID
        },
        context: {
            platform: platform,
            network_type: network,
            env_flags: {
                vpn_active: vpnActive,
                region_match: regionMatch,
                app_version: APP_VERSION
            }
        },
        result: result,
        meta: {
            user_agent: navigator.userAgent
        }
    };
    return JSON.stringify(payload, null, 2);
  };

  const handleCopy = async () => {
    if (!result) return;
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
               <p className="text-xs text-gray-400">Database Injection Protocol</p>
            </div>
        </div>

        {/* Structured Inputs */}
        <div className="bg-black/30 p-4 rounded-2xl border border-cyber-700 mb-6 space-y-5">
            
            {/* 1. Result */}
            <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_status_label')}</label>
                <div className="flex gap-2">
                    <button onClick={() => setResult('SUCCESS')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${result === 'SUCCESS' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'bg-cyber-900 text-gray-400 border border-cyber-700'}`}>
                        {t('feedback_status_stable')}
                    </button>
                    <button onClick={() => setResult('UNSTABLE')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${result === 'UNSTABLE' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/20' : 'bg-cyber-900 text-gray-400 border border-cyber-700'}`}>
                        {t('feedback_status_unstable')}
                    </button>
                    <button onClick={() => setResult('FAIL')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${result === 'FAIL' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-cyber-900 text-gray-400 border border-cyber-700'}`}>
                        {t('feedback_status_fail')}
                    </button>
                </div>
            </div>

            {/* 2. Context Conditions */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_context_network')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setNetwork('wifi')} className={`p-2 rounded-lg flex-1 flex justify-center items-center transition-colors ${network === 'wifi' ? 'bg-blue-600 text-white' : 'bg-cyber-900 text-gray-500 border border-cyber-700'}`}><Wifi size={16}/></button>
                        <button onClick={() => setNetwork('mobile')} className={`p-2 rounded-lg flex-1 flex justify-center items-center transition-colors ${network === 'mobile' ? 'bg-blue-600 text-white' : 'bg-cyber-900 text-gray-500 border border-cyber-700'}`}><Globe size={16}/></button>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">{t('feedback_context_device')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setPlatform('mobile')} className={`p-2 rounded-lg flex-1 flex justify-center items-center transition-colors ${platform === 'mobile' ? 'bg-purple-600 text-white' : 'bg-cyber-900 text-gray-500 border border-cyber-700'}`}><Smartphone size={16}/></button>
                        <button onClick={() => setPlatform('desktop')} className={`p-2 rounded-lg flex-1 flex justify-center items-center transition-colors ${platform === 'desktop' ? 'bg-purple-600 text-white' : 'bg-cyber-900 text-gray-500 border border-cyber-700'}`}><Monitor size={16}/></button>
                    </div>
                </div>
            </div>

            {/* 3. Environment Flags (Crucial for Verification) */}
            <div className="flex gap-2">
                <button onClick={() => setVpnActive(!vpnActive)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-[10px] font-bold border transition-colors ${vpnActive ? 'bg-orange-900/30 border-orange-500 text-orange-200' : 'bg-cyber-900 border-cyber-700 text-gray-500'}`}>
                    <Lock size={12} /> VPN Active
                </button>
                <button onClick={() => setRegionMatch(!regionMatch)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-[10px] font-bold border transition-colors ${regionMatch ? 'bg-green-900/30 border-green-500 text-green-200' : 'bg-cyber-900 border-cyber-700 text-gray-500'}`}>
                    <MapPin size={12} /> Local Region
                </button>
            </div>

            {/* 4. Human Verification */}
            <div 
                onClick={() => setHumanVerify(!humanVerify)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    humanVerify 
                    ? 'bg-emerald-900/20 border-emerald-500/50' 
                    : 'bg-cyber-900 border-cyber-700 hover:border-cyber-600'
                }`}
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${humanVerify ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500'}`}>
                    {humanVerify && <Check size={14} className="text-white" />}
                </div>
                <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                        I am Human & Data is Real
                        {humanVerify && <ShieldCheck size={12} className="text-emerald-400" />}
                    </div>
                    <div className="text-[9px] text-gray-500">I verify this is a unique manual test.</div>
                </div>
            </div>

            {/* 5. Output Actions */}
            <div className="pt-2">
                <button 
                    onClick={handleCopy}
                    disabled={!result}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                        copied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : !result ? 'bg-cyber-700 text-gray-500 cursor-not-allowed' : 'bg-cyber-700 hover:bg-cyber-600 text-gray-300'
                    }`}
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "PAYLOAD SECURED" : t('feedback_copy_btn')}
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
                <ShieldCheck size={12} className={humanVerify ? "text-emerald-500" : "text-gray-600"} />
                TRUST WEIGHT: {humanVerify ? '0.99 (USER)' : '0.50 (ANON)'}
            </div>
        </div>
      </div>
    </div>
  );
};
