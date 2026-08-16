import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { runProductionAudit } from './utils/productionChecklist';
import { Analytics } from '@vercel/analytics/react';

// Execute environmental check for production readiness
runProductionAudit();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const appElement = (
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);

if (rootElement.innerHTML.trim() !== '') {
  ReactDOM.hydrateRoot(rootElement, appElement);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(appElement);
}