import React, { ReactNode } from 'react';

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-16 animate-in fade-in duration-700">
      {/* Visual Separator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-700 to-transparent"></div>
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight text-center px-4 border border-cyber-700 py-2 rounded-2xl bg-cyber-900/50 backdrop-blur-sm">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-700 to-transparent"></div>
      </div>
      
      {children}
    </section>
  );
}
