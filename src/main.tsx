import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import toast from 'react-hot-toast'; // Import toast

// Register the service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Prompt the user to refresh the page when new content is available
    if (confirm('¡Nueva versión disponible! Haz clic en Aceptar para actualizar.')) {
      updateSW(true); // Force update
    }
  },
  onOfflineReady() {
    toast.success('¡La aplicación está lista para funcionar sin conexión!'); // Show a toast notification
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


