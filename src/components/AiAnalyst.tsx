
import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, Terminal, Zap, Info } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../LanguageContext';
import { STRATEGIES } from '../data';
import { CopyButton } from './CopyButton';

export const AiAnalyst: React.FC = () => {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ strategyId: string, explanation: string, command: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeProblem = async () => {
    if (!input.trim()) {
      setError(t('ai_no_input'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const strategiesContext = STRATEGIES.map(s => ({
        id: s.id,
        name: s.name[language] || s.name['en'],
        desc: s.description[language] || s.description['en'],
        command: s.command
      }));

      const prompt = `
        User is having internet blocking issues. 
        Problem description: "${input}"
        Current language: ${language}
        
        Available ByeDPI strategies: ${JSON.stringify(strategiesContext)}
        
        Task: 
        1. Select the best strategy ID from the list.
        2. Provide a short explanation in ${language} why it was chosen.
        3. If no strategy fits perfectly, pick the 'SHUTDOWN_OZON' as it is the most robust.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategyId: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["strategyId", "explanation"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const selectedStrategy = STRATEGIES.find(s => s.id === data.strategyId) || STRATEGIES[0];

      setResult({
        strategyId: data.strategyId,
        explanation: data.explanation,
        command: selectedStrategy.command
      });
    } catch (err) {
      console.error(err);
      setError(t('ai_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-gradient-to-br from-indigo-900/40 via-cyber-800 to-fuchsia-900/30 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fuchsia-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative flex items-center gap-4 mb-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
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
            className="w-full bg-black/40 border border-cyber-700 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none"
          />
          <button
            onClick={analyzeProblem}
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
              loading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20'
            }`}
          >
            {loading ? (
              <Zap className="animate-spin text-indigo-400" />
            ) : (
              <Sparkles size={20} />
            )}
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
            <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} />
              {t('ai_result_title')}
            </h4>
            
            <p className="text-gray-200 text-sm leading-relaxed mb-6 italic">
              "{result.explanation}"
            </p>

            <div className="space-y-3">
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
            
            <div className="mt-6 p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
              <Info className="text-indigo-400 shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] text-gray-400 leading-normal">
                {t('analyst_tip_text')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
