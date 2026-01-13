
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StrategyType } from '../types';
import { decide, analyzeEnvironment, DecisionInput, DecisionResult, AnalysisResult, NetworkSymptom } from '../core';

interface StrategiesState {
  selectedStrategyId: StrategyType;
  customSni: string;
  analysisMode: boolean;
  currentAnalysis: AnalysisResult | null;
  
  setStrategyId: (id: StrategyType) => void;
  setCustomSni: (sni: string) => void;
  
  // Core Adapter
  getStrategyFromCore: (input: DecisionInput) => DecisionResult;
  runAnalysis: (input: DecisionInput) => void;
}

export const useStrategiesStore = create<StrategiesState>()(
  persist(
    (set, get) => ({
      selectedStrategyId: StrategyType.SHUTDOWN_OZON,
      customSni: '',
      analysisMode: false,
      currentAnalysis: null,
      
      setStrategyId: (id) => set({ selectedStrategyId: id }),
      setCustomSni: (sni) => set({ customSni: sni }),

      // Core Adapter Implementation
      getStrategyFromCore: (input: DecisionInput) => {
        // Enforce Analysis-Only for Browser or specific symptoms
        if (input.platform === 'browser' || input.symptoms.includes(NetworkSymptom.TELEGRAM_FAIL)) {
           const analysis = analyzeEnvironment(input);
           return {
             strategyId: 'unsupported',
             confidence: 1,
             restrictionClass: analysis.restrictionClass,
             explanation: analysis.explanation,
             warnings: [],
             tags: [],
             analysis: analysis
           } as any; 
        }
        return decide(input);
      },

      runAnalysis: (input: DecisionInput) => {
        if (input.platform === 'browser' || input.symptoms.includes(NetworkSymptom.TELEGRAM_FAIL)) {
          const result = analyzeEnvironment(input);
          set({ analysisMode: true, currentAnalysis: result });
        } else {
          set({ analysisMode: false, currentAnalysis: null });
        }
      }
    }),
    {
      name: 'byedpi-strategies',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        selectedStrategyId: state.selectedStrategyId, 
        customSni: state.customSni 
      }), 
    }
  )
);
