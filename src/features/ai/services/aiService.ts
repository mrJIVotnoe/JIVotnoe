import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { STRATEGIES } from '../../strategies/data';
import { Language } from '../../../types';

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
}

export const analyzeIssue = async ({ input, language, useBridge, bridgeUrl }: AnalyzeParams): Promise<AiAnalysisResult> => {
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

  const systemInstruction = `You are "The Maestro of Network Neutrality", an elite engineer.
    NOTICE: The network environment has shifted as of 2026-01-10.
    Direct execution of bypass strategies is currently disabled for security analysis.
    
    Goal: Analyze user issue and explain the situation.
    Context: Strategies=${JSON.stringify(strategiesContext)}.
    Persona: Strict, analytical, objective.
    Rules:
    - IMPORTANT: Reply ONLY in ${targetLang} language.
    - If the user asks for bypass/strategies: State that the environment has changed and strategies are unreliable.
    - Provide DIAGNOSIS ONLY. Do not provide executable steps.
    - Use the phrase "Analysis-only mode enabled" in your explanation.
    - Output strictly JSON matching the schema.`;

  // 3. Execute Request
  if (useBridge && bridgeUrl) {
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
    // Direct Client Mode
    // Check for API Key existence to prevent obscure crashes for GitHub cloners
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please create a .env.local file with VITE_GEMINI_API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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