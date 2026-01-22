
// Knowledge is informational, not prescriptive

/**
 * RU Whitelist Observations
 * 
 * Static analysis data regarding specific domains in the RU region.
 * Used for context awareness and explaining routing decisions.
 * 
 * NOT used for execution logic.
 */

export const RU_WHITELIST_OBSERVATIONS = [
  {
    domain: 'st.ozone.ru',
    category: 'RETAIL_INFRASTRUCTURE',
    observation: 'Высокоэффективный SNI. Подтверждена работа на МТС, Мегафон, T2, Yota. Часто находится в "неприкасаемых" списках DPI для обеспечения работы e-commerce.',
    trustLevel: 'HIGH'
  },
  {
    domain: 'stats.vk-portal.net',
    category: 'SOCIAL_INFRASTRUCTURE',
    observation: 'Технический домен VK. Стабильно работает на МТС, Мегафон, T2, Ростелеком. Используется для внутренней телеметрии, поэтому редко блокируется.',
    trustLevel: 'HIGH'
  },
  {
    domain: 'splitter.wb.ru',
    category: 'RETAIL_INFRASTRUCTURE',
    observation: 'Технический балансировщик Wildberries. Работает на большинстве мобильных операторов (МТС, Мегафон, Yota). Альтернатива Ozon.',
    trustLevel: 'HIGH'
  },
  {
    domain: 'goya.rutube.ru',
    category: 'MEDIA_INFRASTRUCTURE',
    observation: 'Видео-CDN Rutube. Пропускается DPI на МТС, Мегафон и T2 для обеспечения потокового видео. Хороший кандидат для SNI.',
    trustLevel: 'MEDIUM'
  },
  {
    domain: 'alfabank.ru',
    category: 'FINANCE_INFRASTRUCTURE',
    observation: 'Банковский сектор. Требует прямого соединения (Direct/Split Tunneling). Работа через прокси часто приводит к разрыву сессии безопасности.',
    trustLevel: 'CRITICAL'
  },
  {
    domain: 'tbank.ru',
    category: 'FINANCE_INFRASTRUCTURE',
    observation: 'Т-Банк (Тинькофф). Критическая инфраструктура. Обязательно исключать из туннелирования во избежание блокировки ЛК.',
    trustLevel: 'CRITICAL'
  },
  {
    domain: 'moscow.megafon.ru',
    category: 'TECH_INFRASTRUCTURE',
    observation: 'Инфраструктурный домен Мегафона. Может быть эффективен как SNI внутри сети самого оператора (Intranet spoofing).',
    trustLevel: 'MEDIUM'
  },
  {
    domain: 'beeline.ru',
    category: 'RISK_ZONE',
    observation: 'На сети Билайн наблюдается аномально высокий уровень фильтрации SNI. Большинство стандартных мимикрий (Ozon/VK) могут не работать.',
    trustLevel: 'LOW'
  },
  {
    domain: 'gosuslugi.ru',
    category: 'GOV_INFRASTRUCTURE',
    observation: 'Портал Госуслуг. Недоступен из-за пределов РФ. При использовании VPN/Proxy часто недоступен. Требует прямого подключения.',
    trustLevel: 'CRITICAL'
  }
] as const;