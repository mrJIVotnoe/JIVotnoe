import React, { Suspense, useEffect, useMemo } from 'react';
import { Layout } from './Layout';
import { ErrorBoundary } from './ErrorBoundary';
import { sections } from '../config/sections';
import { Section } from '../shared/ui/Section';
import { Loader2 } from 'lucide-react';
import { PROJECT_CANON } from '../core';
import { useAppStore } from '../store/app.store';

export function App() {
  const activeSectionId = useAppStore((state) => state.activeSectionId);

  useEffect(() => {
    console.log(
      `%c PROJECT CANON BOOT SEQUENCE — CONFIRMED `,
      'background: #0f172a; color: #10b981; font-weight: bold; padding: 4px; border: 1px solid #10b981;'
    );
  }, []);

  const ActivePage = useMemo(() => {
    const section = sections.find(s => s.id === activeSectionId) || sections[0];
    return (
      <Section id={section.id} title={section.title}>
        <section.Component />
      </Section>
    );
  }, [activeSectionId]);

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center py-20 text-cyber-500 gap-4 min-h-[50vh]">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Switching Module...</p>
            </div>
          }
        >
          <div key={activeSectionId} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {ActivePage}
          </div>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}