import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

export const Container = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

createRoot(document.getElementById('editor-root') as HTMLElement).render(Container);
