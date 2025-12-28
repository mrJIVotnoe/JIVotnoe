
import { Language } from './types';

export const translations: Record<string, Record<string, string>> = {
  ru: {
    app_title: "ByeDPI Mate",
    subtitle: "v2.0.3 • AI-Powered • Manager Edition",
    tab_android: "Android / TV",
    tab_windows: "Windows",
    tab_linux: "Linux (Desktop)",
    tab_pc_settings: "Настройка Браузера",
    tab_vpn: "VPN + Регион",
    tab_ios: "iOS (iPhone/iPad)",
    tab_whitelist: "Белые Списки",
    tab_faq: "FAQ",
    tab_ai: "AI Аналитик",
    
    // AI Analyst
    ai_title: "Нейро-Аналитик Gemini",
    ai_desc: "Опишите устройство и проблему. Я подберу стратегию: ByeDPIManager (Android), ciadpi (ПК) или VLESS (iOS).",
    ai_placeholder: "Пример: iPhone 15, YouTube не грузит... или Ubuntu, тормозит видео...",
    ai_btn: "АНАЛИЗИРОВАТЬ СИТУАЦИЮ",
    ai_thinking: "АНАЛИЗ КОНТЕКСТА...",
    ai_result_title: "План действий от ИИ:",
    ai_no_input: "Пожалуйста, опишите ваше устройство и проблему.",
    ai_error: "Ошибка связи с нейросетью. Попробуйте позже.",
    
    // Feedback
    feedback_rate_title: "Этот совет помог?",
    feedback_thanks: "Спасибо за отзыв! Мы станем умнее.",
    feedback_report_issue: "Сообщить об ошибке",
    feedback_send_to_bot: "ОТПРАВИТЬ В ПОДДЕРЖКУ",
    feedback_placeholder: "Опишите, что пошло не так...",
    
    // iOS
    ios_impossibility: "ByeDPI невозможен на iOS",
    ios_solution: "Используйте VLESS / Reality протоколы через приложение V2Box.",

    // Linux
    linux_perm_cmd: "chmod +x ciadpi-x86_64",
    linux_run_hint: "Запускайте через sudo для работы на низких портах.",

    // Global
    local_sni_example: "www.ozon.ru",
    research_footer: "GLOBAL NETWORK NEUTRALITY INITIATIVE // BYEDPI MATE PROJECT 2025",
    recommended_badge: "ТОП ВЫБОР",
    command_preview: "Настройки (Arguments)",
    copy_all: "Копировать всё",
    start_btn: "Скачать ByeDPI"
  },
  en: {
    app_title: "ByeDPI Mate",
    subtitle: "v2.0.3 • AI-Powered • Manager Edition",
    tab_android: "Android / TV",
    tab_windows: "Windows",
    tab_linux: "Linux (Desktop)",
    tab_pc_settings: "Browser Settings",
    tab_vpn: "VPN + Region",
    tab_ios: "iOS (iPhone)",
    tab_whitelist: "Whitelist",
    tab_faq: "FAQ",
    tab_ai: "AI Analyst",

    ai_title: "Gemini Neuro-Analyst",
    ai_desc: "Describe your device and issue. I'll pick a strategy.",
    ai_btn: "ANALYZE SITUATION",
    ai_thinking: "SCANNING...",
    ai_result_title: "AI Action Plan:",
    
    feedback_rate_title: "Was this helpful?",
    feedback_thanks: "Thanks! We're getting smarter.",
    feedback_report_issue: "Report Issue",
    feedback_send_to_bot: "SEND TO SUPPORT",
    
    research_footer: "GLOBAL NETWORK NEUTRALITY INITIATIVE // BYEDPI MATE PROJECT 2025"
  }
};
