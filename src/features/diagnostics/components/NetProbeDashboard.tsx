
import React from 'react';
import { Activity, Play, Clock, ShieldCheck, ShieldAlert, Wifi, AlertTriangle, RotateCcw, BarChart3, Network, Server, Gamepad2, MessageCircle, Video, Search, Brain } from 'lucide-react';
import { useDiagnosticsStore, DiagnosticSession } from '../../../store/diagnostics.store';
import { DIAGNOSTIC_TARGETS, DiagnosticTarget } from '../../../core/knowledge/diagnosis.targets';
import { useLanguage } from '../../localization/LanguageContext';

const MAX_HISTORY_LENGTH = 10;

export const NetProbeDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { history, isScanning, progress, runScan, lastScan, clearHistory } = useDiagnosticsStore();
  
  const latestSession = history[0];

  // Helper to get status history for a specific target ID
  const getTargetHistory = (targetId: string) => {
    return history.map(session => {
      const result = session.results.find(r => r.target.id === targetId);
      return result ? result.status : 'UNKNOWN';
    }).reverse(); // Oldest to newest
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'BLOCKED': return 'bg-red-500';
      case 'TIMEOUT': return 'bg-yellow-500';
      default: return 'bg-gray-700';
    }
  };

  const getCategoryIcon = (category: DiagnosticTarget['category']) => {
    switch (category) {
      case 'VIDEO': return <Video size={14} className="text-gray-400" />;
      case 'SOCIAL': return <Network size={14} className="text-gray-400" />;
      case 'MESSAGING': return <MessageCircle size={14} className="text-gray-400" />;
      case 'GAMING': return <Gamepad2 size={14} className="text-gray-400" />;
      case 'AI': return <Brain size={14} className="text-gray-400" />;
      case 'SEARCH': return <Search size={14} className="text-gray-400" />;
      case 'INFRASTRUCTURE': return <Server size={14} className="text-blue-400" />;
      default: return <Activity size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-cyber-900 border border-cyber-700 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Activity size={120} />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border border-cyber-600 transition-all ${isScanning ? 'bg-cyber-accent/20 animate-pulse' : 'bg-cyber-800'}`}>
            <Activity className={isScanning ? 'text-cyber-accent animate-spin-slow' : 'text-blue-400'} size={24} />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-2">
              {t('netprobe_title')} <span className="text-[10px] bg-cyber-800 px-1.5 py-0.5 rounded text-gray-400 font-mono">v1.3</span>
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              {isScanning ? (
                <span className="text-cyber-accent">{t('netprobe_scanning')} {Math.round(progress)}%</span>
              ) : (
                <>
                  <span>{t('netprobe_last')}: {lastScan ? new Date(lastScan).toLocaleTimeString() : '---'}</span>
                  {history.length > 0 && <span className="text-gray-600">• {history.length} {t('netprobe_samples')}</span>}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
           {history.length > 0 && !isScanning && (
             <button 
               onClick={clearHistory}
               className="p-3 bg-cyber-800 hover:bg-red-900/20 text-gray-500 hover:text-red-400 rounded-xl transition-colors border border-transparent hover:border-red-900/30"
               title="Clear History"
             >
               <RotateCcw size={18} />
             </button>
           )}
           <button
             onClick={() => runScan()}
             disabled={isScanning}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
               isScanning 
                 ? 'bg-cyber-800 text-gray-500 cursor-not-allowed' 
                 : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
             }`}
           >
             {isScanning ? t('netprobe_probing') : t('netprobe_run')}
             {!isScanning && <Play size={14} fill="currentColor" />}
           </button>
        </div>
      </div>

      {/* Progress Bar (Active) */}
      {isScanning && (
        <div className="h-1 bg-cyber-800 w-full mb-6 rounded-full overflow-hidden">
          <div className="h-full bg-cyber-accent transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {DIAGNOSTIC_TARGETS.map((target) => {
          const result = latestSession?.results.find(r => r.target.id === target.id);
          const statusHistory = getTargetHistory(target.id);
          
          let statusText = t('netprobe_status_waiting');
          let latency = 0;
          let colorClass = "text-gray-500";
          let borderClass = "border-cyber-700/50";
          
          if (result) {
            if (result.status === 'AVAILABLE') {
              statusText = t('netprobe_status_online');
              colorClass = "text-green-400";
              latency = result.latency;
              if (target.category === 'INFRASTRUCTURE') borderClass = "border-blue-500/30";
            } else if (result.status === 'TIMEOUT') {
              statusText = t('netprobe_status_timeout');
              colorClass = "text-yellow-400";
            } else {
              statusText = t('netprobe_status_blocked');
              colorClass = "text-red-400";
            }
          }

          return (
            <div key={target.id} className={`bg-black/20 border ${borderClass} rounded-xl p-3 flex flex-col justify-between hover:border-cyber-600 transition-colors`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(target.category)}
                  <span className={`font-bold text-xs ${target.category === 'INFRASTRUCTURE' ? 'text-blue-200' : 'text-gray-200'}`}>
                    {target.name}
                  </span>
                </div>
                <div className={`text-[10px] font-black ${colorClass} bg-cyber-900/80 px-2 py-0.5 rounded border border-cyber-700/50`}>
                  {result ? `${latency}ms` : '---'}
                </div>
              </div>

              <div className="flex items-end justify-between">
                 {/* Historical Sparkline */}
                 <div className="flex gap-1 h-3 items-end">
                    {Array.from({ length: MAX_HISTORY_LENGTH }).map((_, idx) => {
                       // Map history to fixed slots (right aligned)
                       const historyIndex = statusHistory.length - 1 - (MAX_HISTORY_LENGTH - 1 - idx);
                       const status = historyIndex >= 0 ? statusHistory[historyIndex] : null;
                       
                       let bg = "bg-cyber-800";
                       let height = "h-1";
                       
                       if (status) {
                         bg = getStatusColor(status);
                         height = status === 'AVAILABLE' ? 'h-3' : 'h-1.5';
                       }

                       return (
                         <div key={idx} className={`w-1.5 rounded-sm ${bg} ${height} transition-all`}></div>
                       );
                    })}
                 </div>
                 
                 <span className={`text-[9px] font-mono font-bold ${colorClass}`}>
                   {statusText}
                 </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend / Stats */}
      {latestSession && (
        <div className="mt-6 pt-4 border-t border-cyber-700 flex justify-between items-center text-[10px] text-gray-500 font-mono">
           <div className="flex gap-3">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> {t('netprobe_legend_ok')}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-sm"></div> {t('netprobe_legend_lag')}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> {t('netprobe_legend_err')}</span>
           </div>
           <div className="flex items-center gap-2">
              <BarChart3 size={12} />
              HEALTH: <span className={latestSession.overallHealth > 80 ? 'text-green-400' : 'text-orange-400'}>{latestSession.overallHealth}%</span>
           </div>
        </div>
      )}
    </div>
  );
};
