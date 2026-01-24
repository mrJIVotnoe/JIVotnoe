
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { runNetworkDiagnostics, ProbeResult } from '../core/engine/probe';

export interface DiagnosticSession {
  id: string;
  timestamp: number;
  results: ProbeResult[];
  overallHealth: number; // 0-100
}

interface DiagnosticsState {
  history: DiagnosticSession[];
  isScanning: boolean;
  progress: number; // 0-100
  lastScan: number | null;

  runScan: () => Promise<void>;
  clearHistory: () => void;
}

const MAX_HISTORY_LENGTH = 10;

export const useDiagnosticsStore = create<DiagnosticsState>()(
  persist(
    (set, get) => ({
      history: [],
      isScanning: false,
      progress: 0,
      lastScan: null,

      runScan: async () => {
        if (get().isScanning) return;

        set({ isScanning: true, progress: 0 });

        try {
          const results = await runNetworkDiagnostics((completed, total) => {
            set({ progress: (completed / total) * 100 });
          });

          // Calculate Health Score
          const available = results.filter(r => r.status === 'AVAILABLE').length;
          const total = results.length;
          const health = total > 0 ? Math.round((available / total) * 100) : 0;

          const session: DiagnosticSession = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            results,
            overallHealth: health
          };

          set((state) => {
            const newHistory = [session, ...state.history].slice(0, MAX_HISTORY_LENGTH);
            return {
              history: newHistory,
              lastScan: session.timestamp,
              isScanning: false,
              progress: 100
            };
          });

        } catch (error) {
          console.error("NetProbe failed:", error);
          set({ isScanning: false, progress: 0 });
        }
      },

      clearHistory: () => set({ history: [], lastScan: null })
    }),
    {
      name: 'byedpi-netprobe-history',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        history: state.history, 
        lastScan: state.lastScan 
      }),
    }
  )
);
