import React from 'react';
import { STRATEGIES } from '../data';
import { StrategyType } from '../types';
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { useLanguage } from '../LanguageContext';

interface StrategySelectorProps {
  selectedId: StrategyType;
  onSelect: (id: StrategyType) => void;
  showCommandPreview?: boolean;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ 
  selectedId, 
  onSelect, 
  showCommandPreview = true 
}) => {
  const { t, language } = useLanguage();
  const currentStrategy = STRATEGIES.find(s => s.id === selectedId) || STRATEGIES[0];
  
  // Dynamic SNI based on language
  const localizedSni = t('local_sni_example');
  
  // Replace the domain in the command string dynamically
  // Search for the domain after -n flag and swap it
  const getLocalizedCommand = (command: string) => {
    return command.replace(/-n [^\s]+/, `-n ${localizedSni}`);
  };

  const currentCommand = getLocalizedCommand(currentStrategy.command);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STRATEGIES.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onSelect(strategy.id)}
            className={`flex flex-col p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden ${
              selectedId === strategy.id
                ? 'bg-cyber-800 border-cyber-accent shadow-lg shadow-cyber-accent/10'
                : 'bg-cyber-900 border-cyber-700 hover:border-cyber-500'
            }`}
          >
            {strategy.recommended && (
              <div className="absolute top-0 right-0 bg-cyber-accent text-cyber-900 text-xs font-bold px-2 py-1 rounded-bl-lg">
                {t('recommended_badge')}
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              {strategy.id === StrategyType.TELEGRAM_FIX ? (
                <AlertTriangle size={20} className="text-yellow-500" />
              ) : (
                <Shield size={20} className={selectedId === strategy.id ? 'text-cyber-accent' : 'text-gray-400'} />
              )}
              <span className="font-bold text-gray-100">{strategy.name[language] || strategy.name['en']}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{strategy.description[language] || strategy.description['en']}</p>
            <div className="mt-auto flex gap-2 flex-wrap">
              {strategy.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-xs bg-cyber-700 text-gray-300">
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
          <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-green-400 break-all relative group">
            {currentCommand}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={currentCommand} />
            </div>
          </div>
          
          <p className="mt-4 text-sm text-gray-400">
            <span className="text-cyber-accent font-bold">{t('analyst_tip')}</span> {t('analyst_tip_text')}
          </p>

          {selectedId === StrategyType.SHUTDOWN_OZON && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded flex gap-3 items-start">
              <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-100">
                <span className="font-bold">{t('too_hard')}</span>
                <p className="mt-1 opacity-80">
                  {t('too_hard_desc')}
                </p>
                <div className="mt-2 flex items-center gap-2 bg-black/40 px-2 py-1 rounded border border-blue-800/30 w-fit">
                   <code className="text-xs font-mono text-green-300">-o1 -r-5+se -n {localizedSni}</code>
                   <CopyButton text={`-o1 -r-5+se -n ${localizedSni}`} className="p-1 h-6 w-6" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};