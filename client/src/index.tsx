import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';


import RoutesComponent from './app.tsx';
import './index.css';
import { createPortal } from 'react-dom';
import { Toaster } from '@client/src/components/ui/sonner';
import { isApp } from './runtime';

if (isApp && import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(error => console.warn('Offline support unavailable', error));
  });
}


const MainApp = () => {
  return (
    <HashRouter>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <main role="alert"><h1>页面暂时无法显示</h1><p>{String(error)}</p><button onClick={resetErrorBoundary}>重试</button></main>
          )}
        >
          <RoutesComponent />
          {createPortal(<Toaster />, document.body)}
        </ErrorBoundary>
    </HashRouter>
  );
};

createRoot(document.getElementById('root')!).render(<MainApp />);
