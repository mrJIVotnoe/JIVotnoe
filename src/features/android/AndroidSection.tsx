import React from 'react';
import { AndroidGuide } from '../../components/AndroidGuide';
import { StrategySelector } from '../strategies/components/StrategySelector';
import { DnsConfig } from '../../components/DnsConfig';
import { AndroidTvGuide } from '../../components/AndroidTvGuide';
import { SniScanner } from '../strategies/components/SniScanner';
import { Music } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { useStrategiesStore } from '../../store/strategies.store';

export default function AndroidSection() {
  const { t } = useLanguage();
  const { setCustomSni } = useStrategiesStore();

  return (
    <div className="space-y-12">
      <AndroidGuide />
      
      <div className="bg-cyber-800 p-6 md:p-8 rounded-[2rem] border border-cyber-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
        <div className="flex items-center gap-3 mb-8">
          <Music size={24} className="text-blue-400" />
          <h4 className="text-white font-black text-sm uppercase tracking-widest">{t('select_strategy')}</h4>
        </div>

        {/* SNI Scanner Integration */}
        <div className="mb-6">
          <SniScanner onSelect={setCustomSni} />
        </div>

        <StrategySelector />
      </div>

      <DnsConfig />
      <AndroidTvGuide />
    </div>
  );
}