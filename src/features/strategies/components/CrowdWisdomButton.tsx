
import React, { useState } from 'react';
import { Sparkles, Check, Wifi, Share2 } from 'lucide-react';
import { useResearchStore } from '../../../store/research.store';
import { useStrategiesStore } from '../../../store/strategies.store';
import { useTelegram } from '../../telegram/TelegramContext';
import { useLanguage } from '../../localization/LanguageContext';

interface CrowdWisdomButtonProps {
  command: string;
}

export const CrowdWisdomButton: React.FC<CrowdWisdomButtonProps> = ({ command }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { contribute } = useResearchStore();
  const { selectedStrategyId } = useStrategiesStore();
  const { platform, webApp } = useTelegram();
  const { t } = useLanguage();

  const handleContribute = () => {
    if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred('heavy');
    
    setStatus('sending');
    
    // Simulate network delay for "Transmission" effect
    setTimeout(() => {
      contribute({
        strategyId: selectedStrategyId,
        commandArgs: command,
        region: 'RU', // In real app, detect via IP or User Selection
        platform: platform
      });
      setStatus('sent');
      
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 800);
  };

  if (status === 'sent') {
    return (
      <button disabled className="w-full mt-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest animate-in fade-in zoom-in duration-300">
        <Check size={16} />
        <span>Wisdom Shared</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleContribute}
      disabled={status === 'sending'}
      className={`w-full mt-4 relative overflow-hidden group transition-all duration-300 ${
        status === 'sending' 
          ? 'bg-cyber-800 border-amber-500/30 text-amber-500/50' 
          : 'bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 hover:border-amber-500/50'
      } py-3 rounded-xl border`}
    >
      <div className={`flex items-center justify-center gap-2 transition-all ${status === 'sending' ? 'opacity-0' : 'opacity-100'}`}>
        <Sparkles size={16} className="text-amber-400 group-hover:animate-pulse" />
        <span className="font-bold text-xs text-gray-300 group-hover:text-white uppercase tracking-widest">
          It Works! Share Config
        </span>
      </div>

      {/* Loading State */}
      {status === 'sending' && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-amber-400">
          <Wifi size={16} className="animate-ping" />
          <span className="text-[10px] font-mono font-bold">TRANSMITTING...</span>
        </div>
      )}
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </button>
  );
};
