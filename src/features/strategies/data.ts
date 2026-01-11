import { StrategyType, StrategyConfig } from '../../types';

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
    // Template string {{SNI}} ensures we replace the correct part regardless of flag order
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n {{SNI}} -Qr -f-1 -a1",
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
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n {{SNI}} -Qr -f-1 -a1",
    tags: ["T2", "Megafon", "Beeline"],
    recommended: false
  },
  {
    id: StrategyType.SHUTDOWN_VK,
    name: { ru: "VK Tech (Backup)", en: "VK Tech (Backup)", zh: "VK 技术 (备用)", tr: "VK Tech (Yedek)" },
    description: { ru: "Использует технический домен VK.", en: "Uses VK technical domain.", zh: "使用 VK 技术域名。", tr: "VK teknik alan adını kullanır." },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n {{SNI}} -Qr -f-1 -a1",
    tags: ["Universal", "Backup"],
    recommended: false
  },
  {
    id: StrategyType.TELEGRAM_FIX,
    name: { ru: "Telegram Randomizer", en: "Telegram Randomizer" },
    description: { ru: "Агрессивная рандомизация.", en: "Aggressive randomization." },
    command: "-o1 -r-5+se -a1:5+s -At,r,s -d1:2+s -n {{SNI}} -Qr -f-1",
    tags: ["High Load", "Unstable"],
    recommended: false
  },
  {
    id: StrategyType.STANDARD,
    name: { ru: "Global (Google)", en: "Global (Google)", zh: "全球 (Google)", tr: "Küresel (Google)" },
    description: { ru: "Базовая стратегия (Google SNI).", en: "Basic strategy with Google SNI.", zh: "使用 Google SNI 的基础策略。", tr: "Google SNI ile temel strateji." },
    command: "-o1 -r-5+se -a1 -At,r,s -d1 -n {{SNI}} -Qr -f-1 -a1",
    tags: ["Legacy", "International"],
    recommended: false
  }
];