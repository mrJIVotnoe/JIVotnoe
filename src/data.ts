
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
      es: "Cúpula de Hierro (Ozon)",
      zh: "铁穹系统 (Ozon)",
      tr: "Demir Kubbe (Ozon)",
      uz: "Temir Gumbaz (Ozon)",
      kk: "Темір Күмбез (Ozon)"
    },
    description: {
      ru: "Рекомендуемая стратегия. Мимикрия под Ozon.ru (критическая инфраструктура).",
      en: "Recommended strategy. Mimics Ozon.ru (critical infrastructure) traffic.",
      uk: "Рекомендована стратегія. Мімікрія під Ozon.ru.",
      de: "Empfohlene Strategie. Ahmt Ozon.ru nach.",
      fr: "Stratégie recommandée. Imite Ozon.ru.",
      es: "Estrategia recomendada. Imita o Ozon.ru.",
      zh: "推荐策略。模仿 Ozon.ru（关键基础设施）流量。",
      tr: "Önerilen strateji. Ozon.ru trafiğini taklit eder.",
      uz: "Tavsiya etilgan strategiya. Ozon.ru trafigini simulyatsiya qiladi.",
      kk: "Ұсынылатын стратегия. Ozon.ru трафигін имитациялайды."
    },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n www.ozon.ru -Qr -f-1 -a1",
    tags: ["MTS", "Global", "Stable"],
    recommended: true
  },
  {
    id: StrategyType.SHUTDOWN_WB,
    name: {
      ru: "Wildberries (Спецрезерв)",
      en: "Wildberries (Special)",
      uk: "Wildberries (Спецрезерв)",
      zh: "Wildberries (特殊)"
    },
    description: {
      ru: "Эффективная стратегия мимикрии под маркетплейс WB.",
      en: "Effective strategy mimicking Wildberries marketplace.",
      uk: "Ефективна стратегія мімікрії під WB.",
      zh: "有效的 Wildberries 模仿策略。"
    },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n splitter.wb.ru -Qr -f-1 -a1",
    tags: ["T2", "Megafon", "Beeline"],
    recommended: false
  },
  {
    id: StrategyType.SHUTDOWN_VK,
    name: { ru: "VK Tech (Backup)", en: "VK Tech (Backup)", zh: "VK 技术 (备用)", tr: "VK Tech (Yedek)" },
    description: { ru: "Использует технический домен VK.", en: "Uses VK technical domain.", zh: "使用 VK 技术域名。", tr: "VK teknik alan adını kullanır." },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n stats.vk-portal.net -Qr -f-1 -a1",
    tags: ["Universal", "Backup"],
    recommended: false
  },
  {
    id: StrategyType.TELEGRAM_FIX,
    name: { ru: "Telegram Randomizer", en: "Telegram Randomizer" },
    description: { ru: "Агрессивная рандомизация.", en: "Aggressive randomization." },
    command: "-o1 -r-5+se -a1:5+s -At,r,s -d1:2+s -n www.google.com -Qr -f-1",
    tags: ["High Load", "Unstable"],
    recommended: false
  },
  {
    id: StrategyType.STANDARD,
    name: { ru: "Global (Google)", en: "Global (Google)", zh: "全球 (Google)", tr: "Küresel (Google)" },
    description: { ru: "Базовая стратегия (Google SNI).", en: "Basic strategy with Google SNI.", zh: "使用 Google SNI 的基础策略。", tr: "Google SNI ile temel strateji." },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n www.google.com -Qr -f-1 -a1",
    tags: ["Legacy", "International"],
    recommended: false
  }
];

export const DNS_SERVERS: DnsProvider[] = [
  {
    name: "Quad9",
    primary: "9.9.9.9",
    secondary: "149.112.112.112",
    description: {
      ru: "Безопасность и нейтральность.",
      en: "Security and neutrality.",
      zh: "安全与中立。",
      tr: "Güvenlik ve tarafsızlık."
    },
    type: "security"
  },
  {
    name: "AdGuard DNS",
    primary: "94.140.14.14",
    secondary: "94.140.15.15",
    description: { ru: "Блокировка рекламы.", en: "Ad blocking.", zh: "广告拦截。", tr: "Reklam engelleme." },
    type: "privacy"
  }
];

export interface WhitelistEntry {
  domain: string;
  category: 'finance' | 'retail' | 'tech' | 'social' | 'gov';
  note?: string;
}

export interface RegionWhitelist {
  id: string;
  name: string;
  flag: string;
  mimicry: WhitelistEntry[]; 
  bypass: WhitelistEntry[];   
}

export const REGIONAL_DATA: RegionWhitelist[] = [
  {
    id: 'global',
    name: 'Global / Universal',
    flag: '🌐',
    mimicry: [
      { domain: 'www.google.com', category: 'tech', note: 'Universal' },
      { domain: 'www.microsoft.com', category: 'tech', note: 'Trusted' },
      { domain: 'www.apple.com', category: 'tech', note: 'Trusted' }
    ],
    bypass: [
      { domain: 'accounts.google.com', category: 'tech' },
      { domain: 'icloud.com', category: 'tech' }
    ]
  },
  {
    id: 'ru',
    name: 'Russia',
    flag: '🇷🇺',
    mimicry: [
      { domain: 'www.ozon.ru', category: 'retail', note: 'Best for MTS' },
      { domain: 'stats.vk-portal.net', category: 'social', note: 'Universal' },
      { domain: 'splitter.wb.ru', category: 'retail', note: 'Alternative' }
    ],
    bypass: [
      { domain: 'online.sberbank.ru', category: 'finance' },
      { domain: 'www.gosuslugi.ru', category: 'gov' },
      { domain: 'vk.com', category: 'social' }
    ]
  },
  {
    id: 'kz',
    name: 'Kazakhstan',
    flag: '🇰🇿',
    mimicry: [
      { domain: 'kolesa.kz', category: 'retail' },
      { domain: 'krisha.kz', category: 'retail' }
    ],
    bypass: [
      { domain: 'kaspi.kz', category: 'finance' },
      { domain: 'egov.kz', category: 'gov' }
    ]
  },
  {
    id: 'uz',
    name: 'Uzbekistan',
    flag: '🇺🇿',
    mimicry: [
      { domain: 'olx.uz', category: 'retail' },
      { domain: 'uzum.uz', category: 'retail' }
    ],
    bypass: [
      { domain: 'payme.uz', category: 'finance' },
      { domain: 'my.gov.uz', category: 'gov' }
    ]
  },
  {
    id: 'cn',
    name: 'China',
    flag: '🇨🇳',
    mimicry: [
      { domain: 'www.baidu.com', category: 'tech' },
      { domain: 'www.taobao.com', category: 'retail' },
      { domain: 'v.qq.com', category: 'social' }
    ],
    bypass: [
      { domain: 'alipay.com', category: 'finance' },
      { domain: 'wechat.com', category: 'social' }
    ]
  }
];
