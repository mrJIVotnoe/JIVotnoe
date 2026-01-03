
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Zap, Info, Smartphone, Monitor, ThumbsUp, ThumbsDown, MessageSquare, Settings, ChevronDown, ChevronUp, Code, Terminal, Check, Music, Tv } from 'lucide-react';
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

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ai_use_bridge', String(useBridge));
    localStorage.setItem('ai_bridge_url', bridgeUrl);
  }, [useBridge, bridgeUrl]);

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

      const systemInstruction = `You are "The Maestro of Network Neutrality". 
        Your goal is to guide users through DPI bypass orchestration. 
        TONE: Inspiring, professional, slightly musical. Use metaphors like "rhythm of packets", "symphony of traffic".
        TECHNICAL: Recommend platform-specific tools: iOS=VLESS/Reality, Android=ByeDPIManager, Windows=ciadpi.
        Strategies: ${JSON.stringify(strategiesContext)}.
        Response must be strictly valid JSON.`;

      let responseText = "";

      if (useBridge && bridgeUrl) {
        const cleanBridgeUrl = bridgeUrl.trim().replace(/\/$/, '');
        const fullUrl = `${cleanBridgeUrl}/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.API_KEY}`;
        
        const res = await fetch(fullUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalInput }] }],
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
          contents: finalInput,
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
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(direction === 'up' ? 'medium' : 'heavy');
    }
  };

  const QuickStartCard = ({ icon: Icon, title, prompt, color }: any) => {
    const colorStyles: any = {
      blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
      green: 'border-green-500/30 bg-green-500/5 text-green-400',
      purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400'
    };
    return (
      <button 
        onClick={() => analyzeProblem(prompt)}
        disabled={loading}
        className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all hover:scale-[1.05] shadow-lg ${colorStyles[color]}`}
      >
        <div className="p-3 rounded-2xl bg-black/40"><Icon size={24} /></div>
        <span className="text-[10px] font-black uppercase tracking-tight text-center">{title}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
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
           <div className={`h-1.5 w-1.5 rounded-full ${useBridge && bridgeUrl ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
           <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
             {useBridge && bridgeUrl ? t('bridge_status_active') : t('bridge_status_direct')}
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
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all min-h-[130px] resize-none"
          />
          <button
            onClick={() => analyzeProblem()}
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
              loading ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-xl'
            }`}
          >
            {loading ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
            {loading ? t('ai_thinking') : t('ai_btn')}
          </button>
        </div>

        <button 
          onClick={() => setShowBridgeSettings(!showBridgeSettings)}
          className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-300/40 hover:text-indigo-300 uppercase tracking-[0.2em]"
        >
          <Settings size={14} />
          {t('bridge_toggle')}
          {showBridgeSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showBridgeSettings && (
          <div className="mt-4 p-5 bg-black/60 rounded-3xl border border-indigo-500/20">
            <input 
              type="text"
              value={bridgeUrl}
              onChange={(e) => setBridgeUrl(e.target.value)}
              placeholder={t('bridge_url_placeholder')}
              className="w-full bg-cyber-900 border border-cyber-700 rounded-xl p-3 text-xs text-white mb-4"
            />
          </div>
        )}
      </div>

      {result && (
        <div ref={resultRef} className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-cyber-800 border border-cyber-700 p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="bg-cyber-900/50 p-3 rounded-2xl border border-cyber-700">
                {result.platform === 'ios' && <Smartphone className="text-purple-400" size={24} />}
                {result.platform === 'android' && <Bot className="text-green-400" size={24} />}
                {result.platform === 'pc' && <Monitor className="text-blue-400" size={24} />}
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
                   <p className="text-xs text-gray-300 leading-relaxed font-medium">{step}</p>
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
                <div className="text-center">
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
