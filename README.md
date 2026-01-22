
# ByeDPI Mate: Network Navigator 🧭

> **Identity:** Intelligent DPI-Navigation Layer
> **Role:** Observer, Analyst, Guide.
> **Status:** Stage 0 (Stabilization)

![Version](https://img.shields.io/badge/version-1.7.0-cyan) ![Architecture](https://img.shields.io/badge/arch-AI--First-blueviolet)

**ByeDPI Mate** — это не просто "обходчик". Это интеллектуальная надстройка (Navigator Layer) над технологиями DPI-evasion.
Приложение не "ломает" блокировки, а **наблюдает** за поведением сети и **подбирает** форму трафика, допустимую для вашего провайдера в данный момент.

---

## 🏗 Архитектура (The 4 Layers)

Проект строится на четком разделении ответственности:

### 1. UI / UX Layer (React + Vite)
- **Роль:** Терминал управления.
- **Задача:** Визуализация невидимых сетевых процессов.
- **Статус:** Active.

### 2. AI Decision Layer (Gemini)
- **Роль:** Штурман (Navigator).
- **Задача:** Интерпретация симптомов ("YouTube тормозит") в технические гипотезы ("Вероятно, QUIC throttling").
- **Правило:** ИИ не выполняет команды, он только анализирует.

### 3. Strategy Runtime (Logic)
- **Роль:** Движок гипотез.
- **Задача:** Хранение знаний о том, *как* можно пройти сквозь фильтр (стратегии, SNI, фрагментация).
- **Компонент:** `src/core` (Детерминированное ядро).

### 4. Traffic Execution Core (Future)
- **Роль:** Исполнитель.
- **Задача:** Физическая манипуляция пакетами (WinDivert, NFQueue, VpnService).
- **Статус:** *In Development (Planned for v0.4)*. Сейчас делегируется внешним утилитам (ByeDPI/NekoBox).

---

## 📜 Каноны и Аксиомы

Разработка ведется строго по документам:
- [PROJECT_CANON.md](PROJECT_CANON.md) — Конституция проекта.
- [HUMAN_AI_USER_AXIOM.md](HUMAN_AI_USER_AXIOM.md) — Иерархия ролей.
- [REALITY_STATUS.md](REALITY_STATUS.md) — Честный статус возможностей.

## 🚀 Как это работает сейчас (Stage 0)

1.  **Observation (Наблюдение):** Пользователь или `NetProbe` собирает симптомы (пинги, доступность).
2.  **Analysis (Анализ):** AI Navigator сопоставляет симптомы с базой знаний (`src/core/knowledge`).
3.  **Synthesis (Синтез):** Система генерирует точную конфигурацию (аргументы) для внешнего ядра (ByeDPI).
4.  **Execution (Исполнение):** Пользователь применяет конфигурацию.

## 🛠 Установка (Dev)

```bash
git clone https://github.com/mrJIVotnoe/JIVotnoe
npm install
# Создайте .env.local с ключом VITE_GEMINI_API_KEY
npm run dev
```

---
*«Мы не можем отменить шторм, но мы можем настроить паруса.»*
