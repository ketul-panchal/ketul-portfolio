import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initProtection } from './utils/protection';

// Activate client-side protection (block inspect, right-click, image save)
initProtection();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
