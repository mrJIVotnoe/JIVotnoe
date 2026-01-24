import React from 'react';
import { sections } from '../../config/sections';
import { useTelegram } from '../hooks/useTelegram';
import { useAppStore } from '../../store/app.store';

export function Navigation() {
  const { webApp } = useTelegram();
  const activeSectionId = useAppStore((state) => state.activeSectionId);
  const setActiveSectionId = useAppStore((state) => state.setActiveSectionId);

  const handleNavClick = (id: string) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
    setActiveSectionId(id);
  };

  return (
    <nav className="sticky top-[88px] z-10 mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar-in-extension py-2 bg-cyber-900/95 backdrop-blur-md border-b border-cyber-700/50">
      <div className="flex gap-2 min-w-max mx-auto max-w-4xl">
        {sections.map(section => {
          const isActive = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 border ${
                isActive 
                  ? 'bg-cyber-accent text-cyber-900 border-cyber-accent shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-cyber-800 border-cyber-700 text-gray-400 hover:text-white hover:border-cyber-500'
              }`}
            >
              {section.shortTitle || section.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}