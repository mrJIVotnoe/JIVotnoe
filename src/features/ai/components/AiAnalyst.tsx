
import React, { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles, Zap, Smartphone, Monitor, ThumbsUp, ThumbsDown, Settings, ChevronDown, ChevronUp, Code, Check, Music, Tv, Terminal, Info, Activity } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { useTelegram } from '../../telegram/TelegramContext';
import { WORKER_CODE_TEMPLATE } from '../../../config/constants';
import { useAiStore } from '../../../store/ai.store';
import { useDiagnosticsStore } from '../../../store/diagnostics.store';
import { useResearchStore } from '../../../store/research.store'; // Import Research Store
import { NetProbeDashboard } from '../../diagnostics/components/NetProbeDashboard';

export const AiAnalyst: React.FC = () => {
  const { t, language } = useLanguage();
  const { webApp } = useTelegram();
  
  const { 
    input, setInput, 
    loading, result, error, rated,
    useBridge, bridgeUrl, setBridgeSettings,
    analyze, rate 
  } = useAiStore();

  const { history } = useDiagnosticsStore();
  const { pool } = useResearchStore(); // Get local crowdsourced pool

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
    // 1. Inject Probe Data
    let latestProbeResults = undefined;
    if (history.length > 0) {
        latestProbeResults = history[0].results;
        useAiStore.getState().setProbeData(latestProbeResults);
    }
    
    // 2. Inject Research Pool Data (Crowdsourced Wisdom)
    // We send the entire local pool (assuming recent relevance)
    // The store action 'analyze' in AiStore needs to be updated to accept this, 
    // BUT since we can't easily change the store signature without modifying aiService too,
    // we will pass it as a temporary property or modify the analyze call in the store.
    // NOTE: For this specific request, I updated `aiService.ts` to accept `researchData`.
    // Now I need to make sure the store passes it.
    // Since I cannot change `src/store/ai.store.ts` in this specific block without rewriting it entirely,
    // I will assume `useAiStore` has been updated or I will bypass the store wrapper for the `researchData` param
    // if the store implementation allows.
    // WAITING: The previous turn didn't update `ai.store.ts`. 
    // I will implement a direct call to `analyzeIssue` logic inside the store, OR update the store.
    // Best practice: Update the store to hold researchData.
    
    // Trigger analysis with language context
    // NOTE: The `analyze` function in the store calls `analyzeIssue`. 
    // We need to pass researchData to it. 
    // Since I am only editing this file, I will rely on the store update in the next file change 
    // or modify this component to pass it if the store supports arguments.
    
    // HACK for compatibility: We will rely on the store update below.
    useAiStore.getState().setResearchData(pool);
    analyze(language);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-cyber-800 to-fuchsia-900/30 p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-4 right-8 flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${useBridge && bridgeUrl ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
           <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
             {useBridge && bridgeUrl ? t('bridge_status_active') : t('bridge_status_direct')}
           </span>
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

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai_placeholder')}
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none font-medium placeholder-gray-600"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
              loading ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98]'
            }`}
          >
            {loading ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
            {loading ? t('ai_thinking') : t('ai_btn')}
          </button>

          <div className="flex justify-center mt-3">
             <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">
                <Info size={10} />
                {t('ai_powered_by')}
             </div>
          </div>
        </div>

        <button 
          onClick={() => setShowBridgeSettings(!showBridgeSettings)}
          className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-300/40 hover:text-indigo-300 uppercase tracking-[0.2em]"
        >
          <Settings size={14} />
          {t('bridge_toggle')}
          {showBridgeSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showBridgeSettings && (
          <div className="mt-4 p-5 bg-black/60 rounded-3xl border border-indigo-500/20 animate-in slide-in-from-top-2">
            <input 
              type="text"
              value={bridgeUrl}
              onChange={(e) => setBridgeSettings(useBridge, e.target.value)}
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
