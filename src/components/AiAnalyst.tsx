
import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Zap, Info, Smartphone, Monitor, ThumbsUp, ThumbsDown, MessageSquare, Settings, ChevronDown, ChevronUp, Code, Terminal, Check } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../LanguageContext';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';
import { useTelegram } from '../TelegramContext';

export const AiAnalyst: React.FC = () => {
  const { t, language } = useLanguage();
  const { webApp } = useTelegram();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ 
    platform: 'android' | 'pc' | 'ios' | 'linux', 
    explanation: string, 
    command?: string,
    steps: string[] 
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rated, setRated] = useState<'up' | 'down' | null>(null);

  const [useBridge, setUseBridge] = useState(() => localStorage.getItem('ai_use_bridge') === 'true');
  const [bridgeUrl, setBridgeUrl] = useState(() => localStorage.getItem('ai_bridge_url') || '');
  const [showBridgeSettings, setShowBridgeSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_use_bridge', String(useBridge));
    localStorage.setItem('ai_bridge_url', bridgeUrl);
  }, [useBridge, bridgeUrl]);

  const workerCode = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetUrl = "https://generativelanguage.googleapis.com" + url.pathname + url.search;
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return fetch(newRequest);
  },
};`;

  const analyzeProblem = async () => {
    if (!input.trim()) {
      setError(t('ai_no_input'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRated(null);

    try {
      const strategiesContext = STRATEGIES.map(s => ({
        id: s.id,
        name: s.name[language] || s.name['en'],
        command: s.command
      }));

      const systemInstruction = `You are a network bypass expert. Analyze user input and recommend a strategy.
        RULES:
        - For iOS/Apple: recommend VLESS/Reality (ByeDPI doesn't work).
        - For Android/TV: recommend ByeDPIManager (0.3.8+).
        - For Windows/PC: recommend ciadpi.exe.
        - Use these strategy IDs for context: ${JSON.stringify(strategiesContext)}.
        - Response must be strictly valid JSON.`;

      let responseText = "";

      if (useBridge && bridgeUrl) {
        const cleanBridgeUrl = bridgeUrl.trim().replace(/\/$/, '');
        const fullUrl = `${cleanBridgeUrl}/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.API_KEY}`;
        
        const res = await fetch(fullUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING, enum: ['android', 'pc', 'ios', 'linux'] },
                  explanation: { type: Type.STRING },
                  command: { type: Type.STRING },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["platform", "explanation", "steps"]
              }
            }
          })
        });

        if (!res.ok) throw new Error(`Bridge Error: ${res.status}`);
        const json = await res.json();
        responseText = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING, enum: ['android', 'pc', 'ios', 'linux'] },
                explanation: { type: Type.STRING },
                command: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["platform", "explanation", "steps"]
            }
          }
        });
        responseText = response.text || "";
      }

      if (!responseText) throw new Error("Empty AI Response");
      const data = JSON.parse(responseText);
      setResult(data);
    } catch (err) {
      console.error("AI ERROR:", err);
      setError(t('ai_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (direction: 'up' | 'down') => {
    setRated(direction);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="bg-gradient-to-br from-indigo-900/40 via-cyber-800 to-fuchsia-900/30 p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

        <div className="absolute top-4 right-8 flex items-center gap-2">
           <div className={`h-1.5 w-1.5 rounded-full ${useBridge && bridgeUrl ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
           <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
             {useBridge && bridgeUrl ? t('bridge_status_active') : t('bridge_status_direct')}
           </span>
        </div>

        <div className="relative flex items-center gap-4 mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">{t('ai_title')}</h3>
            <p className="text-indigo-200/60 text-[11px] font-medium">{t('ai_desc')}</p>
          </div>
        </div>

        <div className="relative mt-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai_placeholder')}
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all min-h-[130px] resize-none font-sans"
          />
          <button
            onClick={analyzeProblem}
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
              loading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:shadow-indigo-500/30 shadow-xl'
            }`}
          >
            {loading ? <Zap className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? t('ai_thinking') : t('ai_btn')}
          </button>
        </div>

        <button 
          onClick={() => setShowBridgeSettings(!showBridgeSettings)}
          className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-300/40 hover:text-indigo-300 transition-colors uppercase tracking-[0.2em]"
        >
          <Settings size={14} />
          {t('bridge_toggle')}
          {showBridgeSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showBridgeSettings && (
          <div className="mt-4 p-5 bg-black/60 rounded-3xl border border-indigo-500/20 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-black text-gray-200 uppercase tracking-tight">{t('bridge_toggle')}</span>
               <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={useBridge} onChange={() => setUseBridge(!useBridge)} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            
            <input 
              type="text"
              value={bridgeUrl}
              onChange={(e) => setBridgeUrl(e.target.value)}
              placeholder={t('bridge_url_placeholder')}
              className="w-full bg-cyber-900 border border-cyber-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 mb-4 font-mono"
            />

            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2">
                <Code size={14} />
                {t('bridge_setup_title')}
              </h5>
              <div className="bg-black/80 p-4 rounded-2xl border border-cyber-700 font-mono text-[10px] text-gray-400 relative overflow-hidden">
                <pre className="overflow-x-auto whitespace-pre">{workerCode}</pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={workerCode} className="p-1.5 bg-cyber-800" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/10 border border-red-500/30 p-5 rounded-2xl text-red-200 text-xs flex items-center gap-3 animate-in shake duration-500">
          <Info size={18} className="shrink-0 text-red-400" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-cyber-800 border border-cyber-700 p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="bg-cyber-900/50 p-3 rounded-2xl border border-cyber-700">
                {result.platform === 'ios' && <Smartphone className="text-purple-400" size={24} />}
                {result.platform === 'android' && <Bot className="text-green-400" size={24} />}
                {result.platform === 'linux' && <Terminal className="text-teal-400" size={24} />}
                {result.platform === 'pc' && <Monitor className="text-blue-400" size={24} />}
              </div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">{t('ai_result_title')}</h4>
            </div>
            
            <p className="text-gray-200 text-sm leading-relaxed mb-8 italic bg-black/20 p-4 rounded-2xl border-l-2 border-indigo-500">
              "{result.explanation}"
            </p>

            <div className="space-y-4 mb-8">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start group">
                   <div className="bg-indigo-600/20 text-indigo-400 text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-all">{i+1}</div>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">{step}</p>
                </div>
              ))}
            </div>

            {result.command && (
              <div className="space-y-3 mb-8">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">{t('command_preview')}</span>
                <div className="bg-black/60 p-5 rounded-2xl border border-cyber-700 font-mono text-xs text-green-400 break-all relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:bg-indigo-500 transition-all"></div>
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
                    <button onClick={() => handleRate('up')} className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-lg"><ThumbsUp size={22} /></button>
                    <button onClick={() => handleRate('down')} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg"><ThumbsDown size={22} /></button>
                  </div>
                </div>
              ) : (
                <div className="animate-in zoom-in duration-500 text-center">
                  <p className="text-cyber-accent text-sm font-black flex items-center justify-center gap-2"><Check size={18} />{t('feedback_thanks')}</p>
                  {rated === 'down' && (
                    <button onClick={() => webApp?.openTelegramLink('https://t.me/your_support_bot')} className="mt-5 w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-400/30 p-4 rounded-2xl hover:bg-red-400/10 transition-all">
                      <MessageSquare size={16} />{t('feedback_send_to_bot')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
