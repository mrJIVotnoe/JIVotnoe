import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className = ''
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-cyber-700 rounded-2xl overflow-hidden bg-cyber-800/30 transition-all ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-cyber-700/30 transition-colors"
      >
        <div className="font-bold text-gray-200 text-sm">{title}</div>
        <div className={`text-cyber-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 text-sm text-gray-400 border-t border-cyber-700/50 mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
