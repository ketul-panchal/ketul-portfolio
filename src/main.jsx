import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initProtection } from './utils/protection';

// Activate client-side protection (block inspect, right-click, image save)
initProtection();

// The intro always reveals the top of the page, so don't let the browser
// restore an old scroll position underneath the splash screen on reload.
history.scrollRestoration = 'manual';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
