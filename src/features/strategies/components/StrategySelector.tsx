
import React, { useEffect, useState } from 'react';
import { StrategyType } from '../../../types';
import { AppTarget } from '../../../core/domain/enums';
import { Shield, CheckCircle, AlertTriangle, Info, Split, EyeOff, ShieldAlert, Cpu, Activity, Lock, Edit3, FlaskConical, Database } from 'lucide-react';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { useLanguage } from '../../localization/LanguageContext';
import { Tooltip } from '../../../shared/ui/Tooltip';
import { useStrategiesStore } from '../../../store/strategies.store';
import { Core } from '../../../core';
import { SniReputationCard } from './SniReputationCard';
import { TheLab } from './TheLab';
import { parseHexPayload } from '../../../core/utils/hexParser';

interface StrategySelectorProps {
  showCommandPreview?: boolean;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ 
  showCommandPreview = true,
}) => {
  const { t, language } = useLanguage();
  
  // Use Global Store
  const { selectedStrategyId, customSni, setStrategyId, setCustomSni, runAnalysis, analysisMode, currentAnalysis, getAllStrategies, activeDriver } = useStrategiesStore();
  const [showLab, setShowLab] = useState(false);
  
  // Local state for reputation
  const [reputation, setReputation] = useState(Core.checkSni(customSni || ''));

  // Get strategies (Static + Custom)
  const allStrategies = getAllStrategies();

  // Trigger analysis on mount
  useEffect(() => {
    runAnalysis({ 
      platform: 'browser', 
      symptoms: [], 
      targetApp: AppTarget.UNKNOWN 
    });
  }, [runAnalysis]);

  // Update reputation when SNI changes
  useEffect(() => {
    if (customSni) {
      setReputation(Core.checkSni(customSni));
    }
  }, [customSni]);

  const currentStrategy = allStrategies.find(s => s.id === selectedStrategyId) || allStrategies[0];
  const effectiveSni = customSni || t('local_sni_example');
  
  const getLocalizedCommand = (command: string) => {
    if (command.includes('{{SNI}}')) {
      return command.replace('{{SNI}}', effectiveSni);
    }
    return command.replace(/-n [^\s]+/, `-n ${effectiveSni}`);
  };

  const currentCommand = getLocalizedCommand(currentStrategy.command);
  const ozonSniCommand = `-o1 -r-5+se -n ${effectiveSni}`;

  // Helper to render command anatomy with tooltips AND Hex Parsing
  const renderCommandAnatomy = (cmd: string) => {
    // Advanced split that preserves quoted strings and handles equals signs
    // This is a simplified regex for display purposes
    const parts = cmd.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    
    return (
      <div className="flex flex-wrap gap-2 font-mono text-sm mt-2">
        {parts.map((part, idx) => {
          let description = "";
          let color = "text-gray-300";
          let icon = null;

          if (part.startsWith('-o')) {
            description = t('cmd_desc_o');
            color = "text-orange-400 font-bold";
            icon = <Split size={12} />;
          } else if (part.startsWith('-r')) {
            description = t('cmd_desc_r');
            color = "text-blue-400";
          } else if (part.startsWith('-n')) {
            description = t('cmd_desc_n'); 
            color = "text-green-400 font-bold";
            icon = <EyeOff size={12} />;
          } else if (part.includes('.') && !part.includes('=')) { 
            description = t('cmd_desc_domain');
            color = "text-green-300 underline decoration-dashed";
          } else if (part.startsWith('-a')) {
            description = t('cmd_desc_a');
            color = "text-purple-400";
          } else if (part.startsWith('-f')) {
             description = t('cmd_desc_f');
             color = "text-red-400";
             icon = <ShieldAlert size={12} />;
          } else if (part.startsWith('-At')) {
             description = t('cmd_desc_At');
             color = "text-cyan-400";
          } else if (part.includes('--fake-data') || part.includes('--fake-from-hex')) {
             // HEX PARSING LOGIC
             // Extract hex value. Handle both --arg=val and space separated (though here we process parts)
             // Simulating check if part itself contains the hex or if it's a key=value
             const rawHex = part.includes('=') ? part.split('=')[1] : null;
             
             // If part is just the flag, look ahead? 
             // For simplicity in this display logic, we assume --arg=hex format for drivers usually
             if (rawHex) {
                const analysis = parseHexPayload(rawHex.replace(/['"]/g, ''));
                description = `${analysis.protocol}: ${analysis.details}`;
                color = "text-fuchsia-400";
                icon = <Database size={12} />;
             } else {
                description = "Binary Payload";
                color = "text-fuchsia-400";
             }
          }

          return (
            <Tooltip key={idx} content={description || t('cmd_desc_generic')}>
              <span className={`cursor-help hover:bg-white/10 rounded px-1 transition-colors flex items-center gap-1 ${color}`}>
                {icon}
                {part}
              </span>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  if (analysisMode && currentAnalysis) {
    return (
      <div className="space-y-6">
        {/* Analysis Mode View (Unchanged) */}
        <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock size={64} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-500/20 p-3 rounded-2xl">
              <Activity className="text-amber-400 animate-pulse" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Analysis Mode</h3>
              <p className="text-amber-200/60 text-xs font-mono">EXECUTION DISABLED</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-xl border border-amber-500/20">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Diagnosis</div>
              <div className="text-lg font-black text-amber-100">{String(currentAnalysis.restrictionClass)}</div>
              <div className="text-xs text-amber-300/80 font-mono mt-1">Confidence: {(currentAnalysis.confidence * 100).toFixed(0)}%</div>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-amber-500/20">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Findings</div>
              <ul className="space-y-2">
                {currentAnalysis.explanation.map((exp, i) => (
                  <li key={i} className="flex gap-3 text-xs text-gray-300">
                    <span className="text-amber-500 font-bold">::</span>
                    {typeof exp === 'string' ? exp : JSON.stringify(exp)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showLab && <TheLab onClose={() => setShowLab(false)} />}
      
      {/* SNI Input & Reputation System */}
      <div className="bg-black/20 p-4 rounded-2xl border border-cyber-700/50">
         <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Edit3 size={12} />
                Target Domain (SNI)
            </label>
            <button 
                onClick={() => setShowLab(true)}
                className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors ${activeDriver ? 'text-amber-400 bg-amber-900/20 border border-amber-500/30' : 'text-gray-500 hover:text-white'}`}
            >
                <FlaskConical size={10} />
                {activeDriver ? "LAB ACTIVE" : "OPEN LAB"}
            </button>
         </div>
         <div className="relative">
            <input 
              type="text" 
              value={customSni}
              onChange={(e) => setCustomSni(e.target.value)}
              placeholder={t('local_sni_example')}
              className="w-full bg-cyber-900 border border-cyber-600 rounded-xl py-2 pl-3 pr-3 text-sm text-green-300 font-mono focus:outline-none focus:border-green-500 transition-all placeholder-gray-600"
            />
         </div>
         {customSni && <SniReputationCard reputation={reputation} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allStrategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => setStrategyId(strategy.id)}
            className={`flex flex-col p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden group ${
              selectedStrategyId === strategy.id
                ? 'bg-cyber-800 border-cyber-accent shadow-lg shadow-cyber-accent/10'
                : 'bg-cyber-900 border-cyber-700 hover:border-cyber-500 hover:bg-cyber-800'
            }`}
          >
            {strategy.recommended && (
              <div className="absolute top-0 right-0 bg-cyber-accent text-cyber-900 text-[10px] font-black uppercase px-2 py-1 rounded-bl-lg">
                {t('recommended_badge')}
              </div>
            )}
            {/* Show LAB Badge for custom strategies */}
            {strategy.tags.includes('LAB') && (
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded-bl-lg">
                LAB
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              {strategy.id === StrategyType.TELEGRAM_FIX ? (
                <AlertTriangle size={20} className="text-yellow-500" />
              ) : strategy.tags.includes('LAB') ? (
                <FlaskConical size={20} className="text-amber-500" />
              ) : (
                <Shield size={20} className={selectedStrategyId === strategy.id ? 'text-cyber-accent' : 'text-gray-400 group-hover:text-gray-300'} />
              )}
              
              <span className="font-bold text-gray-100 truncate w-full">
                  {typeof strategy.name === 'string' ? strategy.name : (strategy.name[language] || strategy.name['en'])}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3 leading-snug line-clamp-2">
                {typeof strategy.description === 'string' ? strategy.description : (strategy.description[language] || strategy.description['en'])}
            </p>
            <div className="mt-auto flex gap-2 flex-wrap">
              {strategy.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-700 text-gray-300 border border-cyber-600">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {showCommandPreview && (
        <div className="bg-black/30 rounded-xl p-6 border border-cyber-700 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <CheckCircle className="text-cyber-accent" size={20} />
            {t('command_preview')}
          </h3>
          
          <div className="bg-black/50 p-4 rounded-lg relative group shadow-inner border border-white/5">
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <CopyButton text={currentCommand} />
            </div>
            {renderCommandAnatomy(currentCommand)}
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
            <Cpu size={12} />
            <span>{t('command_tooltip_hint')}</span>
          </div>
          
          <p className="mt-4 text-sm text-gray-400">
            <span className="text-cyber-accent font-bold">{t('analyst_tip')}</span> {t('analyst_tip_text')}
          </p>

          {selectedStrategyId === StrategyType.SHUTDOWN_OZON && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg flex gap-3 items-start">
              <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-100">
                <span className="font-bold">{t('too_hard')}</span>
                <p className="mt-1 opacity-80 text-xs leading-relaxed">
                  {t('too_hard_desc')}
                </p>
                <div className="mt-3 flex items-center gap-2 bg-black/40 pl-3 pr-1 py-1 rounded border border-blue-800/30 w-fit max-w-full">
                   <code className="text-xs font-mono text-green-300 truncate">{ozonSniCommand}</code>
                   <CopyButton text={ozonSniCommand} className="p-1 h-6 w-6 shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
