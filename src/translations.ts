
import { Language } from './types';

export const translations: Record<string, Record<string, string>> = {
  ru: {
    app_title: "ByeDPI Mate",
    subtitle: "v1.8.0 • Финальный Билд 2025",
    tab_android: "Android / TV",
    tab_windows: "Windows",
    tab_linux: "Linux (Desktop)",
    tab_pc_settings: "Настройка Браузера",
    tab_vpn: "VPN + Регион",
    tab_ios: "iOS (iPhone/iPad)",
    tab_whitelist: "Белые Списки",
    tab_faq: "Центр Помощи (FAQ)",
    
    // Linux
    linux_title: "Linux: Максимальный комфорт",
    linux_desc: "Мы объединили мощь терминала и удобство браузера. Один раз запустили — и забыли.",
    linux_step_1: "Шаг 1: Запуск Двигателя",
    linux_step_1_desc: "Скопируйте эту команду. Она сама найдет файл, исправит DNS и запустит обход на порту 1081.",
    linux_step_2: "Шаг 2: Включите расширение",
    linux_step_2_desc: "В верхней части этого приложения (если вы в Chrome) нажмите кнопку «СВЯЗЬ АКТИВНА». Всё!",

    // FAQ
    faq_title: "Решение проблем (Rescue Kit)",
    faq_q1: "Почему интернет пропадает сразу после запуска?",
    faq_a1: "Скорее всего, провайдер блокирует DNS. В наших новых командах мы добавили принудительный DNS (8.8.8.8), это решает 99% проблем.",
    faq_q2: "Терминал просит пароль, но я его не вижу при вводе.",
    faq_a2: "Это особенность Linux. Просто введите пароль «вслепую» и нажмите Enter. Символы не будут отображаться — это нормально.",
    faq_q3: "Что делать, если я закрыл терминал и интернет перестал работать?",
    faq_a3: "Просто выключите кнопку в расширении или выполните команду сброса в терминале (она есть внизу вкладки Linux).",
    faq_q4: "Как понять, что программа реально работает?",
    faq_a4: "Если в терминале бегут строки — значит процесс идет. Если терминал замер — проверьте порт (кнопка диагностики внизу).",

    // iOS
    ios_title: "iOS: Моментальный доступ",
    ios_desc: "Настройка iPhone за 3 шага. Никаких сложностей — только результат.",
    ios_step_1: "1. Установите 'Плеер'",
    ios_step_1_desc: "V2Box — самый надежный и бесплатный клиент в AppStore.",
    ios_step_2: "2. Вставьте 'Ключ'",
    ios_step_2_desc: "Скопируйте ваш VLESS-ключ и нажмите 'Import' в приложении.",
    ios_step_3: "3. Готово!",
    ios_step_3_desc: "Нажмите 'Connect'. Теперь ваш iPhone работает без границ.",

    local_sni_example: "www.ozon.ru",
    local_services_list: "ozon.ru, sber.ru, gosuslugi.ru, vk.com",
    research_footer: "GLOBAL NETWORK NEUTRALITY INITIATIVE // BYEDPI MATE PROJECT 2025",
    recommended_badge: "ТОП ВЫБОР",
    command_preview: "Настройки (Arguments)",
    copy_all: "Копировать всё",
    start_btn: "Скачать ByeDPI"
  },
  en: {
    app_title: "ByeDPI Mate",
    subtitle: "v1.8.0 • Final Build 2025",
    tab_android: "Android / TV",
    tab_windows: "Windows",
    tab_linux: "Linux (Desktop)",
    tab_pc_settings: "Browser Settings",
    tab_vpn: "VPN + Region",
    tab_ios: "iOS (iPhone)",
    tab_whitelist: "Whitelist",
    tab_faq: "Help Center (FAQ)",
    
    linux_title: "Linux: Maximum Comfort",
    linux_desc: "Combined power of terminal and browser ease. Launch once, enjoy forever.",
    linux_step_1: "Step 1: Start Engine",
    linux_step_1_desc: "Copy this command. It auto-finds the file and fixes DNS on port 1081.",
    linux_step_2: "Step 2: Toggle Extension",
    linux_step_2_desc: "Click 'LINK ACTIVE' in the extension toggle above. Done!",

    faq_title: "Troubleshooting (Rescue Kit)",
    faq_q1: "Why does internet drop immediately?",
    faq_a1: "DNS blockage. Our latest commands force 8.8.8.8 to bypass ISP filters.",
    faq_q2: "Password isn't visible in terminal.",
    faq_a2: "Standard Linux behavior. Type it blindly and press Enter.",
    
    ios_title: "iOS: Instant Access",
    ios_desc: "3 steps to freedom on iPhone. Simple and efficient.",
    ios_step_1: "1. Install Player",
    ios_step_1_desc: "Get V2Box from AppStore. It's free and robust.",
    ios_step_2: "2. Paste Key",
    ios_step_2_desc: "Copy your VLESS key and hit 'Import'.",
    ios_step_3: "3. Connect",
    ios_step_3_desc: "Tap Connect. Your iPhone is now borderless.",

    local_sni_example: "www.google.com",
    local_services_list: "google.com, amazon.com, apple.com",
    research_footer: "GLOBAL NETWORK NEUTRALITY INITIATIVE // BYEDPI MATE PROJECT 2025"
  }
};
