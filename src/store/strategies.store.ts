
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StrategyType } from '../types';
import { decide, analyzeEnvironment, DecisionInput, DecisionResult, AnalysisResult, NetworkSymptom } from '../core';
import { CommunityDriverManifest, CommunityStrategy } from '../core/domain/types';
import { STRATEGIES as STATIC_STRATEGIES } from '../features/strategies/data';

// Strategy can be from Static ENUM or Custom String
export type ActiveStrategyId = StrategyType | string;

interface StrategiesState {
  selectedStrategyId: ActiveStrategyId;
  customSni: string;
  analysisMode: boolean;
  currentAnalysis: AnalysisResult | null;
  
  // Community Driver State
  activeDriver: CommunityDriverManifest | null;
  
  setStrategyId: (id: ActiveStrategyId) => void;
  setCustomSni: (sni: string) => void;
  
  // Driver Actions
  importDriver: (manifest: CommunityDriverManifest) => void;
  removeDriver: () => void;
  
  // Getters
  getAllStrategies: () => any[]; // Returns mixed array
  
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
      activeDriver: null,
      
      setStrategyId: (id) => set({ selectedStrategyId: id }),
      setCustomSni: (sni) => set({ customSni: sni }),

      importDriver: (manifest) => {
        set({ activeDriver: manifest });
        // Automatically select the first strategy from the driver to give feedback
        if (manifest.strategies.length > 0) {
            set({ selectedStrategyId: manifest.strategies[0].id });
        }
      },

      removeDriver: () => {
        set({ activeDriver: null, selectedStrategyId: StrategyType.SHUTDOWN_OZON });
      },

      getAllStrategies: () => {
        const { activeDriver } = get();
        if (!activeDriver) return STATIC_STRATEGIES;

        // Map CommunityStrategy to StrategyConfig compatible shape
        const customStrategies = activeDriver.strategies.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            command: s.command,
            tags: [...s.tags, 'LAB'], // Add LAB tag
            recommended: s.recommended || false,
            source: 'COMMUNITY' // Flag for UI
        }));

        return [...customStrategies, ...STATIC_STRATEGIES];
      },

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
        customSni: state.customSni,
        activeDriver: state.activeDriver 
      }), 
    }
  )
);
