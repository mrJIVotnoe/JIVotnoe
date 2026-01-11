import React from 'react';
import { STRATEGIES } from '../data';
import { StrategyType } from '../../../types';
import { Shield, CheckCircle, AlertTriangle, Info, Split, EyeOff, ShieldAlert, Cpu } from 'lucide-react';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { useLanguage } from '../../localization/LanguageContext';
import { Tooltip } from '../../../shared/ui/Tooltip';
import { useStrategiesStore } from '../../../store/strategies.store';

interface StrategySelectorProps {
  showCommandPreview?: boolean;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ 
  showCommandPreview = true,
}) => {
  const { t, language } = useLanguage();
  
  // Use Global Store
  const { selectedStrategyId, customSni, setStrategyId } = useStrategiesStore();

  const currentStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];
  const effectiveSni = customSni || t('local_sni_example');
  
  const getLocalizedCommand = (command: string) => {
    if (command.includes('{{SNI}}')) {
      return command.replace('{{SNI}}', effectiveSni);
    }
    return command.replace(/-n [^\s]+/, `-n ${effectiveSni}`);
  };

  const currentCommand = getLocalizedCommand(currentStrategy.command);
  const ozonSniCommand = `-o1 -r-5+se -n ${effectiveSni}`;

  // Helper to render command anatomy with tooltips
  const renderCommandAnatomy = (cmd: string) => {
    const parts = cmd.split(' ');
    
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
          } else if (part.includes('.')) { 
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STRATEGIES.map((strategy) => (
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
            <div className="flex items-center gap-2 mb-2">
              {strategy.id === StrategyType.TELEGRAM_FIX ? (
                <AlertTriangle size={20} className="text-yellow-500" />
              ) : (
                <Shield size={20} className={selectedStrategyId === strategy.id ? 'text-cyber-accent' : 'text-gray-400 group-hover:text-gray-300'} />
              )}
              <span className="font-bold text-gray-100">{strategy.name[language] || strategy.name['en']}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3 leading-snug">{strategy.description[language] || strategy.description['en']}</p>
            <div className="mt-auto flex gap-2 flex-wrap">
              {strategy.tags.map(tag => (
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