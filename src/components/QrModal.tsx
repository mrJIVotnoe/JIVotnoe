import React from 'react';
import { X, Activity } from 'lucide-react';
import { useLanguage } from '../features/localization/LanguageContext';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&bgcolor=1e293b&color=10b981`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cyber-800 border-2 border-cyber-accent/30 p-8 rounded-[2.5rem] max-w-sm w-full relative shadow-[0_0_60px_rgba(16,185,129,0.2)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-accent to-transparent"></div>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 z-10">
          <X size={24} />
        </button>
        <div className="text-center relative">
          <div className="flex justify-center mb-6"><Activity className="text-cyber-accent" size={40} /></div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{t('app_title')}</h3>
          <p className="text-cyber-400 font-mono text-[10px] mb-10 uppercase tracking-[0.2em]">{t('subtitle')}</p>
          <div className="bg-white p-6 rounded-[2rem] inline-block shadow-2xl transition-transform hover:scale-[1.02] duration-300">
            <img src={qrUrl} alt="QR Code" className="w-52 h-52" />
          </div>
          <p className="mt-8 text-xs text-gray-500 font-mono uppercase tracking-widest">{t('share_cta')}</p>
        </div>
      </div>
    </div>
  );
};