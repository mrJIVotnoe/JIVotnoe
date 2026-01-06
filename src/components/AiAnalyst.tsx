import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Zap, Smartphone, Monitor, ThumbsUp, ThumbsDown, Settings, ChevronDown, ChevronUp, Code, Check, Music, Tv, Terminal, Languages, AlertTriangle, Key } from 'lucide-react';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { useLanguage } from '../LanguageContext';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';
import { useTelegram } from '../TelegramContext';
import { Language } from '../types';

export const AiAnalyst: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { webApp } = useTelegram();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ 
    platform: 'android' | 'pc' | 'ios' | 'linux', 
    explanation: string, 
    command?: string,
    steps: string[],
    detectedLanguage?: string
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rated, setRated] = useState<'up' | 'down' | null>(null);
  const [autoSwitched, setAutoSwitched] = useState<string | null>(null);

  // --- CONFIGURATION STATE ---
  const [useBridge, setUseBridge] = useState(() => localStorage.getItem('ai_use_bridge') === 'true');
  const [bridgeUrl, setBridgeUrl] = useState(() => localStorage.getItem('ai_bridge_url') || '');
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('ai_user_api_key') || '');
  
  // Show settings if no configuration is present
  const [showSettings, setShowSettings] = useState(() => !bridgeUrl && !userApiKey);

  const resultRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('ai_use_bridge', String(useBridge));
    localStorage.setItem('ai_bridge_url', bridgeUrl);
    localStorage.setItem('ai_user_api_key', userApiKey);
  }, [useBridge, bridgeUrl, userApiKey]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const analyzeProblem = async (overrideInput?: string) => {
    const finalInput = overrideInput || input;
    if (!finalInput.trim()) {
      setError(t('ai_no_input'));
      return;
    }

    // Validation
    if (useBridge && !bridgeUrl) {
      setError("Bridge URL is missing. Please configure it in settings.");
      setShowSettings(true);
      return;
    }
    if (!useBridge && !userApiKey) {
      setError("API Key is missing. Please enter your Gemini API Key in settings.");
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRated(null);
    setAutoSwitched(null);

    try {
      // 1. Context Preparation
      const strategiesContext = STRATEGIES.map(s => ({
        id: s.id,
        name: s.name[language] || s.name['en'],
        command: s.command
      }));

      // 2. System Instruction
      const systemInstruction = `You are "The Maestro of Network Neutrality", an elite engineer.
        Goal: Analyze user issue and orchestrate a bypass solution.
        Context: Strategies=${JSON.stringify(strategiesContext)}.
        Persona: Strict but inspiring professor. Use metaphors.
        
        CRITICAL TASK: Detect the language of the user input.
        If the user writes in a specific language, you MUST respond in that SAME language.
        
        Rules:
        - If Android: Recommend ByeDPIManager.
        - If iOS: Recommend V2Box (VLESS).
        - If PC: Recommend ciadpi.exe with strategy.
        - Output strictly JSON matching the schema.`;

      let responseText = "";

      // 3. Schema Definition
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, enum: ['android', 'pc', 'ios', 'linux'] },
          explanation: { type: Type.STRING },
          command: { type: Type.STRING, description: "Only if applicable (PC/Linux)" },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          detectedLanguage: { type: Type.STRING, description: "ISO 639-1 code of user input (e.g. 'ru', 'uz', 'kk')"}
        },
        required: ["platform", "explanation", "steps"]
      };

      if (useBridge && bridgeUrl) {
        // --- BRIDGE MODE (Secure Server-Side Key) ---
        const cleanBridgeUrl = bridgeUrl.trim().replace(/\/$/, '');
        const fullUrl = `${cleanBridgeUrl}/v1beta/models/gemini-2.0-flash:generateContent`;
        
        const res = await fetch(fullUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalInput }] }],
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: responseSchema
            }
          })
        });

        if (!res.ok) {
           const errText = await res.text();
           throw new Error(`Bridge Error ${res.status}: ${errText}`);
        }
        const json = await res.json();
        responseText = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

      } else {
        // --- DIRECT MODE (Client-Side with User Key) ---
        const ai = new GoogleGenAI({ apiKey: userApiKey });
        
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash", // Use stable model
          contents: finalInput,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        });
        
        responseText = response.text || "";
      }

      if (!responseText) throw new Error("Empty AI Response");
      
      let data;
      try {
        // Clean up markdown code blocks if present (Gemini sometimes adds them despite MIME type)
        const cleanJson = responseText.replace(/```json\n|\n```/g, '').trim();
        data = JSON.parse(cleanJson);
      } catch (e) {
        console.warn("JSON Parse Failed, raw text:", responseText);
        throw new Error("Failed to parse AI response. Try again.");
      }
      
      setResult(data);

      // --- AUTO LANGUAGE SWITCHING ---
      if (data.detectedLanguage && data.detectedLanguage !== language) {
        const supportedLangs = ['ru', 'en', 'uk', 'be', 'kk', 'uz', 'az', 'ky', 'tg', 'hy', 'tk'];
        const detected = data.detectedLanguage.toLowerCase();
        
        if (supportedLangs.includes(detected)) {
          setLanguage(detected as Language);
          setAutoSwitched(detected.toUpperCase());
          if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred('medium');
        }
      }

    } catch (err: any) {
      console.error("AI ERROR:", err);
      if (err.message && err.message.includes("403")) {
         setError("Access Denied (403). Check your API Key.");
      } else if (err.message && err.message.includes("500")) {
         setError("AI Service Error (500). The model is temporarily overloaded.");
      } else {
         setError(t('ai_error') + ` (${err.message || 'Unknown'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (direction: 'up' | 'down') => {
    setRated(direction);
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(direction === 'up' ? 'medium' : 'heavy');
    }
  };

  const QuickStartCard = ({ icon: Icon, title, prompt, color }: any) => {
    const colorStyles: any = {
      blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:border-blue-400',
      green: 'border-green-500/30 bg-green-500/5 text-green-400 hover:border-green-400',
      purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 hover:border-purple-400'
    };
    return (
      <button 
        onClick={() => analyzeProblem(prompt)}
        disabled={loading}
        className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all hover:scale-[1.02] shadow-lg ${colorStyles[color]} active:scale-[0.98]`}
      >
        <div className="p-3 rounded-2xl bg-black/40"><Icon size={24} /></div>
        <span className="text-[10px] font-black uppercase tracking-tight text-center">{title}</span>
      </button>
    );
  };

  const workerCode = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Security: Inject Key on Server Side
    url.searchParams.set("key", env.API_KEY);
    const targetUrl = "https://generativelanguage.googleapis.com" + url.pathname + url.search;
    
    // Only allow specific methods/origins if needed
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    return newResponse;
  },
};`;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* Settings Panel (Collapsible) */}
      <div className={`transition-all duration-300 ${showSettings ? 'mb-6' : 'mb-0'}`}>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-[10px] font-black text-indigo-300/60 hover:text-indigo-300 uppercase tracking-[0.2em] mb-2 ml-2"
        >
          <Settings size={14} />
          {t('bridge_setup_title')}
          {showSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showSettings && (
          <div className="bg-black/60 p-5 rounded-3xl border border-indigo-500/30 animate-in slide-in-from-top-2">
            
            {/* Mode Switcher */}
            <div className="flex bg-cyber-900/50 p-1 rounded-xl mb-4 border border-cyber-700">
               <button 
                onClick={() => setUseBridge(false)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!useBridge ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
               >
                 Direct Key
               </button>
               <button 
                onClick={() => setUseBridge(true)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${useBridge ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
               >
                 Cloudflare Bridge
               </button>
            </div>

            {useBridge ? (
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase ml-1 mb-1 block">Worker URL</label>
                    <input 
                      type="text"
                      value={bridgeUrl}
                      onChange={(e) => setBridgeUrl(e.target.value)}
                      placeholder="https://your-worker.workers.dev"
                      className="w-full bg-cyber-900 border border-cyber-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                 </div>
                 <div className="bg-black/80 p-3 rounded-xl border border-cyber-700">
                    <div className="flex items-center justify-between mb-2">
                       <h5 className="text-[10px] font-bold text-indigo-400 flex items-center gap-1"><Code size={12}/> Worker Code</h5>
                       <CopyButton text={workerCode} className="p-1 h-6 w-6" />
                    </div>
                    <pre className="text-[9px] text-gray-500 font-mono overflow-x-auto whitespace-pre max-h-20 opacity-70">
                      {workerCode}
                    </pre>
                 </div>
              </div>
            ) : (
              <div>
                 <label className="text-[10px] text-gray-400 font-bold uppercase ml-1 mb-1 block">Gemini API Key</label>
                 <div className="relative">
                   <Key size={14} className="absolute left-3 top-3 text-gray-500" />
                   <input 
                    type="password"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-cyber-900 border border-cyber-700 rounded-xl p-3 pl-9 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                 </div>
                 <p className="text-[9px] text-gray-500 mt-2 ml-1">
                   * Key is stored locally in your browser. Get one at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 underline">aistudio.google.com</a>
                 </p>
              </div>
            )}
          </div>
        )}
      </div>

      {!result && !loading && (
        <div className="space-y-4 animate-in slide-in-from-top-4">
           <div className="text-center">
              <h4 className="text-white font-black text-lg mb-1">{t('qs_title')}</h4>
              <p className="text-gray-500 text-xs">{t('qs_desc')}</p>
           </div>
           <div className="grid grid-cols-3 gap-3">
              <QuickStartCard icon={Monitor} title={t('qs_pc')} prompt={t('qs_pc_prompt')} color="blue" />
              <QuickStartCard icon={Smartphone} title={t('qs_mobile')} prompt={t('qs_mobile_prompt')} color="green" />
              <QuickStartCard icon={Tv} title={t('qs_tv')} prompt={t('qs_tv_prompt')} color="purple" />
           </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-indigo-900/40 via-cyber-800 to-fuchsia-900/30 p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-4 right-8 flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${useBridge && bridgeUrl ? 'bg-blue-400 animate-pulse' : (userApiKey ? 'bg-green-400' : 'bg-red-500')}`}></div>
           <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
             {useBridge && bridgeUrl ? t('bridge_status_active') : (userApiKey ? 'DIRECT KEY' : 'NO CONFIG')}
           </span>
        </div>

        <div className="relative flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-3 rounded-2xl shadow-xl">
            <Music className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {t('ai_title')}
              <Sparkles size={16} className="text-fuchsia-400" />
            </h3>
            <p className="text-indigo-200/60 text-[11px] font-medium">{t('ai_desc')}</p>
          </div>
        </div>

        <div className="relative mt-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai_placeholder')}
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all min-h-[130px] resize-none font-medium placeholder-gray-600"
          />
          <button
            onClick={() => analyzeProblem()}
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
              loading ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98]'
            }`}
          >
            {loading ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
            {loading ? t('ai_thinking') : t('ai_btn')}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
             <AlertTriangle className="text-red-400 shrink-0" size={18} />
             <p className="text-xs text-red-200 font-medium leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      {result && (
        <div ref={resultRef} className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-cyber-800 border border-cyber-700 p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            
            {autoSwitched && (
              <div className="mb-4 bg-indigo-500/20 border border-indigo-500/40 rounded-xl p-3 flex items-center gap-3 animate-pulse">
                <Languages size={18} className="text-indigo-400" />
                <span className="text-xs text-indigo-200">
                  {t('ai_desc').includes('Опишите') ? "Язык автоматически переключен на Русский" : `Language automatically switched to ${autoSwitched}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6 relative">
              <div className="bg-cyber-900/50 p-3 rounded-2xl border border-cyber-700">
                {result.platform === 'ios' && <Smartphone className="text-purple-400" size={24} />}
                {result.platform === 'android' && <Bot className="text-green-400" size={24} />}
                {result.platform === 'pc' && <Monitor className="text-blue-400" size={24} />}
                {result.platform === 'linux' && <Terminal className="text-teal-400" size={24} />}
              </div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('ai_result_title')}</h4>
            </div>
            
            <p className="text-indigo-100 text-sm leading-relaxed mb-8 italic bg-indigo-500/5 p-5 rounded-3xl border-l-4 border-indigo-500">
              "{result.explanation}"
            </p>

            <div className="space-y-4 mb-8">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start group">
                   <div className="bg-indigo-600/20 text-indigo-400 text-[10px] font-black w-6 h-6 rounded-xl flex items-center justify-center shrink-0 shadow-lg">{i+1}</div>
                   <p className="text-xs text-gray-300 leading-relaxed font-medium mt-1">{step}</p>
                </div>
              ))}
            </div>

            {result.command && (
              <div className="space-y-3 mb-8">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('command_preview')}</span>
                <div className="bg-black/60 p-5 rounded-2xl border border-cyber-700 font-mono text-xs text-green-400 break-all relative group">
                  {result.command}
                  <div className="absolute top-2 right-2">
                    <CopyButton text={result.command} className="bg-cyber-800" />
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-cyber-700 pt-8 mt-4">
              {!rated ? (
                <div className="flex flex-col items-center gap-5">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t('feedback_rate_title')}</span>
                  <div className="flex gap-6">
                    <button onClick={() => handleRate('up')} className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 hover:bg-green-500 hover:text-white transition-all"><ThumbsUp size={22} /></button>
                    <button onClick={() => handleRate('down')} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all"><ThumbsDown size={22} /></button>
                  </div>
                </div>
              ) : (
                <div className="text-center animate-in zoom-in">
                  <p className="text-cyber-accent text-sm font-black flex items-center justify-center gap-2"><Check size={18} />{t('feedback_thanks')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};