import React from 'react';
import { sections } from '../../config/sections';
import { useTelegram } from '../hooks/useTelegram';

export function Navigation() {
  const { webApp } = useTelegram();

  const handleNavClick = (id: string) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-[88px] z-10 mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar-in-extension py-2 bg-cyber-900/95 backdrop-blur-md border-b border-cyber-700/50">
      <div className="flex gap-2 min-w-max mx-auto max-w-4xl">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => handleNavClick(section.id)}
            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-cyber-800 border border-cyber-700 text-gray-400 hover:text-white hover:border-cyber-500 hover:bg-cyber-700 transition-all active:scale-95"
          >
            {section.shortTitle || section.title}
          </button>
        ))}
      </div>
    </nav>
  );
}