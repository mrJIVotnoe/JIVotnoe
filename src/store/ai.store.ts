
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { analyzeIssue, AiAnalysisResult } from '../features/ai/services/aiService';
import { Language } from '../types';
import { ProbeResult } from '../core/engine/probe';

interface AiState {
  // State
  input: string;
  loading: boolean;
  result: AiAnalysisResult | null;
  error: string | null;
  rated: 'up' | 'down' | null;
  probeData: ProbeResult[] | null;
  
  // Settings (Persisted)
  useBridge: boolean;
  bridgeUrl: string;

  // Actions
  setInput: (text: string) => void;
  setBridgeSettings: (useBridge: boolean, url: string) => void;
  setProbeData: (data: ProbeResult[]) => void;
  analyze: (language: Language, overrideInput?: string) => Promise<void>;
  rate: (direction: 'up' | 'down') => void;
  reset: () => void;
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      input: '',
      loading: false,
      result: null,
      error: null,
      rated: null,
      probeData: null,
      useBridge: false,
      bridgeUrl: '',

      setInput: (input) => set({ input }),
      
      setBridgeSettings: (useBridge, bridgeUrl) => set({ useBridge, bridgeUrl }),

      setProbeData: (data) => set({ probeData: data }),

      analyze: async (language, overrideInput) => {
        const { input, useBridge, bridgeUrl, probeData } = get();
        const finalInput = overrideInput || input;

        // Allow empty input if we have probe data (implied "Analyze this report")
        if (!finalInput.trim() && !probeData) {
          set({ error: 'Input required or run Diagnostics first' });
          return;
        }

        const effectiveInput = finalInput.trim() || "Analyze the attached Network Diagnostic Report and tell me what is accessible and what is blocked.";

        set({ loading: true, error: null, result: null, rated: null });

        try {
          const data = await analyzeIssue({
            input: effectiveInput,
            language,
            useBridge,
            bridgeUrl,
            probeData: probeData || undefined
          });
          set({ result: data });
        } catch (err: any) {
          console.error("AI Store Error:", err);
          set({ error: err.message || "Unknown error" });
        } finally {
          set({ loading: false });
        }
      },

      rate: (direction) => set({ rated: direction }),
      
      reset: () => set({ result: null, error: null, input: '', probeData: null })
    }),
    {
      name: 'byedpi-ai-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        useBridge: state.useBridge, 
        bridgeUrl: state.bridgeUrl 
      }),
    }
  )
);
