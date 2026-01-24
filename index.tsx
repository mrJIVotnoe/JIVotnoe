import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { LanguageProvider } from './LanguageContext';
// Fix: point to new TelegramContext location in src/features/telegram
import { TelegramProvider } from './src/features/telegram/TelegramContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TelegramProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </TelegramProvider>
  </React.StrictMode>
);