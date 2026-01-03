import React, { Suspense } from 'react';
import { Layout } from './Layout';
import { ErrorBoundary } from './ErrorBoundary';
import { sections } from '../config/sections';
import { Section } from '../shared/ui/Section';
import { Loader2 } from 'lucide-react';

export function App() {
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
