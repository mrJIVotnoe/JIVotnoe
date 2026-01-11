import React from 'react';
import { Globe, Shield, Smartphone, Monitor, Lock, Puzzle } from 'lucide-react';
import { CopyButton } from '../../../shared/ui/CopyButton';
import { useLanguage } from '../../localization/LanguageContext';
import { IpChecker } from './IpChecker';

export const VpnRegionGuide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="bg-gradient-to-r from-purple-900/40 to-cyber-800 p-6 rounded-xl border border-purple-800/50">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Globe className="text-purple-400" />
          {t('vpn_intro_title')}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {t('vpn_intro_desc')}
        </p>
      </div>

      {/* IP Checker Tool */}
      <IpChecker />

      {/* WINDOWS SECTION */}
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Monitor className="text-blue-400" />
          Windows: Комбинированные методы
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Выберите подходящий способ, чтобы получить иностранный IP-адрес поверх ByeDPI.
        </p>

        <div className="space-y-6">
          {/* Method 1: Extensions */}
          <div className="bg-gradient-to-r from-blue-900/20 to-black/30 p-4 rounded-lg border border-blue-800/30">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Puzzle className="text-blue-400" size={18} />
              {t('vpn_method_1')}
            </h4>
            <div className="flex flex-col gap-4">
               <div>
                 <p className="text-xs text-gray-300 mb-3">
                   {t('vpn_method_1_desc')}
                 </p>
                 
                 <div className="bg-orange-900/30 border border-orange-500/30 p-3 rounded mb-4">
                    <p className="text-xs text-orange-200">
                       <span className="font-bold uppercase">⚠️ Критически важно: Соблюдайте порядок!</span><br/>
                       Опытным путем установлено: сначала нужно запустить <b>ByeDPI</b> (дождаться появления черного окна), и только <b>ПОТОМ</b> включать расширение в браузере. Иначе расширение может не соединиться с сервером.
                    </p>
                 </div>
               </div>

               {/* TECHNICAL DEEP DIVE BLOCK */}
               <div className="mt-2 p-4 bg-black/40 rounded-lg border border-cyber-700/50">
                  <h5 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                    <span className="text-lg">🤓</span> {t('vpn_vs_byedpi_title')}
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-900/10 p-3 rounded border border-blue-900/30">
                      <div className="text-sm font-bold text-blue-300 mb-2">{t('vpn_vs_byedpi_1_title')}</div>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {t('vpn_vs_byedpi_1_desc')}
                      </p>
                    </div>
                    <div className="bg-green-900/10 p-3 rounded border border-green-900/30">
                      <div className="text-sm font-bold text-green-300 mb-2">{t('vpn_vs_byedpi_2_title')}</div>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {t('vpn_vs_byedpi_2_desc')}
                      </p>
                    </div>
                  </div>
               </div>

            </div>
          </div>

          {/* Method 2: Tor */}
          <div className="bg-black/30 p-4 rounded-lg border border-cyber-700">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="text-purple-500" size={18} />
              {t('vpn_method_2')}
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              {t('vpn_method_2_desc')}
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
              <li>Запустите <b>ByeDPI</b> (run.cmd из вкладки Windows).</li>
              <li>Откройте <b>Tor Browser</b>.</li>
              <li>Настройки {'>'} Подключение {'>'} Дополнительно {'>'} Конфигурация прокси.</li>
              <li>
                <span className="text-gray-400">Тип:</span> SOCKS5, 
                <span className="text-gray-400 ml-2">Адрес:</span> 127.0.0.1, 
                <span className="text-gray-400 ml-2">Порт:</span> 1080
              </li>
              <li>Нажмите "Соединиться". Теперь Tor работает через ByeDPI.</li>
            </ol>
          </div>

          {/* Method 3: OpenVPN */}
          <div className="bg-black/30 p-4 rounded-lg border border-cyber-700">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="text-orange-500" size={18} />
              {t('vpn_method_3')}
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              {t('vpn_method_3_desc')}
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
              <li>Запустите <b>ByeDPI</b> (run.cmd).</li>
              <li>Откройте приложение <b>OpenVPN Connect</b>.</li>
              <li>Зайдите в Settings (Настройки) {'>'} Proxy.</li>
              <li>Выберите <b>Manual Configuration</b> {'>'} <b>SOCKS5</b>.</li>
              <li className="bg-black/40 p-2 rounded border border-cyber-600/50 flex items-center justify-between">
                <code className="text-green-400 font-mono">127.0.0.1:1080</code>
                <CopyButton text="127.0.0.1" className="h-6 w-6 p-1" />
              </li>
              <li>Попробуйте подключиться к VPN (желательно TCP).</li>
            </ol>
          </div>
        </div>
      </div>

      {/* ANDROID SECTION */}
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Smartphone className="text-green-400" />
          Android: NekoBox
        </h3>
        
        <div className="bg-red-900/20 border-l-4 border-red-500 p-3 mb-4 rounded-r">
          <p className="text-xs text-red-200">
            <b>Важно:</b> На Android нельзя запустить ByeDPI и VPN одновременно (система не дает). Нужно одно приложение, которое умеет всё.
          </p>
        </div>

        <p className="text-gray-300 text-sm mb-4">
          Лучшее решение — <b>NekoBox for Android</b>. Это мощный клиент, который умеет делать фрагментацию пакетов (как ByeDPI) и туннелировать трафик на зарубежный сервер.
        </p>

        <div className="space-y-4">
           <div className="flex items-start gap-3">
             <div className="bg-cyber-700 text-white font-bold h-6 w-6 rounded flex items-center justify-center shrink-0 text-xs">1</div>
             <div>
               <h4 className="text-sm font-bold text-gray-200">Скачайте NekoBox</h4>
               <p className="text-xs text-gray-400 mt-1">Доступен на GitHub или в Google Play (Matsuri/NekoBox).</p>
             </div>
           </div>

           <div className="flex items-start gap-3">
             <div className="bg-cyber-700 text-white font-bold h-6 w-6 rounded flex items-center justify-center shrink-0 text-xs">2</div>
             <div>
               <h4 className="text-sm font-bold text-gray-200">Найдите сервер (Config)</h4>
               <p className="text-xs text-gray-400 mt-1">Вам нужен ключ VLESS или Shadowsocks (как в инструкции для iOS).</p>
             </div>
           </div>

           <div className="flex items-start gap-3">
             <div className="bg-cyber-700 text-white font-bold h-6 w-6 rounded flex items-center justify-center shrink-0 text-xs">3</div>
             <div>
               <h4 className="text-sm font-bold text-gray-200">Включите "Фрагментацию" (Trick)</h4>
               <p className="text-xs text-gray-400 mt-1">
                 Если сервер не подключается, откройте настройки профиля в NekoBox → Редактировать → <b>AllowInsecure</b> или настройки ядра <b>Fragment</b>.
                 <br/>
                 В большинстве случаев протоколы <b>VLESS-Reality</b> работают сами по себе без доп. настроек.
               </p>
             </div>
           </div>

           <a 
            href="https://github.com/MatsuriDayo/NekoBoxForAndroid/releases" 
            target="_blank" 
            rel="noreferrer"
            className="block w-full bg-green-700/50 hover:bg-green-600/50 border border-green-600 text-center py-2 rounded-lg text-green-100 text-sm font-bold transition-colors mt-2"
           >
             Скачать NekoBox (GitHub)
           </a>
        </div>
      </div>
    </div>
  );
};