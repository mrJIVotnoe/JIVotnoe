
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { analyzeIssue, AiAnalysisResult } from '../features/ai/services/aiService';
import { Language } from '../types';
import { ProbeResult } from '../core/engine/probe';
import { DEFAULT_BRIDGE_URL } from '../config/constants';
import { scanForPii, PiiThreat } from '../features/ai/utils/piiGuard';

interface AiState {
  // --- VOLATILE STATE (RAM ONLY) ---
  // These values are NEVER saved to disk
  input: string;
  loading: boolean;
  result: AiAnalysisResult | null;
  error: string | null;
  rated: 'up' | 'down' | null;
  probeData: ProbeResult[] | null;
  customApiKey: string; // The User's Key (RAM ONLY)
  piiThreats: PiiThreat[];
  piiOverride: boolean;

  // --- PERSISTENT STATE (DISK) ---
  // Safe settings that contain no secrets
  useBridge: boolean;
  bridgeUrl: string;
  
  // Actions
  setInput: (text: string) => void;
  setBridgeSettings: (useBridge: boolean, url: string) => void;
  mountSessionKey: (apiKey: string) => void; // "Mount" instead of "Save"
  setProbeData: (data: ProbeResult[]) => void;
  analyze: (language: Language, overrideInput?: string) => Promise<void>;
  confirmPiiOverride: () => void;
  clearPii: () => void;
  rate: (direction: 'up' | 'down') => void;
  reset: () => void;
  destroySession: () => void; // Wipe RAM
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      // Init Volatile
      input: '',
      loading: false,
      result: null,
      error: null,
      rated: null,
      probeData: null,
      customApiKey: '',
      piiThreats: [],
      piiOverride: false,

      // Init Persistent
      useBridge: true,
      bridgeUrl: DEFAULT_BRIDGE_URL,

      setInput: (input) => {
        set({ input, piiThreats: [], piiOverride: false }); 
      },
      
      setBridgeSettings: (useBridge, bridgeUrl) => set({ useBridge, bridgeUrl }),

      // CRITICAL: This puts the key into RAM, but the `partialize` below ensures it never hits disk
      mountSessionKey: (apiKey) => set({ customApiKey: apiKey }),

      setProbeData: (data) => set({ probeData: data }),

      confirmPiiOverride: () => set({ piiOverride: true }),

      clearPii: () => set({ piiThreats: [], piiOverride: false }),

      analyze: async (language, overrideInput) => {
        const { input, useBridge, bridgeUrl, probeData, customApiKey, piiOverride } = get();
        const finalInput = overrideInput || input;

        // 1. PII Guard Check
        if (!piiOverride) {
            const threats = scanForPii(finalInput);
            if (threats.length > 0) {
                set({ piiThreats: threats });
                return;
            }
        }

        if (!finalInput.trim() && !probeData) {
          set({ error: 'Input required or run Diagnostics first' });
          return;
        }

        const effectiveInput = finalInput.trim() || "Analyze the attached Network Diagnostic Report.";

        set({ loading: true, error: null, result: null, rated: null });

        try {
          const data = await analyzeIssue({
            input: effectiveInput,
            language,
            useBridge,
            bridgeUrl,
            probeData: probeData || undefined,
            apiKey: customApiKey // Passed from RAM
          });
          set({ result: data, piiThreats: [], piiOverride: false });
        } catch (err: any) {
          console.error("AI Store Error:", err);
          set({ error: err.message || "Unknown error" });
        } finally {
          set({ loading: false });
        }
      },

      rate: (direction) => set({ rated: direction }),
      
      reset: () => set({ result: null, error: null, input: '', probeData: null, piiThreats: [] }),

      destroySession: () => set({ 
          input: '', 
          result: null, 
          probeData: null, 
          customApiKey: '', // WIPE KEY
          piiThreats: []
      })
    }),
    {
      name: 'byedpi-ai-settings',
      storage: createJSONStorage(() => localStorage),
      // SECURITY FILTER: Only persist non-sensitive settings
      partialize: (state) => ({ 
        useBridge: state.useBridge, 
        bridgeUrl: state.bridgeUrl,
        // customApiKey is EXCLUDED intentionally
      }),
    }
  )
);

import { useAppStore } from './app.store';
