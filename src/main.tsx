import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import toast from 'react-hot-toast'; // Import toast
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

// Register the service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Prompt the user to refresh the page when new content is available
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                ¡Nueva versión disponible!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Haz clic en "Actualizar" para obtener las últimas mejoras.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              updateSW(true);
              toast.dismiss(t.id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Actualizar
          </button>
        </div>
      </div>
    ), { duration: Infinity }); // Show indefinitely until user acts
  },
  onOfflineReady() {
    toast.success('¡La aplicación está lista para funcionar sin conexión!'); // Show a toast notification
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);


