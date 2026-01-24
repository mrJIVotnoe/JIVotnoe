
import React, { useState, useEffect } from 'react';
import { Scissors, Zap, Shuffle, EyeOff, Activity, ArrowRight, Settings2 } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';
import { CopyButton } from '../../../shared/ui/CopyButton';

interface VisualBuilderProps {
  baseSni: string;
}

export const VisualBuilder: React.FC<VisualBuilderProps> = ({ baseSni }) => {
  const { t } = useLanguage();
  
  // State for the builder
  const [splitPos, setSplitPos] = useState(1);
  const [disorder, setDisorder] = useState(false);
  const [fake, setFake] = useState(false);
  const [ttl, setTtl] = useState(5);

  // Generate command based on visual state
  const generateArgs = () => {
    let cmd = `-n ${baseSni}`;
    
    // Split Logic
    // If disorder is active, we usually split at the disorder offset
    // If just split, we use --split
    if (disorder) {
      cmd += ` -o${splitPos}`; // Disorder offset implies a split
    } else {
      cmd += ` -s${splitPos}`; // Standard split
    }

    // Fake Logic
    if (fake) {
      cmd += ` -f${ttl}`; // Fake with TTL
    }

    // Auto-TTL fix (standard good practice)
    cmd += ` -a`; 

    return cmd;
  };

  const command = generateArgs();

  // Visual helper text
  const sniPart1 = "ClientHello".substring(0, splitPos);
  const sniPart2 = "ClientHello".substring(splitPos);

  return (
    <div className="bg-black/40 rounded-2xl border border-cyber-700 overflow-hidden relative group">
      
      {/* 1. The Visualizer Screen */}
      <div className="p-6 bg-gradient-to-b from-cyber-900 to-black border-b border-cyber-700 relative h-40 flex items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className={`flex items-center gap-2 transition-all duration-500 ${disorder ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Chunk 1 */}
            <div className="relative group/block transition-all duration-300">
                <div className="h-12 bg-blue-600/20 border border-blue-500 rounded-lg flex items-center justify-center min-w-[40px] px-2 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <span className="font-mono text-xs font-bold text-blue-200">{sniPart1}</span>
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-400 font-mono opacity-0 group-hover/block:opacity-100 transition-opacity">
                    OFFSET:{splitPos}
                </div>
            </div>

            {/* The Cut / Fake Injection */}
            <div className="flex flex-col items-center justify-center w-12 relative">
               {fake ? (
                   <div className="h-10 w-full bg-red-500/20 border border-red-500/50 border-dashed rounded flex items-center justify-center animate-pulse">
                       <span className="text-[9px] font-black text-red-400">FAKE</span>
                       <div className="absolute -bottom-4 text-[9px] text-red-500 font-mono">TTL:{ttl}</div>
                   </div>
               ) : (
                   <div className="h-0.5 w-full bg-cyber-600 relative">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyber-900 p-1 rounded-full border border-cyber-600">
                           <Scissors size={12} className="text-gray-400" />
                       </div>
                   </div>
               )}
            </div>

            {/* Chunk 2 */}
            <div className="relative group/block flex-1">
                <div className="h-12 bg-blue-600/10 border border-blue-500/50 rounded-lg flex items-center justify-center px-4 backdrop-blur-sm">
                    <span className="font-mono text-xs text-blue-300/70">{sniPart2}...</span>
                </div>
                {disorder && (
                    <div className="absolute -bottom-6 w-full flex justify-center text-[10px] text-orange-400 font-mono animate-bounce">
                        DISORDER (SWAP)
                    </div>
                )}
            </div>

        </div>
      </div>

      {/* 2. Controls Deck */}
      <div className="p-6 space-y-6 bg-cyber-800/50 backdrop-blur-sm">
         
         {/* Split Slider */}
         <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    <Scissors size={14} className="text-blue-400" />
                    Split Position (Offset)
                </label>
                <span className="font-mono text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{splitPos} bytes</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1"
              value={splitPos}
              onChange={(e) => setSplitPos(Number(e.target.value))}
              className="w-full h-2 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
            <p className="text-[10px] text-gray-500">Defines where the "ClientHello" packet is cut. Small values (1-3) break SNI detection best.</p>
         </div>

         <div className="grid grid-cols-2 gap-4">
             {/* Disorder Toggle */}
             <button 
                onClick={() => setDisorder(!disorder)}
                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                    disorder 
                    ? 'bg-orange-900/20 border-orange-500/50 text-orange-200' 
                    : 'bg-cyber-900 border-cyber-700 text-gray-400 hover:border-gray-500'
                }`}
             >
                <div className="flex items-center gap-2 text-xs font-bold">
                    <Shuffle size={14} />
                    Disorder
                </div>
                <span className="text-[10px] opacity-70 text-left leading-tight">Send chunks out of order to confuse stateful DPI.</span>
             </button>

             {/* Fake Toggle */}
             <button 
                onClick={() => setFake(!fake)}
                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                    fake 
                    ? 'bg-red-900/20 border-red-500/50 text-red-200' 
                    : 'bg-cyber-900 border-cyber-700 text-gray-400 hover:border-gray-500'
                }`}
             >
                <div className="flex items-center gap-2 text-xs font-bold">
                    <EyeOff size={14} />
                    Fake Packet
                </div>
                <span className="text-[10px] opacity-70 text-left leading-tight">Inject garbage packet with low TTL.</span>
             </button>
         </div>

         {/* TTL Slider (Only if fake is on) */}
         {fake && (
             <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
                        <Activity size={14} className="text-red-400" />
                        Fake TTL (Time To Live)
                    </label>
                    <span className="font-mono text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded">{ttl} hops</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  step="1"
                  value={ttl}
                  onChange={(e) => setTtl(Number(e.target.value))}
                  className="w-full h-2 bg-cyber-900 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-all"
                />
             </div>
         )}
      </div>

      {/* 3. Output Bar */}
      <div className="bg-black/80 p-4 border-t border-cyber-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-cyber-800 p-2 rounded-lg">
                  <Settings2 size={16} className="text-green-400" />
              </div>
              <div className="flex-1 overflow-hidden">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Generated Arguments</div>
                  <code className="text-xs font-mono text-green-400 truncate block">{command}</code>
              </div>
          </div>
          <CopyButton text={command} className="shrink-0" />
      </div>
    </div>
  );
};
