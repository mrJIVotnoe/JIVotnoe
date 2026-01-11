import React, { useState, useMemo } from 'react';
import { ShieldCheck, Network, AlertCircle, Globe, Landmark, ShoppingBag, Hash, Filter } from 'lucide-react';
import { CopyButton } from '../shared/ui/CopyButton';
import { REGIONAL_DATA } from '../data';
import { WhitelistEntry } from '../types';
import { useLanguage } from '../features/localization/LanguageContext';

export const Whitelist: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => {
    const langToRegion: Record<string, string> = { 'ru': 'ru', 'kk': 'kz', 'uz': 'uz', 'zh': 'cn', 'fa': 'ir' };
    return langToRegion[language] || 'global';
  });

  const currentRegion = useMemo(() => 
    REGIONAL_DATA.find(r => r.id === selectedRegionId) || REGIONAL_DATA[0], 
  [selectedRegionId]);

  const CategoryIcon = ({ category }: { category: WhitelistEntry['category'] }) => {
    switch (category) {
      case 'finance': return <Landmark size={14} className="text-emerald-400" />;
      case 'retail': return <ShoppingBag size={14} className="text-orange-400" />;
      case 'gov': return <ShieldCheck size={14} className="text-blue-400" />;
      case 'social': return <Hash size={14} className="text-purple-400" />;
      default: return <Globe size={14} className="text-gray-400" />;
    }
  };

  const renderList = (entries: WhitelistEntry[], type: 'mimicry' | 'bypass') => {
    if (entries.length === 0) return <p className="text-gray-500 text-xs italic p-4 text-center">...</p>;
    const allString = entries.map(e => e.domain).join(',');

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
             {entries.length} {type === 'mimicry' ? t('mimicry_title') : t('bypass_title')}
           </span>
           <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">{t('copy_all')}:</span>
              <CopyButton text={allString} className="p-1 h-6 w-6 bg-cyber-700" />
           </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {entries.map((entry, idx) => (
            <div key={idx} className="bg-black/30 p-3 rounded-xl border border-cyber-700/50 flex items-center justify-between group hover:border-cyber-600 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-cyber-800 p-2 rounded-lg">
                  <CategoryIcon category={entry.category} />
                </div>
                <div className="overflow-hidden">
                  <div className="font-mono text-sm text-gray-200 truncate">{entry.domain}</div>
                  {entry.note && <div className="text-[10px] text-gray-500 italic">{entry.note}</div>}
                </div>
              </div>
              <CopyButton text={entry.domain} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-emerald-900/40 to-cyber-800 p-6 rounded-2xl border border-emerald-800/50 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" />
          {t('tab_whitelist')}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">{t('whitelist_header')}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar-in-extension">
        {REGIONAL_DATA.map(region => (
          <button
            key={region.id}
            onClick={() => setSelectedRegionId(region.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all text-xs whitespace-nowrap border shadow-sm ${
              selectedRegionId === region.id ? 'bg-cyber-accent text-cyber-900 border-cyber-accent scale-105' : 'bg-cyber-800 text-gray-400 border-cyber-700 hover:border-cyber-600'
            }`}
          >
            <span className="text-lg leading-none">{region.flag}</span>
            {region.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 p-2 rounded-lg"><Network className="text-blue-400" size={20} /></div>
            <div>
              <h4 className="font-bold text-gray-100">{t('mimicry_title')}</h4>
              <p className="text-[10px] text-gray-500 uppercase font-mono">-n domain</p>
            </div>
          </div>
          <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-900/20 mb-6">
            <p className="text-xs text-blue-200/80 leading-relaxed italic">{t('mimicry_desc')}</p>
          </div>
          {renderList(currentRegion.mimicry, 'mimicry')}
        </section>

        <section className="bg-cyber-800 p-6 rounded-2xl border border-cyber-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-600/20 p-2 rounded-lg"><AlertCircle className="text-yellow-400" size={20} /></div>
            <div>
              <h4 className="font-bold text-gray-100">{t('bypass_title')}</h4>
              <p className="text-[10px] text-gray-500 uppercase font-mono">Bypass List</p>
            </div>
          </div>
          <div className="bg-yellow-900/10 p-3 rounded-lg border border-yellow-900/20 mb-6">
            <p className="text-xs text-yellow-200/80 leading-relaxed italic">{t('bypass_desc')}</p>
          </div>
          {renderList(currentRegion.bypass, 'bypass')}
        </section>
      </div>
    </div>
  );
};