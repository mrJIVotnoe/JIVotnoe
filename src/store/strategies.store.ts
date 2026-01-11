import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StrategyType } from '../types';
import { decide, DecisionInput, DecisionResult } from '../core';

interface StrategiesState {
  selectedStrategyId: StrategyType;
  customSni: string;
  setStrategyId: (id: StrategyType) => void;
  setCustomSni: (sni: string) => void;
  
  // Core Adapter
  getStrategyFromCore: (input: DecisionInput) => DecisionResult;
}

export const useStrategiesStore = create<StrategiesState>()(
  persist(
    (set) => ({
      selectedStrategyId: StrategyType.SHUTDOWN_OZON,
      customSni: '',
      
      setStrategyId: (id) => set({ selectedStrategyId: id }),
      setCustomSni: (sni) => set({ customSni: sni }),

      // Core Adapter Implementation
      getStrategyFromCore: (input: DecisionInput) => {
        return decide(input);
      }
    }),
    {
      name: 'byedpi-strategies',
      storage: createJSONStorage(() => localStorage),
    }
  )
);