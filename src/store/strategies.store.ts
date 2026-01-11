import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StrategyType } from '../types';

interface StrategiesState {
  selectedStrategyId: StrategyType;
  customSni: string;
  setStrategyId: (id: StrategyType) => void;
  setCustomSni: (sni: string) => void;
}

export const useStrategiesStore = create<StrategiesState>()(
  persist(
    (set) => ({
      selectedStrategyId: StrategyType.SHUTDOWN_OZON,
      customSni: '',
      
      setStrategyId: (id) => set({ selectedStrategyId: id }),
      setCustomSni: (sni) => set({ customSni: sni }),
    }),
    {
      name: 'byedpi-strategies',
      storage: createJSONStorage(() => localStorage),
    }
  )
);