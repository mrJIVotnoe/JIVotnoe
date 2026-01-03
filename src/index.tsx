import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { LanguageProvider } from './LanguageContext';

// We removed TelegramProvider here because we switched to a Service/Hook pattern
// which initializes implicitly or inside components as needed.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
