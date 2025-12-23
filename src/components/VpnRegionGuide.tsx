import React from 'react';
import { Globe, Shield, Smartphone, Monitor, Lock, Puzzle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const VpnRegionGuide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-900/40 to-cyber-800 p-6 rounded-xl border border-purple-800/50">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Globe className="text-purple-400" />
          {t('vpn_intro_title')}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {t('vpn_intro_desc')}
        </p>
      </div>

      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Monitor className="text-blue-400" />
          {t('tab_pc_settings')}
        </h3>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900/20 to-black/30 p-4 rounded-lg border border-blue-800/30">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Puzzle className="text-blue-400" size={18} />
              {t('vpn_method_1')}
            </h4>
            <p className="text-xs text-gray-300">{t('vpn_method_1_desc')}</p>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border border-cyber-700">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="text-purple-500" size={18} />
              {t('vpn_method_2')}
            </h4>
            <p className="text-xs text-gray-300">{t('vpn_method_2_desc')}</p>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border border-cyber-700">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="text-orange-500" size={18} />
              {t('vpn_method_3')}
            </h4>
            <p className="text-xs text-gray-300">{t('vpn_method_3_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};