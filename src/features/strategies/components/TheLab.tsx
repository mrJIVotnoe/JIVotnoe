
import React, { useState } from 'react';
import { FlaskConical, Upload, Trash2, FileJson, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useStrategiesStore } from '../../../store/strategies.store';
import { DriverManager } from '../../../core/drivers/driverManager';
import { useLanguage } from '../../localization/LanguageContext';

export const TheLab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeDriver, importDriver, removeDriver } = useStrategiesStore();
  const { t } = useLanguage();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    setError(null);
    try {
      const manifest = DriverManager.parse(jsonInput);
      importDriver(manifest);
      onClose(); // Close on success
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonInput(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-cyber-900 border border-amber-500/30 p-8 rounded-[2rem] max-w-2xl w-full relative shadow-[0_0_100px_rgba(245,158,11,0.1)] overflow-hidden">
        
        {/* Lab Decor */}
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
           <FlaskConical size={120} className="text-amber-500" />
        </div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
           <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-amber-900/20 border border-amber-500/50 text-amber-500">
               <FlaskConical size={24} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">The Lab</h2>
               <p className="text-xs text-amber-500/70 font-mono">EXPERIMENTAL DRIVER LOADER</p>
             </div>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="space-y-6 relative z-10">
           {/* Active Driver Status */}
           {activeDriver ? (
             <div className="bg-amber-900/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <FileJson className="text-amber-400" size={24} />
                   <div>
                      <h4 className="font-bold text-amber-100">{activeDriver.name}</h4>
                      <p className="text-[10px] text-amber-400/60 font-mono">v{activeDriver.manifest_version} • {activeDriver.strategies.length} Strategies</p>
                   </div>
                </div>
                <button 
                  onClick={removeDriver}
                  className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors border border-red-900/30"
                  title="Unload Driver"
                >
                   <Trash2 size={18} />
                </button>
             </div>
           ) : (
             <div className="bg-black/40 border border-dashed border-gray-700 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-500">No custom driver loaded. System running on Core Strategies.</p>
             </div>
           )}

           {/* Input Area */}
           <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver Manifest (JSON)</label>
                 <label className="cursor-pointer flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    <Upload size={12} /> Load from File
                    <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                 </label>
              </div>
              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{ "manifest_version": 1, "strategies": [...] }'
                className="w-full h-48 bg-black/50 border border-cyber-700 rounded-xl p-4 text-xs font-mono text-green-300 focus:outline-none focus:border-amber-500 transition-all custom-scrollbar"
              />
           </div>

           {error && (
             <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-xs">
                <XCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
             </div>
           )}

           <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                 <AlertTriangle size={12} />
                 <span>Community drivers run in User Space. Core integrity verified.</span>
              </div>
              <button 
                onClick={handleImport}
                disabled={!jsonInput.trim()}
                className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inject Driver
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
