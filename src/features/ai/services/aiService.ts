
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { STRATEGIES } from '../../strategies/data';
import { Language } from '../../../types';
import { ProbeResult } from '../../../core/engine/probe';

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
  apiKey?: string; // User-provided RAM-only key
}

export const analyzeIssue = async ({ input, language, useBridge, bridgeUrl, probeData, apiKey }: AnalyzeParams): Promise<AiAnalysisResult> => {
  // 1. Prepare Context
  const strategiesContext = STRATEGIES.map(s => ({
    id: s.id,
    name: s.name[language] || s.name['en'],
    command: s.command
  }));

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

  // 2. Define Schema
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

  // Security & Persona Injection
  // We explicitly tell the AI it is running in a Trusted/Private context (if Key provided)
  const securityContext = apiKey 
    ? "SECURITY_CONTEXT: TRUSTED_PRIVATE_KEY_MOUNTED. You are operating as the user's personal Neural Sentinel. Prioritize privacy and safety."
    : "SECURITY_CONTEXT: PUBLIC_GATEWAY.";

  const systemInstruction = `You are "The Network Navigator", a research system analyzing network availability.
    ${securityContext}
    
    Goal: Analyze user symptoms + diagnostic data to output a Research Result & Strategy.
    Diagnostic Data: ${diagnosticReport}
    Core Strategies: ${JSON.stringify(strategiesContext)}
    
    Rules: 
    1. Reply ONLY in ${targetLang}. 
    2. Output strictly JSON.
    3. Do NOT hallucinate arguments not present in Core Strategies.
    4. If diagnostic data contradicts user text, trust diagnostic data.
    `;

  // 3. Execute Request
  
  // LOGIC: If a custom API key is present, we FORCE direct mode (scenario B) to respect sovereignty,
  // even if bridge is toggled on in UI settings. 
  
  if (useBridge && bridgeUrl && !apiKey) {
    // PUBLIC BRIDGE MODE
    const cleanBridgeUrl = bridgeUrl.trim().replace(/\/$/, '');
    const fullUrl = `${cleanBridgeUrl}/v1beta/models/gemini-3-flash-preview:generateContent`;
    
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      })
    });

    if (!res.ok) throw new Error(`Bridge Error: ${res.status}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty Bridge Response");
    return JSON.parse(text);

  } else {
    // SOVEREIGN DIRECT MODE
    const finalKey = apiKey || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

    if (!finalKey) {
      throw new Error("No API Key provided. Please enter a key in the Privacy Vault.");
    }

    const ai = new GoogleGenAI({ apiKey: finalKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: input,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });
    
    if (!response.text) throw new Error("Empty AI Response");
    return JSON.parse(response.text);
  }
};
