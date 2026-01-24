
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
  probeData?: ProbeResult[]; // Optional diagnostic data
}

export const analyzeIssue = async ({ input, language, useBridge, bridgeUrl, probeData }: AnalyzeParams): Promise<AiAnalysisResult> => {
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

  // Format probe data for the AI if available
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

  // Updated Persona: The Research Navigator
  const systemInstruction = `You are "The Network Navigator", a research system analyzing network availability.
    
    Goal: Analyze user symptoms + diagnostic data to output a Research Result & Strategy.
    
    Context:
    - Core Strategies: ${JSON.stringify(strategiesContext)}
    - User Diagnostics: ${diagnosticReport}
    
    Hierarchy of Truth:
    1. Diagnostic Report (If available) - ABSOLUTE FACT.
    2. User Input - Subjective Experience.
    3. Your Internal Knowledge - General Theory.
    
    Tone: Scientific, Objective, Explanatory. Use terms like "Research Result", "Hypothesis", "Traffic Analysis".
    
    Rules:
    - IMPORTANT: Reply ONLY in ${targetLang} language.
    - If user asks for guaranteed unblock -> Explain that results are "Conditional based on network analysis".
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
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
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
