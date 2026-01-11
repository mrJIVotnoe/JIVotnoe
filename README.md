# ByeDPI Mate: Neural Sentinel 🛡️

![Version](https://img.shields.io/badge/version-1.7.0-cyan) ![Status](https://img.shields.io/badge/status-stable-green) ![Tech](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20TS-blueviolet)

**ByeDPI Mate** — это веб-приложение для настройки и управления ByeDPI (инструмент обхода DPI-блокировок). С AI-анализом проблем, мультиплатформенными гайдами (Android, Windows, Linux, iOS, TV) и генератором стратегий. Деплой: https://byedpi-mate.vercel.app.

## 🌟 Ключевые фичи
- Мультиплатформенные гайды и настройки.
- **Core Engine v0.1**: Детерминированное ядро для выбора стратегий обхода.
- AI Analyst на базе Google Gemini для диагностики проблем.
- Стратегии для ByeDPI: STANDARD, TELEGRAM_FIX и т.д.
- Поддержка Telegram Web App и PWA.
- Локализация на 20+ языков.

## 🚀 Установка и запуск
**Prerequisites:** Node.js 18+ и Gemini API Key (для AI).

1. Клонируй: `git clone https://github.com/mrJIVotnoe/JIVotnoe`
2. Установи: `npm install`
3. Добавь ключ в `.env.local`: `VITE_GEMINI_API_KEY=your_key`
4. Запусти: `npm run dev`
5. Билд: `npm run build`

## 🧠 Architecture
- **Feature-Sliced Design**: Модульная структура (`src/features`, `src/shared`).
- **Core (`src/core`)**: Изолированное ядро логики принятия решений.
- **Store (`src/store`)**: Zustand stores с персистенцией и адаптерами к Core.

## ⚠️ Disclaimer
Для образовательных целей. Не поощряем обход блокировок, где это незаконно.

## 🤝 Contributing
Pull requests welcome! Добавляй стратегии, переводы или фиксы.