import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register AgriN Service Worker for Offline State Sync
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[AgriN] Service Worker registered successfully for offline support:', reg.scope);
      })
      .catch((err) => {
        console.warn('[AgriN] Service Worker registration failed:', err);
      });
  });
}

