
import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, Activity } from 'lucide-react';
import { SniReputation } from '../../../core/engine/reputation';

interface SniReputationCardProps {
  reputation: SniReputation;
}

export const SniReputationCard: React.FC<SniReputationCardProps> = ({ reputation }) => {
  
  const getConfig = () => {
    switch (reputation.level) {
      case 'HIGH':
        return {
          bg: 'bg-green-900/20',
          border: 'border-green-500/30',
          text: 'text-green-300',
          icon: <ShieldCheck size={18} className="text-green-400" />,
          label: 'TRUSTED INFRASTRUCTURE'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-500/30',
          text: 'text-yellow-200',
          icon: <Activity size={18} className="text-yellow-400" />,
          label: 'STANDARD RELIABILITY'
        };
      case 'LOW':
        return {
          bg: 'bg-orange-900/20',
          border: 'border-orange-500/30',
          text: 'text-orange-200',
          icon: <AlertTriangle size={18} className="text-orange-400" />,
          label: 'RISK DETECTED'
        };
      case 'CRITICAL':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-500/30',
          text: 'text-red-200',
          icon: <ShieldAlert size={18} className="text-red-500" />,
          label: 'DO NOT USE (BLOCKED)'
        };
      default:
        return {
          bg: 'bg-gray-800/50',
          border: 'border-gray-600/30',
          text: 'text-gray-400',
          icon: <HelpCircle size={18} className="text-gray-500" />,
          label: 'UNKNOWN DOMAIN'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`mt-3 p-3 rounded-xl border ${config.bg} ${config.border} flex items-start gap-3 animate-in slide-in-from-top-2 duration-300`}>
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div>
        <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${config.text}`}>
          {config.label}
        </div>
        <p className={`text-xs ${config.text} opacity-90 leading-relaxed`}>
          {reputation.note}
        </p>
      </div>
    </div>
  );
};
