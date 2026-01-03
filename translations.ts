
import { Language } from './types';

export const translations: Record<string, Record<string, string>> = {
  ru: {
    app_title: "ByeDPI Mate",
    subtitle: "v1.1.0 • Neural Sentinel • 2025",
    tab_android: "Android / TV",
    tab_windows: "Windows",
    tab_linux: "Linux",
    tab_pc_settings: "Настройка PC",
    tab_vpn: "VPN + Регион",
    tab_ios: "iOS (Apple)",
    tab_whitelist: "Белые Списки",
    tab_faq: "FAQ",
    tab_ai: "AI Аналитик",
    
    // Linux Specific
    linux_title: "Linux: Оркестрация Свободы",
    linux_desc: "От Ubuntu до Arch. Настройка туннеля для настоящих дирижеров системы.",
    linux_mode_desktop: "Desktop (GUI)",
    linux_mode_server: "Server / CLI",
    linux_systemd: "Автозапуск (systemd)",
    linux_security_warn: "Безопасность: Не используйте sudo для портов > 1024.",
    linux_env_vars: "Переменные окружения",
    linux_distro_tip: "Arch User? Ищите 'byedpi' в AUR для лучшей интеграции.",
    
    // AI Analyst
    ai_title: "Маэстро Нейро-Аналитики",
    ai_desc: "Опишите устройство и проблему. Я подберу симфонию обхода блокировок.",
    ai_placeholder: "Например: Xiaomi TV, YouTube тормозит... или iPhone, не открывается Google...",
    ai_btn: "АНАЛИЗИРОВАТЬ",
    ai_thinking: "ОРКЕСТРОВКА РЕШЕНИЯ...",
    ai_result_title: "Партитура действий:",
    ai_no_input: "Маэстро ждет описания вашей проблемы.",
    ai_error: "Диссонанс в сети. Проверьте Neural Bridge.",
    
    // Global
    maestro_welcome: "Добро пожаловать в мир, где вы дирижер своего трафика.",
    local_sni_example: "www.ozon.ru",
    research_footer: "GLOBAL NETWORK NEUTRALITY // BYEDPI MATE PROJECT 2025",
    recommended_badge: "ТОП",
    command_preview: "Аргументы запуска",
    copy_all: "Копировать всё",
    start_btn: "Скачать ByeDPI",
    win_how_it_works: "Запуск на Windows",
    win_how_it_works_desc: "Программа ciadpi.exe создает локальный туннель для вашего трафика.",
    win_step_1: "Загрузка",
    win_step_2: "Стратегия",
    win_step_3: "Автоматизация",
    win_auto_title: "Режим авто-настройки (.cmd)",
    win_emergency: "Сброс сети",
    analyst_tip: "Совет:",
    analyst_tip_text: "Используйте режим фрагментации для обхода глубокого анализа пакетов.",
    select_strategy: "Выбор стратегии",
    too_hard: "Проблемы со связью?",
    too_hard_desc: "Если интернет работает нестабильно, попробуйте упрощенный SNI.",
    feedback_rate_title: "Это было полезно?",
    feedback_thanks: "Спасибо! Мы учтем ваш отзыв.",
    feedback_report_issue: "Сообщить об ошибке",
    feedback_send_to_bot: "НАПИСАТЬ В ПОДДЕРЖКУ"
  },
  en: {
    app_title: "ByeDPI Mate",
    subtitle: "v1.1.0 • Neural Sentinel • 2025",
    tab_ai: "AI Analyst",
    ai_title: "Maestro Neuro-Analyst",
    ai_desc: "Describe your device and issue. I'll compose a bypass symphony.",
    linux_title: "Linux: Orchestrating Freedom",
    linux_mode_desktop: "Desktop (GUI)",
    linux_mode_server: "Server / CLI",
    linux_systemd: "Auto-start (systemd)",
    ai_btn: "ANALYZE",
    ai_thinking: "ORCHESTRATING...",
    ai_result_title: "Action Score:",
    research_footer: "GLOBAL NETWORK NEUTRALITY // BYEDPI MATE PROJECT 2025",
    copy_all: "Copy All",
    start_btn: "Get ByeDPI",
    command_preview: "Launch Args",
    recommended_badge: "TOP"
  }
};
