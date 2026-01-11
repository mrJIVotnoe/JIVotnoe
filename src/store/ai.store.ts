import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { analyzeIssue, AiAnalysisResult } from '../features/ai/services/aiService';
import { Language } from '../types';

interface AiState {
  // State
  input: string;
  loading: boolean;
  result: AiAnalysisResult | null;
  error: string | null;
  rated: 'up' | 'down' | null;
  
  // Settings (Persisted)
  useBridge: boolean;
  bridgeUrl: string;

  // Actions
  setInput: (text: string) => void;
  setBridgeSettings: (useBridge: boolean, url: string) => void;
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
      useBridge: false,
      bridgeUrl: '',

      setInput: (input) => set({ input }),
      
      setBridgeSettings: (useBridge, bridgeUrl) => set({ useBridge, bridgeUrl }),

      analyze: async (language, overrideInput) => {
        const { input, useBridge, bridgeUrl } = get();
        const finalInput = overrideInput || input;

        if (!finalInput.trim()) {
          set({ error: 'Input required' }); // Basic check, UI handles localization usually
          return;
        }

        set({ loading: true, error: null, result: null, rated: null });

        try {
          const data = await analyzeIssue({
            input: finalInput,
            language,
            useBridge,
            bridgeUrl
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
      
      reset: () => set({ result: null, error: null, input: '' })
    }),
    {
      name: 'byedpi-ai-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        useBridge: state.useBridge, 
        bridgeUrl: state.bridgeUrl 
      }), // Only persist settings, not the chat session
    }
  )
);