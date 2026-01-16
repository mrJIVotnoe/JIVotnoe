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
    domain: 'www.ozon.ru',
    category: 'RETAIL_INFRASTRUCTURE',
    observation: 'Критически важный узел e-commerce. Часто находится в белых списках провайдеров (MTS, Megafon) для обеспечения работы платежей.',
    trustLevel: 'HIGH'
  },
  {
    domain: 'wb.ru',
    category: 'RETAIL_INFRASTRUCTURE',
    observation: 'Высоконагруженный узел Wildberries. Исторически наблюдалась высокая проходимость TLS handshakes без DPI фильтрации.',
    trustLevel: 'HIGH'
  },
  {
    domain: 'vk.com',
    category: 'SOCIAL_INFRASTRUCTURE',
    observation: 'Внутренняя социальная сеть. Трафик к этому домену обычно не подвергается шейпингу, но может анализироваться.',
    trustLevel: 'MEDIUM'
  },
  {
    domain: 'gosuslugi.ru',
    category: 'GOV_INFRASTRUCTURE',
    observation: 'Государственный портал. Требует прямого соединения (Direct) из-за проверки российских IP адресов и TLS сертификатов (Mintsifry).',
    trustLevel: 'CRITICAL'
  },
  {
    domain: 'sberbank.ru',
    category: 'FINANCE_INFRASTRUCTURE',
    observation: 'Банковский сектор. Требует российских TLS сертификатов. Использование в туннеле приводит к разрыву соединения.',
    trustLevel: 'CRITICAL'
  }
] as const;