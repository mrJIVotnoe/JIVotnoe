
import React, { useState, useEffect } from 'react';
import { Lock, Key, Eye, EyeOff, ShieldCheck, Zap, Trash2, Cpu, Hash, Fingerprint, Server, XCircle, Globe, ChevronDown, Check, Settings } from 'lucide-react';
import { useAiStore, AiProviderType } from '../../../store/ai.store';

export const PrivacyVault: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    customApiKey, bridgeUrl, useBridge, provider, customBaseUrl, customModelName,
    setBridgeSettings, setProviderSettings, mountSessionKey, destroySession 
  } = useAiStore();

  const [localKey, setLocalKey] = useState(customApiKey);
  const [localBridge, setLocalBridge] = useState(bridgeUrl);
  const [localUseBridge, setLocalUseBridge] = useState(useBridge);
  const [localProvider, setLocalProvider] = useState<AiProviderType>(provider);
  const [localBaseUrl, setLocalBaseUrl] = useState(customBaseUrl);
  const [localModelName, setLocalModelName] = useState(customModelName);
  
  const [showKey, setShowKey] = useState(false);
  const [isMounted, setIsMounted] = useState(!!customApiKey);
  const [sessionHash, setSessionHash] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generate session hash
  useEffect(() => {
    const array = new Uint8Array(8);
    window.crypto.getRandomValues(array);
    const hash = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    setSessionHash(isMounted ? `0x${hash}` : 'NOT_MOUNTED');
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(!!customApiKey);
    if(customApiKey) {
        setLocalKey(customApiKey);
        setLocalUseBridge(false); // Force direct mode
    }
  }, [customApiKey]);

  const handleMount = () => {
    setBridgeSettings(localUseBridge, localBridge);
    setProviderSettings(localProvider, localBaseUrl, localModelName);
    
    // Only mount key if provided. If using Gemini Bridge (public), key might be empty.
    // For other providers, key is mandatory for direct access.
    if (localKey || (localProvider === 'gemini' && localUseBridge)) {
        mountSessionKey(localKey);
        setIsMounted(true);
    }
  };

  const handlePurge = () => {
    destroySession();
    setLocalKey('');
    setIsMounted(false);
  };

  const PROVIDERS: {id: AiProviderType, label: string, icon: string}[] = [
      { id: 'gemini', label: 'Google Gemini', icon: '✨' },
      { id: 'deepseek', label: 'DeepSeek V3', icon: '🐋' },
      { id: 'grok', label: 'Grok (xAI)', icon: '🌌' },
      { id: 'openai', label: 'OpenAI (GPT)', icon: '🧠' },
      { id: 'custom', label: 'Custom / Local', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 font-mono">
      <div className="bg-[#111] border border-amber-500/20 p-8 rounded-[1rem] max-w-lg w-full relative shadow-[0_0_100px_rgba(245,158,11,0.05)] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Deco Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-4">
             <div className={`p-3 rounded border ${isMounted ? 'bg-amber-900/20 border-amber-500 text-amber-500' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
               <Cpu size={24} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2">
                 Neural Ledger
                 {isMounted && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>}
               </h2>
               <p className="text-[10px] text-gray-500 flex items-center gap-2">
                 <Hash size={10} />
                 SESSION ID: <span className="text-amber-500">{sessionHash}</span>
               </p>
             </div>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="space-y-6 relative z-10">
           
           {/* Provider Selector */}
           <div>
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                 Intelligence Provider
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {PROVIDERS.map(p => (
                     <button
                        key={p.id}
                        disabled={isMounted}
                        onClick={() => setLocalProvider(p.id)}
                        className={`flex items-center gap-3 p-3 rounded border text-left transition-all ${
                            localProvider === p.id 
                            ? 'bg-amber-900/20 border-amber-500/50 text-amber-100' 
                            : 'bg-[#0a0a0a] border-gray-800 text-gray-500 hover:border-gray-600'
                        } ${isMounted ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-xs font-bold">{p.label}</span>
                        {localProvider === p.id && <Check size={12} className="ml-auto text-amber-500" />}
                     </button>
                 ))}
              </div>
           </div>

           {/* Key Input */}
           <div>
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Key size={10} />
                 {localProvider === 'gemini' ? 'API Key (Optional for Bridge)' : 'API Key (Required)'}
              </label>
              
              <div className="relative group">
                 <input 
                   type={showKey ? "text" : "password"} 
                   value={localKey}
                   onChange={(e) => setLocalKey(e.target.value)}
                   placeholder={localProvider === 'gemini' ? "Use Public Bridge or paste sk-..." : "sk-..."}
                   disabled={isMounted}
                   className={`w-full bg-[#0a0a0a] border rounded p-4 text-xs text-amber-50 transition-all font-mono tracking-wider ${
                     isMounted 
                     ? 'border-green-900/50 text-green-500 opacity-50 cursor-not-allowed' 
                     : 'border-gray-800 focus:border-amber-500 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                   }`}
                 />
                 <button 
                   onClick={() => setShowKey(!showKey)}
                   className="absolute right-4 top-4 text-gray-600 hover:text-gray-300"
                 >
                   {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                 </button>
              </div>
              <p className="text-[9px] text-gray-600 mt-2 flex items-center gap-1">
                 <Lock size={8} /> 
                 {isMounted ? "Session Signed. Key exists in RAM only." : "Your key never touches our disk."}
              </p>
           </div>

           {/* Advanced Settings (Custom URL/Model) */}
           {(localProvider === 'custom' || showAdvanced) && (
              <div className="space-y-4 bg-[#080808] p-4 rounded border border-gray-800 animate-in slide-in-from-top-2">
                 <div>
                    <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Base URL</label>
                    <input 
                        type="text" 
                        value={localBaseUrl} 
                        onChange={e => setLocalBaseUrl(e.target.value)}
                        placeholder={localProvider === 'openai' ? 'https://api.openai.com/v1' : 'http://localhost:11434/v1'}
                        disabled={isMounted}
                        className="w-full bg-[#111] border border-gray-700 rounded p-2 text-xs text-gray-300 font-mono"
                    />
                 </div>
                 <div>
                    <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Model Name</label>
                    <input 
                        type="text" 
                        value={localModelName} 
                        onChange={e => setLocalModelName(e.target.value)}
                        placeholder="gpt-4o"
                        disabled={isMounted}
                        className="w-full bg-[#111] border border-gray-700 rounded p-2 text-xs text-gray-300 font-mono"
                    />
                 </div>
              </div>
           )}

           {/* Gemini Bridge Settings */}
           {localProvider === 'gemini' && !localKey && (
               <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => !isMounted && setLocalUseBridge(false)}
                    className={`p-3 rounded border cursor-pointer transition-all ${!localUseBridge ? 'bg-amber-900/20 border-amber-500 text-amber-100' : 'bg-transparent border-gray-800 text-gray-500 opacity-50'}`}
                  >
                     <div className="text-[10px] font-bold uppercase mb-1">Direct Mode</div>
                     <div className="text-[9px]">Require Key</div>
                  </div>
                  <div 
                    onClick={() => !isMounted && setLocalUseBridge(true)}
                    className={`p-3 rounded border cursor-pointer transition-all ${localUseBridge ? 'bg-indigo-900/20 border-indigo-500 text-indigo-100' : 'bg-transparent border-gray-800 text-gray-500 opacity-50'}`}
                  >
                     <div className="text-[10px] font-bold uppercase mb-1">Bridge Mode</div>
                     <div className="text-[9px]">Use Proxy</div>
                  </div>
               </div>
           )}

           {/* Advanced Toggle */}
           {localProvider !== 'custom' && (
               <button 
                 onClick={() => setShowAdvanced(!showAdvanced)} 
                 className="flex items-center gap-1 text-[9px] text-gray-600 hover:text-gray-400 mx-auto"
               >
                 <Settings size={10} />
                 {showAdvanced ? 'Hide Advanced' : 'Advanced Configuration'}
               </button>
           )}

           {/* Actions */}
           <div className="pt-4 border-t border-gray-800">
              {!isMounted ? (
                <button 
                  onClick={handleMount}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black py-4 rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-900/20 flex items-center justify-center gap-3 transition-all"
                >
                  <Zap size={16} />
                  Sign Session & Mount
                </button>
              ) : (
                <button 
                  onClick={handlePurge}
                  className="w-full bg-red-900/10 hover:bg-red-900/20 border border-red-900/50 text-red-500 py-4 rounded font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <Trash2 size={16} />
                  Incinerate Keys
                </button>
              )}
           </div>

        </div>
      </div>
    </div>
  );
};
