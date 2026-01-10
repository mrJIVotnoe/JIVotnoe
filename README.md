# ByeDPI Mate: Neural Sentinel 🛡️

![Version](https://img.shields.io/badge/version-1.1.0-cyan) ![Status](https://img.shields.io/badge/status-stable-green) ![Tech](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20TS-blueviolet)

**ByeDPI Mate** is a sophisticated configuration generator and educational interface for network neutrality tools (specifically ByeDPI, Zapret, and V2Ray/VLESS). It combines static expert knowledge with **Google Gemini AI** to diagnose network issues and suggest bypass strategies tailored to specific devices (Android, iOS, Windows, Linux, SmartTV).

> **Note:** This is a client-side interface. It generates configurations and commands. It does not tunnel traffic itself (except in the Android app context).

## 🌟 Key Features

*   **Multi-Platform Orchestration**: Tailored guides for Windows, Linux, Android, iOS, and SmartTVs.
*   **Neural Analyst (AI)**: Integrated Gemini API to diagnose specific user connectivity issues (e.g., "YouTube buffering on LG TV").
*   **Smart SNI Scanner**: In-browser network scanner to find reachable domains for traffic mimicry.
*   **Strategy Generator**: Visual selector for ByeDPI modes (Disorder, Fake, Ozon/WB mimicry).
*   **Deep Linking**: Share specific configurations via URL hash.
*   **PWA & Telegram Ready**: Fully optimized for Telegram Web Apps (TWA) and installable as a PWA.

## 🧠 AI Integration (Gemini)

This project uses the **Google Gemini API** (`@google/genai`) for the "Maestro" feature.
*   **Purpose**: To translate vague user complaints (e.g., "Discord voice not working") into technical solutions (e.g., "Use UDP tunneling via V2Ray").
*   **Privacy**: Queries are sent directly to Google's API. No data is stored on our servers.

## 🛠️ Tech Stack

*   **Core**: React 19, TypeScript, Vite 5.
*   **Styling**: Tailwind CSS (Cyberpunk aesthetic).
*   **State**: React Context API (Language, Telegram).
*   **Router**: Custom hash-based router for TWA compatibility.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   A Google Gemini API Key (for AI features). Get it at [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/byedpi-mate.git
    cd byedpi-mate
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root directory and add your API key. This file is ignored by Git to keep your key safe.
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```
    *Note: The app will use `process.env.API_KEY` which Vite populates from this file.*

4.  Run development server:
    ```bash
    npm run dev
    ```

## ⚠️ Disclaimer

**Use at your own risk.** This software is provided for educational purposes only. The authors do not encourage bypassing government censorship where it is illegal. The user is solely responsible for how they use the generated configurations.

## 🤝 Contributing

We welcome pull requests for new bypass strategies or translations!
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/AmazingStrategy`)
3.  Commit your changes (`git commit -m 'Add AmazingStrategy'`)
4.  Push to the branch (`git push origin feature/AmazingStrategy`)
5.  Open a Pull Request

---
*Global Network Neutrality Project 2025*