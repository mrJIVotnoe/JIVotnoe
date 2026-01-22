
import React, { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles, Zap, Smartphone, Monitor, ThumbsUp, ThumbsDown, Settings, ChevronDown, ChevronUp, Code, Check, Music, Tv, Terminal, Info, Activity, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { useTelegram } from '../../telegram/TelegramContext';
import { WORKER_CODE_TEMPLATE } from '../../../config/constants';
import { useAiStore } from '../../../store/ai.store';
import { runNetworkDiagnostics, ProbeResult } from '../../../core/engine/probe';

export const AiAnalyst: React.FC = () => {
  const { t, language } = useLanguage();
  const { webApp } = useTelegram();
  
  const { 
    input, setInput, 
    loading, result, error, rated, probeData,
    useBridge, bridgeUrl, setBridgeSettings, setProbeData,
    analyze, rate 
  } = useAiStore();

  const [showBridgeSettings, setShowBridgeSettings] = useState(false);
  const [is scanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
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

  const runDiagnostics = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setProbeData([]); // Clear previous
    
    try {
      const results = await runNetworkDiagnostics((completed, total) => {
        setScanProgress((completed / total) * 100);
      });
      setProbeData(results);
      
      // Auto-analyze after scan if no input
      if (!input) {
         analyze(language, "Analyze my network diagnostic results.");
      }
    } catch (e) {
      console.error("Probe failed", e);
    } finally {
      setIsScanning(false);
    }
  };

  const DiagnosticSummary = ({ data }: { data: ProbeResult[] }) => {
    const blocked = data.filter(d => d.status === 'BLOCKED' || d.status === 'TIMEOUT').length;
    const available = data.filter(d => d.status === 'AVAILABLE').length;
    const health = Math.round((available / data.length) * 100);
    
    let healthColor = 'text-green-400';
    if (health < 70) healthColor = 'text-yellow-400';
    if (health < 40) healthColor = 'text-red-400';

    return (
      <div className="bg-black/30 p-4 rounded-xl border border-cyber-700 mb-4 animate-in fade-in">
         <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">NetProbe Status</span>
            <span className={`text-sm font-black ${healthColor}`}>{health}% HEALTH</span>
         </div>
         <div className="flex gap-2 mb-3">
            <div className="h-1 bg-cyber-700 flex-1 rounded-full overflow-hidden">
               <div className={`h-full ${healthColor}`} style={{ width: `${health}%` }}></div>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-2">
            {data.map(item => (
               <div key={item.target.id} className="flex items-center justify-between text-[10px] bg-cyber-900/50 p-2 rounded border border-cyber-700/50">
                  <span className="text-gray-300 truncate pr-2">{item.target.name}</span>
                  {item.status === 'AVAILABLE' ? (
                     <span className="text-green-400 font-bold flex items-center gap-1"><ShieldCheck size={10}/> OK</span>
                  ) : (
                     <span className="text-red-400 font-bold flex items-center gap-1"><ShieldAlert size={10}/> {item.status === 'TIMEOUT' ? 'T/O' : 'BLK'}</span>
                  )}
               </div>
            ))}
         </div>
      </div>
    );
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

        {/* PROBE UI */}
        <div className="mb-4">
           {scanning ? (
              <div className="bg-black/40 p-4 rounded-2xl border border-cyber-700 flex flex-col items-center justify-center h-24">
                 <Activity className="text-cyber-accent animate-pulse mb-2" size={24} />
                 <span className="text-[10px] text-cyber-accent font-black uppercase tracking-widest animate-pulse">SCANNING NETWORK... {Math.round(scanProgress)}%</span>
              </div>
           ) : probeData ? (
              <DiagnosticSummary data={probeData} />
           ) : (
              <button 
                onClick={runDiagnostics}
                className="w-full py-3 bg-cyber-900/50 hover:bg-cyber-900 border border-cyber-600 border-dashed rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-cyber-accent transition-all group"
              >
                 <Activity size={16} className="group-hover:rotate-180 transition-transform duration-700"/>
                 RUN SYSTEM DIAGNOSTICS (NETPROBE)
              </button>
           )}
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai_placeholder')}
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none font-medium placeholder-gray-600"
          />
          <button
            onClick={() => analyze(language)}
            disabled={loading || scanning}
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
