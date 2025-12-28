
import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, Terminal, Zap, Info, Smartphone, Monitor, Globe, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const strategiesContext = STRATEGIES.map(s => ({
        id: s.id,
        name: s.name[language] || s.name['en'],
        command: s.command
      }));

      const prompt = `
        User problem: "${input}"
        Language: ${language}
        Available strategies: ${JSON.stringify(strategiesContext)}
        
        SYSTEM RULES:
        1. IF user mentions "iPhone", "iOS", "Apple", "iPad":
           - Say clearly: ByeDPI does NOT exist for iOS. 
           - Recommend VLESS/Reality via V2Box.
           - Platform: "ios"
        2. IF user mentions "Linux", "Ubuntu", "Debian", "Arch":
           - Recommend downloading the ciadpi binary.
           - MUST mention "chmod +x" and "sudo".
           - Platform: "linux"
        3. IF user mentions "Android", "TV", "Phone":
           - Recommend ByeDPIManager (v0.3.8+).
           - NO ROOT/SUPERUSER mentioned.
           - Platform: "android"
        4. IF user mentions "Windows", "PC":
           - Recommend ciadpi.exe with a .cmd script.
           - Platform: "pc"

        Return JSON only.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
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

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(t('ai_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (type: 'up' | 'down') => {
    setRated(type);
    if (type === 'down' && webApp) {
      // Можно вызвать нативную кнопку Telegram для открытия обратной связи
      // Или просто показать сообщение
    }
  };

  const openSupport = () => {
    if (webApp) {
      webApp.openTelegramLink('https://t.me/your_support_bot'); // Замените на реальный линк
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-gradient-to-br from-indigo-900/40 via-cyber-800 to-fuchsia-900/30 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative flex items-center gap-4 mb-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
            <Bot className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">{t('ai_title')}</h3>
            <p className="text-indigo-200/60 text-sm">{t('ai_desc')}</p>
          </div>
        </div>

        <div className="relative mt-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai_placeholder')}
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none font-sans"
          />
          <button
            onClick={analyzeProblem}
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
              loading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-indigo-500/20'
            }`}
          >
            {loading ? <Zap className="animate-spin text-indigo-400" size={20} /> : <Sparkles size={20} />}
            {loading ? t('ai_thinking') : t('ai_btn')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-2xl text-red-200 text-xs flex items-center gap-3">
          <Info size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-cyber-800 border border-cyber-700 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              {result.platform === 'ios' && <Smartphone className="text-purple-400" size={20} />}
              {result.platform === 'android' && <Bot className="text-green-400" size={20} />}
              {result.platform === 'linux' && <Terminal className="text-teal-400" size={20} />}
              {result.platform === 'pc' && <Monitor className="text-blue-400" size={20} />}
              <h4 className="text-white font-black text-sm uppercase tracking-widest">
                {t('ai_result_title')}
              </h4>
            </div>
            
            <p className="text-gray-200 text-sm leading-relaxed mb-6 italic">
              "{result.explanation}"
            </p>

            <div className="space-y-4 mb-6">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                   <div className="bg-cyber-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                   <p className="text-xs text-gray-400">{step}</p>
                </div>
              ))}
            </div>

            {result.command && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between px-2">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('command_preview')}</span>
                </div>
                <div className="bg-black/60 p-4 rounded-2xl border border-cyber-700 font-mono text-xs text-green-400 break-all relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  {result.command}
                  <div className="absolute top-2 right-2">
                    <CopyButton text={result.command} className="bg-cyber-800" />
                  </div>
                </div>
              </div>
            )}

            {/* AI Feedback System */}
            <div className="border-t border-cyber-700 pt-6 mt-6">
              {!rated ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{t('feedback_rate_title')}</span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleRate('up')}
                      className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/5"
                    >
                      <ThumbsUp size={20} />
                    </button>
                    <button 
                      onClick={() => handleRate('down')}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    >
                      <ThumbsDown size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in zoom-in duration-300">
                  <p className="text-center text-cyber-accent text-sm font-bold flex items-center justify-center gap-2">
                    <Check size={16} />
                    {t('feedback_thanks')}
                  </p>
                  {rated === 'down' && (
                    <button 
                      onClick={openSupport}
                      className="mt-4 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-400/30 p-3 rounded-xl hover:bg-red-400/10 transition-all"
                    >
                      <MessageSquare size={14} />
                      {t('feedback_send_to_bot')}
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
