// Knowledge is informational, not prescriptive

/**
 * RU Scenario Observations
 * 
 * Descriptive context for bypass scenarios specific to the region.
 * Provides educational insight ("Why does this exist?").
 * 
 * NOT used for strategy selection logic.
 */

export const RU_SCENARIO_OBSERVATIONS = [
  {
    id: 'iron_dome_ozon',
    name: 'Железный Купол (Ozon)',
    mechanism: 'SNI Mimicry + Segmentation',
    observation: 'Стратегия использует доверие TSPU к домену Ozon.ru. Пакет ClientHello разбивается таким образом, чтобы инспектор видел легитимный SNI, но сервер игнорировал мусорные байты.',
    riskNote: 'При изменении политики белых списков Ozon стратегия перестанет работать мгновенно.'
  },
  {
    id: 'telegram_randomizer',
    name: 'Telegram Randomizer',
    mechanism: 'MTProto Heuristic Obfuscation',
    observation: 'Telegram использует проприетарный протокол MTProto поверх TCP. Стратегия вносит хаос в размеры пакетов, чтобы сбить сигнатурный анализ протокола.',
    riskNote: 'Высокая нагрузка на CPU мобильных устройств. Может вызывать нестабильность голосовых звонков.'
  },
  {
    id: 'wb_reserve',
    name: 'Wildberries Reserve',
    mechanism: 'Alternative SNI Routing',
    observation: 'Резервный канал мимикрии. Используется, когда первичные узлы (Google/Ozon) подвергаются временной блокировке или троттлингу.',
    riskNote: 'Менее стабилен на региональных провайдерах (Ростелеком Сибирь/Урал).'
  },
  {
    id: 'vk_tech_tunnel',
    name: 'VK Tech Tunnel',
    mechanism: 'Internal Infrastructure Mimicry',
    observation: 'Использование технических доменов VK (vk-portal, userapi) для маскировки. Эффективно на мобильных операторах из-за Zero-rating (бесплатного трафика) для соцсетей.',
    riskNote: 'Может быть заблокировано при глубоком анализе заголовков.'
  }
] as const;