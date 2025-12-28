
import { Language } from './types';

export const translations: Record<string, Record<string, string>> = {
  ru: {
    app_title: "ByeDPI Mate",
    subtitle: "v2.0.2 • AI-Powered • Manager Edition",
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
    ai_desc: "Опишите проблему. Я подберу стратегию, подходящую для ByeDPIManager на Android или ciadpi на ПК.",
    ai_placeholder: "Пример: Ростелеком, YouTube тормозит, Android TV...",
    ai_btn: "АНАЛИЗИРОВАТЬ СИТУАЦИЮ",
    ai_thinking: "АНАЛИЗ ПРОТОКОЛОВ...",
    ai_result_title: "Рекомендация ИИ:",
    ai_no_input: "Пожалуйста, введите описание проблемы.",
    ai_error: "Ошибка связи с нейросетью. Попробуйте позже.",
    
    // Android Guide (Final User Edition - NO ROOT)
    android_install_title: "ByeDPIManager (v0.3.8+)",
    android_download_desc: "Самая современная и стабильная версия для Android. Работает на всех смартфонах и приставках как обычное приложение.",
    android_which_file: "Установка",
    android_file_desc_apk: "Универсальный файл для телефонов, планшетов и Android TV.",
    android_download_btn: "Скачать Manager (GitHub)",
    android_instr_1: "Автоматический режим",
    android_instr_1_desc: "Приложение само создаст защищенное соединение. Вам не нужно ничего настраивать в системе.",
    android_instr_2: "Настройка стратегии",
    android_instr_2_desc: "Нажмите на поле 'Arguments' и вставьте команду, которую предложит наш AI или выберите из списка.",
    android_instr_3: "Настройка DNS",
    android_instr_3_desc: "Включите опцию 'DNS over HTTPS' (DoH). Это поможет, если провайдер блокирует доступ на уровне имен сайтов.",
    android_instr_4: "Выбор приложений",
    android_instr_4_desc: "Используйте 'Exclude apps' (Исключить приложения), чтобы банковские сервисы и Госуслуги работали без задержек.",
    android_instr_5: "Запуск обхода",
    android_instr_5_desc: "Нажмите 'Connect'. Иконка ключа в статус-баре означает, что всё работает.",

    // FAQ
    faq_title: "Решение проблем",
    faq_q1: "Почему интернет пропадает сразу после запуска?",
    faq_a1: "Чаще всего это блокировка DNS провайдером. Просто включите DoH (DNS over HTTPS) в настройках ByeDPIManager.",
    faq_q2: "Это безопасно для моего телефона?",
    faq_a2: "Да, приложение работает в рамках стандартных разрешений Android и не требует опасного вмешательства в систему.",
    faq_q3: "Как понять, что магия сработала?",
    faq_a3: "Откройте YouTube в приложении. Если 4K видео грузится без задержек — вы всё сделали правильно.",

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
    subtitle: "v2.0.2 • AI-Powered • Manager Edition",
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
    ai_desc: "Describe your issue. I'll pick a strategy for ByeDPIManager (Android) or ciadpi (PC).",
    ai_placeholder: "Example: YouTube is slow, Android TV...",
    ai_btn: "ANALYZE SITUATION",
    ai_thinking: "SCANNING PROTOCOLS...",
    ai_result_title: "AI Recommendation:",
    ai_no_input: "Please enter a description of the problem.",
    ai_error: "AI connection error. Try again later.",
    
    android_install_title: "ByeDPIManager (v0.3.8+)",
    android_download_desc: "The most stable Android version. Works on all devices like a standard app. No root needed.",
    android_download_btn: "Download Manager (GitHub)",
    android_instr_1: "Automatic Mode",
    android_instr_1_desc: "The app creates a secure profile automatically. No system changes required.",
    android_instr_2: "Strategy Setup",
    android_instr_2_desc: "Tap 'Arguments' and paste the command string provided below.",
    android_instr_3: "DNS Security",
    android_instr_3_desc: "Enable 'DNS over HTTPS' (DoH) for better stability against ISP filters.",
    android_instr_4: "Exclusions",
    android_instr_4_desc: "Use 'Exclude apps' for banking and local services to keep them fast.",
    android_instr_5: "Ready to Go",
    android_instr_5_desc: "Hit 'Connect'. Look for the key icon in your status bar.",
    
    research_footer: "GLOBAL NETWORK NEUTRALITY INITIATIVE // BYEDPI MATE PROJECT 2025"
  }
};
