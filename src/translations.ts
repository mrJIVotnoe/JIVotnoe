
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
    
    // iOS (Important for AI)
    ios_impossibility: "ByeDPI невозможен на iOS",
    ios_solution: "Используйте VLESS / Reality протоколы через приложение V2Box.",

    // Linux (Important for AI)
    linux_perm_cmd: "chmod +x ciadpi-x86_64",
    linux_run_hint: "Запускайте через sudo для работы на низких портах.",

    // Android Guide
    android_install_title: "ByeDPIManager (v0.3.8+)",
    android_download_desc: "Самая современная версия. Работает на всех Android без Root-прав.",
    android_download_btn: "Скачать Manager (GitHub)",
    android_instr_1: "VPN Режим",
    android_instr_1_desc: "Работает как обычный VPN, не требует вмешательства в систему.",
    android_instr_2: "Поле Arguments",
    android_instr_2_desc: "Скопируйте строку ниже и вставьте её в настройки приложения (Arguments).",
    android_instr_5: "Готово",
    android_instr_5_desc: "Нажмите 'Connect'. Если значок ключа появился — обход активен.",

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
    ai_desc: "Describe your device and issue. I'll pick a strategy: ByeDPIManager, ciadpi, or VLESS.",
    ai_placeholder: "Example: iPhone 15, YouTube is slow... or Linux, video buffers...",
    ai_btn: "ANALYZE SITUATION",
    ai_thinking: "SCANNING CONTEXT...",
    ai_result_title: "AI Action Plan:",
    ai_no_input: "Please describe your device and problem.",
    ai_error: "AI connection error. Try again later.",
    
    ios_impossibility: "ByeDPI is impossible on iOS",
    ios_solution: "Use VLESS / Reality protocols via V2Box app.",
    
    research_footer: "GLOBAL NETWORK NEUTRALITY INITIATIVE // BYEDPI MATE PROJECT 2025"
  }
};
