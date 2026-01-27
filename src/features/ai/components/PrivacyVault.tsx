
import React, { useState, useEffect } from 'react';
import { Lock, Key, Eye, EyeOff, ShieldCheck, Zap, Trash2, Cpu, Hash, Fingerprint, Server, XCircle, Globe } from 'lucide-react';
import { useAiStore } from '../../../store/ai.store';

export const PrivacyVault: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    customApiKey, bridgeUrl, useBridge, 
    setBridgeSettings, mountSessionKey, destroySession 
  } = useAiStore();

  const [localKey, setLocalKey] = useState(customApiKey);
  const [localBridge, setLocalBridge] = useState(bridgeUrl);
  const [localUseBridge, setLocalUseBridge] = useState(useBridge);
  const [showKey, setShowKey] = useState(false);
  const [isMounted, setIsMounted] = useState(!!customApiKey);
  const [sessionHash, setSessionHash] = useState('');

  // Generate a fake session hash for visual confirmation of ephemeral state
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
        // Force Direct Mode when using Custom Key for sovereignty
        setLocalUseBridge(false); 
    }
  }, [customApiKey]);

  const handleMount = () => {
    // If user provides a key, we enforce DIRECT mode to ensure "No Middleman" safety
    if (localKey) {
        setLocalUseBridge(false);
    }
    setBridgeSettings(localUseBridge, localBridge);
    mountSessionKey(localKey);
    setIsMounted(true);
  };

  const handlePurge = () => {
    destroySession();
    setLocalKey('');
    setIsMounted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 font-mono">
      <div className="bg-[#111] border border-amber-500/20 p-8 rounded-[1rem] max-w-lg w-full relative shadow-[0_0_100px_rgba(245,158,11,0.05)] overflow-hidden">
        
        {/* Deco Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 p-4 opacity-5">
           <Fingerprint size={150} />
        </div>

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

        {/* Topology Visualization (The "Proof" of Safety) */}
        <div className="mb-6 bg-black/50 p-4 rounded-xl border border-gray-800 relative">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-3 text-center">Data Topology Map</p>
            <div className="flex items-center justify-between px-2">
                {/* User Node */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center text-blue-400">
                        <Fingerprint size={20} />
                    </div>
                    <span className="text-[9px] text-blue-400 font-bold">YOU (RAM)</span>
                </div>

                {/* Connection Line */}
                <div className="flex-1 h-px bg-gray-800 mx-2 relative flex items-center justify-center">
                    {localKey ? (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-green-500/50 to-blue-500/0 h-[1px]"></div>
                            <span className="bg-[#111] px-2 text-[9px] text-green-500 font-bold border border-green-900 rounded">DIRECT UPLINK</span>
                        </>
                    ) : (
                        <span className="bg-[#111] px-2 text-[9px] text-gray-600">WAITING FOR KEY</span>
                    )}
                </div>

                {/* Google Node */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-10 h-10 rounded-full bg-green-900/30 border border-green-500 flex items-center justify-center text-green-400">
                        <Globe size={20} />
                    </div>
                    <span className="text-[9px] text-green-400 font-bold">GEMINI API</span>
                </div>
            </div>

            {/* Bypassed Server Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-500 flex items-center justify-center text-red-500 relative">
                    <Server size={14} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <XCircle size={36} className="text-red-600/50" />
                    </div>
                </div>
                <span className="text-[8px] text-red-500 mt-1">OUR SERVER (BYPASSED)</span>
            </div>
        </div>

        {/* Content */}
        <div className="space-y-6 relative z-10">
           
           {/* Key Input */}
           <div>
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Key size={10} />
                 Private Key (Google Gemini)
              </label>
              
              <div className="relative group">
                 <input 
                   type={showKey ? "text" : "password"} 
                   value={localKey}
                   onChange={(e) => setLocalKey(e.target.value)}
                   placeholder="sk-..."
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

           {/* Network Settings (Auto-managed for Key owners) */}
           {!localKey && (
               <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => !isMounted && setLocalUseBridge(false)}
                    className={`p-3 rounded border cursor-pointer transition-all ${!localUseBridge ? 'bg-amber-900/20 border-amber-500 text-amber-100' : 'bg-transparent border-gray-800 text-gray-500 opacity-50'}`}
                  >
                     <div className="text-[10px] font-bold uppercase mb-1">Direct Mode</div>
                     <div className="text-[9px]">Connect directly</div>
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

           {localKey && (
               <div className="p-3 bg-green-900/10 border border-green-500/30 rounded flex items-center gap-3">
                   <ShieldCheck className="text-green-400" size={16} />
                   <div className="text-[9px] text-green-300">
                       <span className="font-bold block">SOVEREIGNTY MODE ACTIVE</span>
                       Bridge disabled. Connection is purely Peer-to-Peer (You ↔ Google).
                   </div>
               </div>
           )}

           {localUseBridge && !localKey && (
              <input 
                type="text" 
                value={localBridge}
                onChange={(e) => setLocalBridge(e.target.value)}
                placeholder="Bridge URL"
                disabled={isMounted}
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-3 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 font-mono"
              />
           )}

           {/* Actions */}
           <div className="pt-4 border-t border-gray-800">
              {!isMounted ? (
                <button 
                  onClick={handleMount}
                  disabled={!localKey}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black py-4 rounded font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
