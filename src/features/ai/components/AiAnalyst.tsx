
import React, { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles, Zap, Smartphone, Monitor, ThumbsUp, ThumbsDown, Settings, ChevronDown, ChevronUp, Code, Check, Music, Tv, Terminal, Info, Activity, ShieldAlert, Lock, AlertTriangle, Eye, FileJson } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { useTelegram } from '../../telegram/TelegramContext';
import { WORKER_CODE_TEMPLATE } from '../../../config/constants';
import { useAiStore } from '../../../store/ai.store';
import { useDiagnosticsStore } from '../../../store/diagnostics.store';
import { NetProbeDashboard } from '../../diagnostics/components/NetProbeDashboard';
import { PrivacyVault } from './PrivacyVault';
import { STRATEGIES } from '../../strategies/data';

export const AiAnalyst: React.FC = () => {
  const { t, language } = useLanguage();
  const { webApp } = useTelegram();
  
  const { 
    input, setInput, 
    loading, result, error, rated,
    useBridge, bridgeUrl, customApiKey,
    analyze, rate, 
    piiThreats, confirmPiiOverride, clearPii
  } = useAiStore();

  const { history } = useDiagnosticsStore();
  const [showVault, setShowVault] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showBridgeSettings, setShowBridgeSettings] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleRate = (direction: 'up' | 'down') => {
    rate(direction);
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(direction === 'up' ? 'medium' : 'heavy');
    }
  };

  const handleAnalyze = () => {
    let latestProbeResults = undefined;
    if (history.length > 0) {
        latestProbeResults = history[0].results;
    }
    
    if (latestProbeResults) {
        useAiStore.getState().setProbeData(latestProbeResults);
    }

    analyze(language);
  };

  // Generate Preview of the Payload for Transparency
  const getPayloadPreview = () => {
    const strategiesContext = STRATEGIES.map(s => ({
        id: s.id,
        name: s.name[language] || s.name['en'],
        command: s.command
    }));
    
    const sysInstructionShort = `You are "The Network Navigator"... Context: ${JSON.stringify(strategiesContext).substring(0, 50)}...`;

    return JSON.stringify({
        model: "gemini-3-flash-preview",
        auth: customApiKey ? "YOUR_PRIVATE_KEY (Injected by SDK)" : "PUBLIC_POOL",
        transport: useBridge ? "Cloudflare Bridge" : "Direct Uplink (Browser -> Google)",
        payload: {
            contents: [{ parts: [{ text: input || "User Input..." }] }],
            config: {
                systemInstruction: sysInstructionShort,
                responseSchema: "{...}"
            }
        }
    }, null, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      
      {showVault && <PrivacyVault onClose={() => setShowVault(false)} />}

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-cyber-800 to-fuchsia-900/30 p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
        
        {/* Status Pills */}
        <div className="absolute top-4 right-8 flex flex-col items-end gap-1">
           <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${useBridge ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                {useBridge ? 'BRIDGE' : 'DIRECT'}
              </span>
           </div>
           {customApiKey && (
             <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500/70">
               <Lock size={8} /> PRIVATE KEY
             </div>
           )}
        </div>

        <div className="relative flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-3 rounded-2xl shadow-xl">
            <Music className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {t('ai_title')}
              <Sparkles size={16} className="text-fuchsia-400" />
            </h3>
            <p className="text-indigo-200/60 text-[11px] font-medium">{t('ai_desc')}</p>
          </div>
        </div>

        {/* NETPROBE DASHBOARD INTEGRATION */}
        <div className="mb-6">
           <NetProbeDashboard />
        </div>

        {/* PII GUARD WARNING */}
        {piiThreats.length > 0 && (
          <div className="mb-4 bg-red-900/20 border border-red-500/50 p-4 rounded-2xl animate-in slide-in-from-top-2">
             <div className="flex items-center gap-2 mb-2 text-red-200 font-bold text-xs uppercase tracking-widest">
               <ShieldAlert size={14} className="text-red-500" />
               Privacy Guard Active
             </div>
             <p className="text-[11px] text-red-200/80 mb-3">
               The system intercepted potential sensitive data in your request.
             </p>
             <div className="space-y-1 mb-4">
                {piiThreats.map((t, idx) => (
                  <div key={idx} className="bg-red-950/50 px-2 py-1 rounded text-[10px] font-mono text-red-300 flex justify-between">
                     <span>{t.type}</span>
                     <span className="opacity-50">*******</span> 
                  </div>
                ))}
             </div>
             <div className="flex gap-3">
                <button onClick={clearPii} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold text-gray-300 transition-colors">
                  Edit Request
                </button>
                <button onClick={() => { confirmPiiOverride(); handleAnalyze(); }} className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Send Anyway
                </button>
             </div>
          </div>
        )}

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai_placeholder')}
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none font-medium placeholder-gray-600"
          />
          
          <div className="mt-4 flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                  loading ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98]'
                }`}
              >
                {loading ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
                {loading ? t('ai_thinking') : t('ai_btn')}
              </button>
              
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={`w-14 rounded-2xl flex items-center justify-center border transition-all ${
                    showDebug ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-black/20 border-cyber-700 text-gray-500 hover:text-gray-300'
                }`}
                title="Inspect Payload"
              >
                 <FileJson size={20} />
              </button>
          </div>

          <div className="flex justify-center mt-3">
             <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">
                <Info size={10} />
                {t('ai_powered_by')}
             </div>
          </div>
        </div>

        {/* PAYLOAD INSPECTOR (Transparency Mode) */}
        {showDebug && (
            <div className="mt-4 animate-in slide-in-from-top-2">
                <div className="bg-black/80 rounded-2xl border border-indigo-500/30 p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent"></div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <Eye size={12} />
                            PAYLOAD INSPECTOR (GLASS PIPELINE)
                        </span>
                        <CopyButton text={getPayloadPreview()} className="p-1 h-6 w-6" />
                    </div>
                    <pre className="text-[10px] font-mono text-green-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[200px] custom-scrollbar">
                        {getPayloadPreview()}
                    </pre>
                    <div className="mt-2 text-[9px] text-gray-500 font-mono">
                        * This JSON is exactly what leaves your browser. No hidden telemetry.
                    </div>
                </div>
            </div>
        )}

        {/* SETTINGS / VAULT BUTTON */}
        <button 
          onClick={() => setShowVault(true)}
          className="mt-6 flex items-center justify-center w-full gap-2 text-[10px] font-black text-indigo-300/40 hover:text-amber-400 uppercase tracking-[0.2em] transition-colors py-2 group"
        >
          <Lock size={12} className="group-hover:text-amber-400" />
          OPEN PRIVACY VAULT
        </button>
        
        {/* BRIDGE SETTINGS (Hidden by default, for advanced users) */}
        {showBridgeSettings && (
          <div className="mt-4 p-5 bg-black/60 rounded-3xl border border-indigo-500/20 animate-in slide-in-from-top-2">
            <input 
              type="text"
              value={bridgeUrl}
              onChange={(e) => useAiStore.getState().setBridgeSettings(useBridge, e.target.value)}
              placeholder={t('bridge_url_placeholder')}
              className="w-full bg-cyber-900 border border-cyber-700 rounded-xl p-3 text-xs text-white mb-4 focus:outline-none focus:border-indigo-500"
            />
            
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2">
                <Code size={14} />
                {t('bridge_setup_title')} (SECURE MODE)
              </h5>
              <div className="bg-black/80 p-4 rounded-2xl border border-cyber-700 font-mono text-[10px] text-gray-400 relative overflow-hidden">
                <pre className="overflow-x-auto whitespace-pre">{WORKER_CODE_TEMPLATE}</pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={WORKER_CODE_TEMPLATE} className="p-1.5 bg-cyber-800" />
                </div>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setShowBridgeSettings(!showBridgeSettings)}
          className="flex items-center gap-2 text-[10px] font-black text-indigo-300/20 hover:text-indigo-300 uppercase tracking-[0.2em] mx-auto mt-4"
        >
          <Settings size={10} />
          {showBridgeSettings ? "HIDE CONFIG" : "BRIDGE CONFIG"}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-xs text-red-200 text-center animate-in fade-in">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div ref={resultRef} className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-cyber-800 border border-cyber-700 p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="bg-cyber-900/50 p-3 rounded-2xl border border-cyber-700">
                {result.platform === 'ios' && <Smartphone className="text-purple-400" size={24} />}
                {result.platform === 'android' && <Bot className="text-green-400" size={24} />}
                {result.platform === 'pc' && <Monitor className="text-blue-400" size={24} />}
                {result.platform === 'linux' && <Terminal className="text-teal-400" size={24} />}
              </div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('ai_result_title')}</h4>
            </div>
            
            <p className="text-indigo-100 text-sm leading-relaxed mb-8 italic bg-indigo-500/5 p-5 rounded-3xl border-l-4 border-indigo-500">
              "{result.explanation}"
            </p>

            <div className="space-y-4 mb-8">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start group">
                   <div className="bg-indigo-600/20 text-indigo-400 text-[10px] font-black w-6 h-6 rounded-xl flex items-center justify-center shrink-0 shadow-lg">{i+1}</div>
                   <p className="text-xs text-gray-300 leading-relaxed font-medium mt-1">{step}</p>
                </div>
              ))}
            </div>

            {result.command && (
              <div className="space-y-3 mb-8">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('command_preview')}</span>
                <div className="bg-black/60 p-5 rounded-2xl border border-cyber-700 font-mono text-xs text-green-400 break-all relative group">
                  {result.command}
                  <div className="absolute top-2 right-2">
                    <CopyButton text={result.command} className="bg-cyber-800" />
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-cyber-700 pt-8 mt-4">
              {!rated ? (
                <div className="flex flex-col items-center gap-5">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t('feedback_rate_title')}</span>
                  <div className="flex gap-6">
                    <button onClick={() => handleRate('up')} className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 hover:bg-green-500 hover:text-white transition-all"><ThumbsUp size={22} /></button>
                    <button onClick={() => handleRate('down')} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all"><ThumbsDown size={22} /></button>
                  </div>
                </div>
              ) : (
                <div className="text-center animate-in zoom-in">
                  <p className="text-cyber-accent text-sm font-black flex items-center justify-center gap-2"><Check size={18} />{t('feedback_thanks')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
