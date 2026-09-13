import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Manage Service Worker registration safely
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const isDevOrPreview =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('run.app') ||
      window.location.hostname.includes('webcontainer');

    if (isDevOrPreview) {
      // In dev / preview environment, unregister any service workers to prevent hijacking Vite modules
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister().catch(() => {});
        }
      }).catch(() => {});
    } else {
      // In production (e.g. Cloudflare Pages or custom domains), register PWA service worker
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch(() => {});
      });
    }
  }
} catch {
  // Ignore in sandboxed iframes
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

