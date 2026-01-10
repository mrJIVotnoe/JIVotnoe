import React, { useState } from 'react';
import { Smartphone, Laptop, Terminal, Key, ShieldCheck, AlertTriangle, Command, Check, Server, Globe, Search } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { StrategySelector } from './StrategySelector';
import { StrategyType } from '../types';
import { SniScanner } from './SniScanner';
import { CopyButton } from './CopyButton';
import { STRATEGIES } from '../data';
import { generateCommand } from '../utils/commandGenerator';

export const AppleGuide: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'macos' | 'ios'>('macos');
  
  // macOS State
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyType>(StrategyType.SHUTDOWN_OZON);
  const [customSni, setCustomSni] = useState<string>('');
  const [arch, setArch] = useState<'intel' | 'silicon'>('silicon');

  // iOS State
  const [keyInput, setKeyInput] = useState('');
  const [parsedKey, setParsedKey] = useState<any>(null);

  // macOS Logic
  const currentStrategy = STRATEGIES.find(s => s.id === selectedStrategyId) || STRATEGIES[0];
  const effectiveSni = customSni || t('local_sni_example');
  
  const macCommand = generateCommand({
    os: 'macos',
    strategy: currentStrategy,
    sni: effectiveSni,
    port: 1080,
    arch: arch
  });

  const binaryName = arch === 'silicon' ? './ciadpi-aarch64' : './ciadpi-x86_64';

  // iOS Logic (VLESS Parser)
  const parseVless = (input: string) => {
    try {
      if (!input.startsWith('vless://')) throw new Error('Not a VLESS key');
      const url = new URL(input);
      const params = new URLSearchParams(url.search);
      setParsedKey({
        uuid: url.username,
        host: url.hostname,
        port: url.port,
        sni: params.get('sni') || 'none',
        type: params.get('type') || 'tcp',
        security: params.get('security') || 'none',
        name: url.hash.replace('#', '') || 'Unnamed'
      });
    } catch (e) {
      setParsedKey(null);
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyInput(e.target.value);
    parseVless(e.target.value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Platform Switcher */}
      <div className="flex p-1 bg-cyber-800 rounded-2xl border border-cyber-700">
        <button
          onClick={() => setActiveTab('macos')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            activeTab === 'macos' ? 'bg-white text-cyber-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Laptop size={16} /> macOS
        </button>
        <button
          onClick={() => setActiveTab('ios')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            activeTab === 'ios' ? 'bg-white text-cyber-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Smartphone size={16} /> iOS / iPadOS
        </button>
      </div>

      {activeTab === 'macos' && (
        <div className="space-y-8 animate-in slide-in-from-left-4">
          {/* ... (Existing Intro) ... */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-[2rem] border border-gray-700 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
              <Command className="text-gray-400" size={24} />
              {t('macos_terminal_control')}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('macos_desc')}
            </p>
          </div>

          <div className="bg-cyber-800 p-6 rounded-[2.5rem] border border-cyber-700">
             <div className="flex items-center gap-3 mb-6 px-2">
                <div className="bg-cyber-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">1</div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">{t('macos_arch_select')}</h4>
             </div>
             
             <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setArch('silicon')}
                  className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    arch === 'silicon' ? 'bg-cyber-700 border-white/20 ring-1 ring-white/20' : 'bg-cyber-900/50 border-cyber-700 opacity-60 hover:opacity-100'
                  }`}
                >
                   <div className="font-black text-white text-lg">Apple Silicon</div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">M1 / M2 / M3 / M4</div>
                </button>
                <button 
                  onClick={() => setArch('intel')}
                  className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    arch === 'intel' ? 'bg-cyber-700 border-white/20 ring-1 ring-white/20' : 'bg-cyber-900/50 border-cyber-700 opacity-60 hover:opacity-100'
                  }`}
                >
                   <div className="font-black text-white text-lg">Intel</div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Old Mac</div>
                </button>
             </div>

             <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3">
               <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
               <div className="space-y-1">
                 <p className="text-xs text-yellow-200 font-bold">{t('macos_gatekeeper_title')}</p>
                 <p className="text-[10px] text-yellow-200/70 leading-relaxed">
                   {t('macos_gatekeeper')}
                 </p>
                 <code className="block mt-2 bg-black/30 p-2 rounded text-[10px] font-mono text-yellow-300">
                   xattr -cr ciadpi-aarch64
                 </code>
               </div>
             </div>
          </div>

          <div className="bg-cyber-800 p-6 md:p-8 rounded-[2.5rem] border border-cyber-700 shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyber-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">2</div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">{t('select_strategy')}</h4>
             </div>
             
             <SniScanner onSelect={setCustomSni} />
             <div className="mt-6">
               <StrategySelector 
                  selectedId={selectedStrategyId} 
                  onSelect={setSelectedStrategyId} 
                  showCommandPreview={false} 
                  customSni={customSni}
               />
             </div>
          </div>

          {/* Command Output */}
          <div className="bg-black/80 rounded-2xl border border-gray-700 p-6 relative group shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-t-2xl"></div>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Terminal size={16} />
                  <span className="text-xs font-mono font-bold">Terminal</span>
                </div>
                <CopyButton text={`chmod +x ${binaryName.replace('./', '')} && ${macCommand}`} />
             </div>
             <pre className="text-xs font-mono text-green-400 leading-relaxed whitespace-pre-wrap break-all">
               chmod +x {binaryName.replace('./', '')} && {macCommand}
             </pre>
          </div>
        </div>
      )}

      {activeTab === 'ios' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="bg-gradient-to-br from-indigo-900/40 to-black/40 border border-indigo-500/30 p-6 rounded-3xl relative overflow-hidden">
             <div className="absolute -right-6 -top-6 bg-indigo-500/10 w-32 h-32 rounded-full blur-2xl"></div>
             <div className="relative z-10">
                <h3 className="font-black text-white text-lg mb-2">{t('ios_title')}</h3>
                <p className="text-indigo-200/70 text-sm leading-relaxed mb-4">
                  {t('ios_subtitle')}
                </p>
                <div className="flex flex-wrap gap-2">
                   <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-500/30">V2Box</span>
                   <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-[10px] font-bold border border-purple-500/30">Shadowrocket</span>
                   <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-[10px] font-bold border border-orange-500/30">Streisand</span>
                </div>
             </div>
          </div>

          <div className="bg-cyber-800 p-6 rounded-[2rem] border border-cyber-700 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <Search className="text-blue-400" size={20} />
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">{t('ios_key_inspector')}</h4>
             </div>
             
             <div className="relative mb-6">
                <input 
                  type="text" 
                  value={keyInput}
                  onChange={handleKeyChange}
                  placeholder="vless://..."
                  className="w-full bg-black/40 border border-cyber-600 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
                <Key className="absolute left-3 top-3 text-gray-500" size={14} />
             </div>

             {parsedKey ? (
               <div className="bg-blue-900/10 rounded-xl border border-blue-500/20 p-4 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-4">
                     <Check className="text-green-400" size={16} />
                     <span className="text-xs font-bold text-blue-200">{t('ios_vless_valid')}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-black/30 p-2 rounded-lg">
                        <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t('ios_field_host')}</div>
                        <div className="text-xs text-white font-mono truncate flex items-center gap-1">
                          <Server size={10} className="text-gray-400"/> {parsedKey.host}
                        </div>
                     </div>
                     <div className="bg-black/30 p-2 rounded-lg">
                        <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t('ios_field_sni')}</div>
                        <div className="text-xs text-green-300 font-mono truncate flex items-center gap-1">
                          <Globe size={10} className="text-gray-400"/> {parsedKey.sni}
                        </div>
                     </div>
                     <div className="bg-black/30 p-2 rounded-lg">
                        <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t('ios_field_security')}</div>
                        <div className="text-xs text-white font-mono truncate flex items-center gap-1">
                          <ShieldCheck size={10} className="text-gray-400"/> {parsedKey.security}
                        </div>
                     </div>
                     <div className="bg-black/30 p-2 rounded-lg">
                        <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t('ios_field_proto')}</div>
                        <div className="text-xs text-white font-mono truncate">{parsedKey.type}</div>
                     </div>
                  </div>
                  
                  {parsedKey.sni === 'none' && (
                    <div className="mt-3 text-[10px] text-orange-300 bg-orange-900/20 p-2 rounded border border-orange-500/20 flex gap-2">
                       <AlertTriangle size={12} className="shrink-0" />
                       {t('ios_warn_no_sni')}
                    </div>
                  )}
               </div>
             ) : keyInput ? (
               <div className="text-center p-4 text-xs text-red-400 bg-red-900/10 rounded-xl border border-red-900/20">
                  {t('ios_err_invalid')}
               </div>
             ) : (
               <div className="text-center p-8 text-gray-600 text-xs border border-dashed border-cyber-700 rounded-xl">
                  {t('ios_hint_paste')}
               </div>
             )}
          </div>

          <div className="bg-cyber-800 p-6 rounded-[2rem] border border-cyber-700">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyber-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">?</div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wide">{t('ios_help_step')}</h4>
             </div>
             <ol className="space-y-4 ml-2 border-l border-cyber-700 pl-6 relative">
                <li className="relative">
                   <span className="absolute -left-[31px] bg-cyber-900 border border-cyber-600 rounded-full w-2.5 h-2.5 mt-1.5"></span>
                   <p className="text-sm font-bold text-white mb-1">{t('ios_step_1')}</p>
                   <p className="text-xs text-gray-400">{t('ios_step_1_desc')}</p>
                </li>
                <li className="relative">
                   <span className="absolute -left-[31px] bg-cyber-900 border border-cyber-600 rounded-full w-2.5 h-2.5 mt-1.5"></span>
                   <p className="text-sm font-bold text-white mb-1">{t('ios_step_2')}</p>
                   <p className="text-xs text-gray-400">{t('ios_step_2_desc')}</p>
                </li>
                <li className="relative">
                   <span className="absolute -left-[31px] bg-cyber-900 border border-cyber-600 rounded-full w-2.5 h-2.5 mt-1.5"></span>
                   <p className="text-sm font-bold text-white mb-1">{t('ios_step_3')}</p>
                   <p className="text-xs text-gray-400">{t('ios_step_3_desc')}</p>
                </li>
             </ol>
          </div>
        </div>
      )}
    </div>
  );
};
