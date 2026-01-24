import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import { App } from './src/app/App';
import { LanguageProvider } from './src/features/localization/LanguageContext';
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