import { StrategyType, StrategyConfig, DnsProvider } from './types';

export const STRATEGIES: StrategyConfig[] = [
  {
    id: StrategyType.SHUTDOWN_OZON,
    name: {
      ru: "Железный Купол (Ozon)",
      en: "Iron Dome (Ozon)",
      uk: "Залізний Купол (Ozon)",
      de: "Eiserne Kuppel (Ozon)",
      fr: "Dôme de Fer (Ozon)",
      es: "Cúpula de Hierro (Ozon)"
    },
    description: {
      ru: "Рекомендуемая стратегия. Мимикрия под Ozon.ru (критическая инфраструктура).",
      en: "Recommended strategy. Mimics Ozon.ru (critical infrastructure) traffic.",
      uk: "Рекомендована стратегія. Мімікрія під Ozon.ru (критична інфраструктура).",
      de: "Empfohlene Strategie. Ahmt Ozon.ru Verkehr nach.",
      fr: "Stratégie recommandée. Imite le trafic Ozon.ru.",
      es: "Estrategia recomendada. Imita el tráfico de Ozon.ru."
    },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n www.ozon.ru -Qr -f-1 -a1",
    tags: ["MTS", "Megafon", "Yota", "Tele2", "Rostelecom"],
    recommended: true
  },
  {
    id: StrategyType.SHUTDOWN_VK,
    name: {
      ru: "VK Tech (Резерв)",
      en: "VK Tech (Backup)",
      uk: "VK Tech (Резерв)",
      de: "VK Tech (Backup)",
      fr: "VK Tech (Backup)",
      es: "VK Tech (Respaldo)"
    },
    description: {
      ru: "Использует технический домен VK. Используйте, если Ozon не работает.",
      en: "Uses VK technical domain. Use this if Ozon strategy fails.",
      uk: "Використовує технічний домен VK. Використовуйте, якщо Ozon не працює.",
      de: "Nutzt technische VK-Domain. Nutzen, falls Ozon fehlschlägt.",
      fr: "Utilise le domaine technique VK. Utilisez si Ozon échoue.",
      es: "Usa dominio técnico de VK. Úselo si Ozon falla."
    },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n stats.vk-portal.net -Qr -f-1 -a1",
    tags: ["Universal", "Backup"],
    recommended: false
  },
  {
    id: StrategyType.SHUTDOWN_WB,
    name: {
      ru: "Wildberries (Спецрезерв)",
      en: "Wildberries (Special)",
      uk: "Wildberries (Спецрезерв)",
      de: "Wildberries (Spezial)",
      fr: "Wildberries (Spécial)",
      es: "Wildberries (Especial)"
    },
    description: {
      ru: "Использует технический домен WB. Эффективен на многих операторах.",
      en: "Uses WB technical domain. Effective on many ISPs.",
      uk: "Використовує технічний домен WB. Ефективний на багатьох операторах.",
      de: "Nutzt technische WB-Domain. Effektiv bei vielen ISPs.",
      fr: "Utilise le domaine technique WB. Efficace sur de nombreux FAI.",
      es: "Usa dominio técnico WB. Efectivo en muchos ISP."
    },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n splitter.wb.ru -Qr -f-1 -a1",
    tags: ["MTS", "Megafon", "T2", "Yota"],
    recommended: false
  },
  {
    id: StrategyType.TELEGRAM_FIX,
    name: {
      ru: "Telegram Randomizer",
      en: "Telegram Randomizer",
      uk: "Telegram Randomizer",
      de: "Telegram Randomizer",
      fr: "Telegram Randomizer",
      es: "Telegram Randomizer"
    },
    description: {
      ru: "Агрессивная рандомизация для случаев, когда Telegram блокируется по сигнатуре.",
      en: "Aggressive randomization for cases when Telegram is blocked by signature.",
      uk: "Агресивна рандомізація, коли Telegram блокується за сигнатурою.",
      de: "Aggressive Randomisierung, wenn Telegram per Signatur blockiert wird.",
      fr: "Randomisation aggressive lorsque Telegram est bloqué par signature.",
      es: "Aleatorización agresiva cuando Telegram está bloqueado por firma."
    },
    command: "-o1 -r-5+se -a1:5+s -At,r,s -d1:2+s -n www.kinopoisk.ru -Qr -f-1",
    tags: ["High Load", "Unstable"],
    recommended: false
  },
  {
    id: StrategyType.STANDARD,
    name: {
      ru: "Классика (Kinopoisk)",
      en: "Classic (Kinopoisk)",
      uk: "Класика (Kinopoisk)",
      de: "Klassik (Kinopoisk)",
      fr: "Classique (Kinopoisk)",
      es: "Clásico (Kinopoisk)"
    },
    description: {
      ru: "Базовая стратегия с фрагментацией.",
      en: "Basic strategy with fragmentation.",
      uk: "Базова стратегія з фрагментацією.",
      de: "Basisstrategie mit Fragmentierung.",
      fr: "Stratégie de base avec fragmentation.",
      es: "Estrategia básica con fragmentación."
    },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n www.kinopoisk.ru -Qr -f-1 -a1",
    tags: ["Legacy"],
    recommended: false
  }
];

