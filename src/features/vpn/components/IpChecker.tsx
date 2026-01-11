
import React, { useState } from 'react';
import { Globe, Shield, ShieldAlert, Activity, MapPin, Server, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../localization/LanguageContext';

export const IpChecker = () => {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    const checkIp = async () => {
        setLoading(true);
        setError(false);
        try {
            // ipwho.is is a free API with no key required, good for client-side demos
            const res = await fetch('https://ipwho.is/');
            const json = await res.json();
            if (!json.success) throw new Error(json.message);
            setData(json);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-cyber-900/50 rounded-3xl border border-cyber-700 p-6 relative overflow-hidden mb-6 group">
            <div className="flex items-center justify-between relative z-10 mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border border-cyber-600 transition-colors ${loading ? 'bg-cyber-800 animate-pulse' : 'bg-cyber-800'}`}>
                        {loading ? <RefreshCw className="animate-spin text-cyber-500" size={20} /> : <Activity className="text-cyber-accent" size={20} />}
                    </div>
                    <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-wide">{t('ip_checker_title')}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">{t('ip_checker_desc')}</p>
                    </div>
                </div>
                
                <button 
                    onClick={checkIp}
                    disabled={loading}
                    className="bg-cyber-700 hover:bg-cyber-600 border border-cyber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? t('ip_status_analyzing') : t('ip_btn_scan')}
                </button>
            </div>

            {data && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-2">
                    {/* IP Block */}
                    <div className="bg-black/40 p-4 rounded-2xl border border-cyber-700/50 flex flex-col justify-between group/card hover:border-cyber-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                           <Globe size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">{t('ip_label_ip')}</span>
                        </div>
                        <div className="font-mono text-xl text-white font-bold tracking-tight">{data.ip}</div>
                        <div className="h-1 w-12 bg-cyber-accent/50 rounded-full mt-2"></div>
                    </div>

                    {/* Location Block */}
                    <div className="bg-black/40 p-4 rounded-2xl border border-cyber-700/50 flex flex-col justify-between group/card hover:border-cyber-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                           <MapPin size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">{t('ip_label_country')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{data.flag.emoji}</span>
                            <div className="font-bold text-gray-200 text-sm leading-tight">
                                {data.city}, {data.country_code}
                            </div>
                        </div>
                        <div className="h-1 w-12 bg-blue-500/50 rounded-full mt-2"></div>
                    </div>

                    {/* Provider Block */}
                    <div className="bg-black/40 p-4 rounded-2xl border border-cyber-700/50 flex flex-col justify-between group/card hover:border-cyber-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                           <Server size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">{t('ip_label_isp')}</span>
                        </div>
                        <div className="font-bold text-gray-200 text-xs line-clamp-2" title={data.connection.isp}>
                            {data.connection.isp}
                        </div>
                        <div className={`mt-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${data.country_code === 'RU' ? 'text-orange-400' : 'text-green-400'}`}>
                             {data.country_code === 'RU' ? <ShieldAlert size={10} /> : <Shield size={10} />}
                             {data.country_code === 'RU' ? t('ip_status_exposed') : t('ip_status_protected')}
                        </div>
                    </div>
                </div>
            )}
            
            {error && !loading && (
                 <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl text-center">
                    <p className="text-xs text-red-300 font-bold">Connection Error</p>
                    <p className="text-[10px] text-red-400/70">Could not fetch IP details. Check your connection.</p>
                 </div>
            )}
        </div>
    );
};
