import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';


import RoutesComponent from './app.tsx';
import './index.css';
import './demo/tools.css';
import { createPortal } from 'react-dom';
import { Toaster } from '@client/src/components/ui/sonner';


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
