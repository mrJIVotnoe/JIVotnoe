
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { STRATEGIES } from '../../strategies/data';
import { Language } from '../../../types';
import { ProbeResult } from '../../../core/engine/probe';
import { useStrategiesStore } from '../../../store/strategies.store';
import { AiProviderType } from '../../../store/ai.store';

export interface AiAnalysisResult {
  platform: 'android' | 'pc' | 'ios' | 'linux';
  explanation: string;
  command?: string;
  steps: string[];
}

interface AnalyzeParams {
  input: string;
  language: Language;
  useBridge: boolean;
  bridgeUrl: string;
  probeData?: ProbeResult[]; 
  apiKey?: string;
  provider: AiProviderType;
  customBaseUrl?: string;
  customModelName?: string;
}

// Configuration Map for Providers
const PROVIDER_CONFIG: Record<string, { baseUrl: string, model: string }> = {
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  deepseek: { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' }, // DeepSeek is OpenAI Compatible
  grok: { baseUrl: 'https://api.x.ai/v1', model: 'grok-beta' }, // xAI is OpenAI Compatible
  custom: { baseUrl: '', model: '' } // User defined
};

export const analyzeIssue = async ({ 
  input, language, useBridge, bridgeUrl, probeData, apiKey, provider, customBaseUrl, customModelName 
}: AnalyzeParams): Promise<AiAnalysisResult> => {
  
  // --- 1. CONTEXT PREPARATION ---
  const { activeDriver } = useStrategiesStore.getState();
  
  let strategiesContext = STRATEGIES.map(s => ({
    id: s.id,
    name: s.name[language] || s.name['en'],
    command: s.command
  }));

  let driverContext = "";
  if (activeDriver) {
    const customStrategies = activeDriver.strategies.map(s => ({
        id: s.id,
        name: typeof s.name === 'string' ? s.name : s.name['en'],
        command: s.command,
        note: "CUSTOM_DRIVER_STRATEGY"
    }));
    strategiesContext = [...strategiesContext, ...customStrategies as any];
    driverContext = `ACTIVE DRIVER LOADED: ${activeDriver.name} (v${activeDriver.manifest_version}). Prioritize these strategies if they fit the symptoms.`;
  }

  const langNames: Record<string, string> = {
     'ru': 'Russian', 'en': 'English', 'uk': 'Ukrainian', 
     'zh': 'Chinese', 'tr': 'Turkish', 'es': 'Spanish'
  };
  const targetLang = langNames[language] || 'Russian';

  let diagnosticReport = "No network scan performed.";
  if (probeData && probeData.length > 0) {
    const grouped = probeData.reduce((acc, r) => {
      acc[r.target.category] = acc[r.target.category] || [];
      acc[r.target.category].push(`${r.target.name}: ${r.status} (${r.latency}ms)`);
      return acc;
    }, {} as Record<string, string[]>);
    
    diagnosticReport = "NETWORK DIAGNOSTIC REPORT (TRUSTED SOURCE):\n" + JSON.stringify(grouped, null, 2);
  }

  const securityContext = apiKey 
    ? "SECURITY_CONTEXT: TRUSTED_PRIVATE_KEY_MOUNTED. You are operating as the user's personal Neural Sentinel. Prioritize privacy and safety."
    : "SECURITY_CONTEXT: PUBLIC_GATEWAY.";

  // Common System Prompt
  const systemInstruction = `You are "The Network Navigator", a research system analyzing network availability.
    ${securityContext}
    
    Goal: Analyze user symptoms + diagnostic data to output a Research Result & Strategy.
    Diagnostic Data: ${diagnosticReport}
    Core Strategies: ${JSON.stringify(strategiesContext)}
    ${driverContext}
    
    Rules: 
    1. Reply ONLY in ${targetLang}. 
    2. Output strictly JSON.
    3. Do NOT hallucinate arguments not present in Core Strategies.
    4. If diagnostic data contradicts user text, trust diagnostic data.
    
    Output Format (JSON Only):
    {
      "platform": "android" | "pc" | "ios" | "linux",
      "explanation": "string",
      "command": "string (optional)",
      "steps": ["string"]
    }`;

  // --- 2. EXECUTION SWITCH ---

  // A. GOOGLE GEMINI (Native SDK)
  if (provider === 'gemini') {
    if (useBridge && bridgeUrl && !apiKey) {
        // Bridge Mode (Cloudflare Worker)
        const cleanBridgeUrl = bridgeUrl.trim().replace(/\/$/, '');
        const fullUrl = `${cleanBridgeUrl}/v1beta/models/gemini-3-flash-preview:generateContent`;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING, enum: ['android', 'pc', 'ios', 'linux'] },
              explanation: { type: Type.STRING },
              command: { type: Type.STRING, description: "Only if applicable (PC/Linux)" },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["platform", "explanation", "steps"]
        };

        const res = await fetch(fullUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema
            }
          })
        });

        if (!res.ok) throw new Error(`Bridge Error: ${res.status}`);
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty Bridge Response");
        return JSON.parse(text);
    } else {
        // Direct Mode (SDK)
        const finalKey = apiKey || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
        if (!finalKey) throw new Error("No API Key provided for Gemini.");

        const ai = new GoogleGenAI({ apiKey: finalKey });
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING, enum: ['android', 'pc', 'ios', 'linux'] },
              explanation: { type: Type.STRING },
              command: { type: Type.STRING, description: "Only if applicable (PC/Linux)" },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["platform", "explanation", "steps"]
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema
          }
        });
        
        if (!response.text) throw new Error("Empty AI Response");
        return JSON.parse(response.text);
    }
  }

  // B. OPENAI COMPATIBLE (DeepSeek, Grok, ChatGPT)
  if (['openai', 'deepseek', 'grok', 'custom'].includes(provider)) {
      if (!apiKey && provider !== 'custom') throw new Error(`API Key required for ${provider.toUpperCase()}`);
      
      const config = PROVIDER_CONFIG[provider];
      const baseUrl = customBaseUrl || config.baseUrl;
      const model = customModelName || config.model;

      if (!baseUrl) throw new Error("Base URL not configured for custom provider.");

      const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

      // Construct OpenAI-format payload
      const payload = {
          model: model,
          messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: input }
          ],
          response_format: { type: "json_object" }, // Force JSON
          temperature: 0.7
      };

      const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
      });

      if (!res.ok) {
          const errText = await res.text();
          throw new Error(`${provider.toUpperCase()} Error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      
      if (!content) throw new Error("Empty response from provider");
      
      try {
          return JSON.parse(content);
      } catch (e) {
          console.error("JSON Parse Error", content);
          throw new Error("Provider did not return valid JSON");
      }
  }

  throw new Error(`Provider ${provider} not implemented.`);
};
