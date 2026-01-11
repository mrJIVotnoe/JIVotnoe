import React from 'react';
import { DNS_SERVERS } from '../../../data';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';

export const DnsConfig: React.FC = () => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <p className="text-yellow-200 text-sm">
          <b>{t('dns_warning')}</b> {t('dns_warning_text')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {DNS_SERVERS.map((dns) => (
          <div key={dns.name} className="bg-cyber-800 p-4 rounded-xl border border-cyber-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={18} className="text-blue-400" />
                <span className="font-bold text-gray-200">{dns.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  dns.type === 'security' ? 'bg-green-900 text-green-300' : 
                  dns.type === 'privacy' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'
                }`}>
                  {dns.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400">{dns.description[language]}</p>
            </div>
            
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded border border-cyber-700">
                <span className="font-mono text-sm text-gray-300">{dns.primary}</span>
                <CopyButton text={dns.primary} className="p-1 h-6 w-6 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};