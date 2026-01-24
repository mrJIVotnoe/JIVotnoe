
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StrategyType } from '../types';

export interface WisdomSignal {
  id: string;
  timestamp: number;
  strategyId: string | 'custom';
  commandArgs: string;
  region: string;
  platform: string;
  successRate: number; // 1.0 for single user report
}

interface ResearchState {
  pool: WisdomSignal[];
  contribute: (signal: Omit<WisdomSignal, 'id' | 'timestamp' | 'successRate'>) => void;
  getSignalsByRegion: (region: string) => WisdomSignal[];
}

export const useResearchStore = create<ResearchState>()(
  persist(
    (set, get) => ({
      pool: [],

      contribute: (signalData) => {
        const signal: WisdomSignal = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          successRate: 1.0,
          ...signalData
        };

        set((state) => ({
          pool: [signal, ...state.pool].slice(0, 50) // Keep last 50 signals locally
        }));

        // In a real backend scenario, this would POST to the "Neural Bridge"
        console.log('[RESEARCH POOL] Signal Transmitted:', signal);
      },

      getSignalsByRegion: (region) => {
        return get().pool.filter(s => s.region === region || s.region === 'GLOBAL');
      }
    }),
    {
      name: 'byedpi-research-pool',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
