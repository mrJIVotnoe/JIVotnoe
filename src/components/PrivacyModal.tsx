import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cyber-900 border border-cyber-700 p-8 rounded-[2rem] max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6 flex items-center gap-3">
           <ShieldAlert className="text-cyber-accent" size={32} />
           <h2 className="text-2xl font-black text-white">{t('privacy_title')}</h2>
        </div>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
           <section>
              <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                <FileText size={16} className="text-blue-400" />
                {t('disclaimer_header')}
              </h3>
              <p>{t('disclaimer_text')}</p>
           </section>

           <section>
              <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                <Lock size={16} className="text-green-400" />
                {t('privacy_header')}
              </h3>
              <ul className="list-disc list-inside space-y-2 opacity-90">
                <li>{t('privacy_point_1')}</li>
                <li>{t('privacy_point_2')}</li>
                <li>{t('privacy_point_3')}</li>
              </ul>
           </section>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 rounded-xl font-black uppercase tracking-widest text-xs transition-colors"
        >
          {t('close_btn')}
        </button>
      </div>
    </div>
  );
};