import React, { Suspense, useEffect } from 'react';
import { Layout } from './Layout';
import { ErrorBoundary } from './ErrorBoundary';
import { sections } from '../config/sections';
import { Section } from '../shared/ui/Section';
import { Loader2 } from 'lucide-react';
import { PROJECT_CANON } from '../core';

export function App() {
  useEffect(() => {
    // Runtime Boot Sequence Confirmation
    console.log(
      `%c PROJECT CANON BOOT SEQUENCE — CONFIRMED `,
      'background: #0f172a; color: #10b981; font-weight: bold; padding: 4px; border: 1px solid #10b981;'
    );
    console.log(`Version: ${PROJECT_CANON.version}`);
    console.log(`Role: ${PROJECT_CANON.role}`);
    console.log(`Historical Anchor: ${PROJECT_CANON.historicalAnchor}`);
  }, []);

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center py-20 text-cyber-500 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Loading Modules...</p>
            </div>
          }
        >
          {sections.map(section => (
            <Section key={section.id} id={section.id} title={section.title}>
              <section.Component />
            </Section>
          ))}
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}