export const DNS_SERVERS: DnsProvider[] = [
  {
    name: "Quad9",
    primary: "9.9.9.9",
    secondary: "149.112.112.112",
    description: {
      ru: "Рекомендация по безопасности. Блокирует вредоносные домены. Нейтральный фонд.",
      en: "Security recommendation. Blocks malicious domains. Neutral foundation.",
      uk: "Рекомендація з безпеки. Блокує шкідливі домени.",
      de: "Sicherheitsempfehlung. Blockiert schädliche Domains.",
      fr: "Recommandation de sécurité. Bloque les domaines malveillants.",
      es: "Recomendación de seguridad. Bloquea dominios maliciosos."
    },
    type: "security"
  },
  {
    name: "AdGuard DNS",
    primary: "94.140.14.14",
    secondary: "94.140.15.15",
    description: {
      ru: "Защита от рекламы и трекеров. Высокая конфиденциальность.",
      en: "Ad and tracker blocking. High privacy.",
      uk: "Захист від реклами та трекерів. Висока конфіденційність.",
      de: "Werbe- und Tracker-Blocker. Hohe Privatsphäre.",
      fr: "Blocage des publicités et traceurs. Haute confidentialité.",
      es: "Bloqueo de anuncios y rastreadores. Alta privacidad."
    },
    type: "privacy"
  },
  {
    name: "Yandex DNS",
    primary: "77.88.8.8",
    secondary: "77.88.8.1",
    description: {
      ru: "Только для крайних случаев ('Шатдаун'), если зарубежные DNS недоступны.",
      en: "For extreme cases ('Shutdown') only, if foreign DNS are unavailable.",
      uk: "Тільки для крайніх випадків, якщо закордонні DNS недоступні.",
      de: "Nur für Extremfälle, wenn ausländische DNS nicht verfügbar sind.",
      fr: "Pour les cas extrêmes uniquement, si les DNS étrangers sont indisponibles.",
      es: "Solo para casos extremos, si los DNS extranjeros no están disponibles."
    },
    type: "backup"
  }
];

export const SNI_DOMAINS = [
  { domain: "stats.vk-portal.net", note: "MTS, Mega, T2, Yota, RTK" },
  { domain: "sun6-21.userapi.com", note: "MTS, Mega, T2, Yota, RTK" },
  { domain: "splitter.wb.ru", note: "MTS, Mega, T2, Yota, RTK" },
  { domain: "www.ozon.ru", note: "MTS, Mega, T2, Yota, RTK" },
  { domain: "www.kinopoisk.ru", note: "MTS, Mega, T2, Yota, RTK" },
  { domain: "goya.rutube.ru", note: "MTS, Mega, T2, RTK" },
  { domain: "dzen.ru", note: "Megafon, T2" },
  { domain: "st.ozone.ru", note: "Universal" },
  { domain: "static.beeline.ru", note: "Beeline (Testing)" },
];

export const DIRECT_DOMAINS = [
  "online.sberbank.ru",
  "www.tbank.ru",
  "alfabank.ru",
  "www.gosuslugi.ru",
  "mos.ru",
  "www.rzd.ru",
  "www.pochta.ru",
  "www.wildberries.ru",
  "www.ozon.ru",
  "avito.ru",
  "vk.com",
  "www.psbank.ru",
  "www.gazprombank.ru"
];