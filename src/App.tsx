import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/core/Dashboard';
import Spinner from './components/ui/Spinner';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import CausalMatrixForm from './components/causal/CausalMatrixForm';
import NightMode from './components/core/NightMode';
import TomorrowBox from './components/core/TomorrowBox';
import Analytics from './components/core/Analytics';
import Settings from './components/core/Settings';
import ConnectionMap from './components/core/ConnectionMap';
import History from './components/core/History';
import Landing from './components/public/Landing';
import { Privacy, Terms, Contact, FAQ, CookiePolicy, LegalNotice } from './components/public/LegalPages';
import { useEffect, useState, useRef, useCallback } from 'react';
import { syncPendingCausalMatrices, getPendingCausalMatricesCount, clearPendingCausalMatricesForUser } from './services/offlineSync';
import { saveSessionHistory } from './services/db';
import toast from 'react-hot-toast';
import { RotateCw, Download } from 'lucide-react';

const isDevelopment = import.meta.env.DEV;

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const prevUserIdRef = useRef<string | null>(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingMatricesCount, setPendingMatricesCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const refreshPendingCount = useCallback(async () => {
    if (user) {
      const count = await getPendingCausalMatricesCount(user.uid);
      setPendingMatricesCount(count);
    } else {
      setPendingMatricesCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isDevelopment) console.log('beforeinstallprompt fired');
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      if (isDevelopment) console.log('PWA installed successfully!');
    };

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsAppInstalled(isStandalone);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (isDevelopment) console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        toast.success('¡Aplicación instalada con éxito!');
        setIsAppInstalled(true);
      } else {
        toast.error('Instalación cancelada.');
      }
    }
  };

  useEffect(() => {
    const handleOnlineStatusChange = async () => {
      const currentOnlineStatus = navigator.onLine;
      setIsOnline(currentOnlineStatus);
      if (currentOnlineStatus && user) {
        if (isDevelopment) console.log('App is online, attempting to sync pending matrices...');
        await syncPendingCausalMatrices(user.uid);
        await refreshPendingCount();
      } else {
        await refreshPendingCount();
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    refreshPendingCount();
    const handleServiceWorkerMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_PENDING_CAUSAL_MATRICES') {
        if (isDevelopment) console.log('App.tsx: Received SYNC_PENDING_CAUSAL_MATRICES message from Service Worker.');
        if (user) {
          try {
            const toastId = toast.loading('Sincronizando matrices pendientes en segundo plano...');
            await syncPendingCausalMatrices(user.uid, true);
            const newPendingCount = await getPendingCausalMatricesCount(user.uid);
            setPendingMatricesCount(newPendingCount);
            toast.dismiss(toastId);
            if (newPendingCount === 0) {
              toast.success('Sincronización de matrices pendientes completada.');
            } else {
              toast.error(`Sincronización parcial. Quedan ${newPendingCount} pendientes.`);
            }
          } catch (error) {
            console.error('Error during background sync:', error);
            toast.error('Error durante la sincronización en segundo plano.');
          }
        } else {
          if (isDevelopment) console.warn('App.tsx: Cannot sync pending matrices: User not authenticated.');
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    const intervalId = setInterval(refreshPendingCount, 30000);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      clearInterval(intervalId);
    };
  }, [user, refreshPendingCount]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        prevUserIdRef.current = user.uid;
      } else {
        if (prevUserIdRef.current) {
          if (isDevelopment) console.log(`User ${prevUserIdRef.current} logged out. Clearing their pending matrices.`);
          clearPendingCausalMatricesForUser(prevUserIdRef.current)
            .then(() => {
              toast.success('Matrices pendientes del usuario anterior limpiadas.');
              prevUserIdRef.current = null;
              refreshPendingCount();
            })
            .catch(error => {
              console.error('Error clearing pending matrices for previous user:', error);
              toast.error('Error al limpiar matrices pendientes del usuario anterior.');
            });
        }
      }
    }
  }, [loading, user, refreshPendingCount]);

  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const action = params.get('action');

      let targetPath = location.pathname;
      let shouldNavigate = false;

      if (action === 'new_matrix') {
        targetPath = '/new-matrix';
        shouldNavigate = true;
      } else if (action === 'view_dashboard') {
        targetPath = '/dashboard';
        shouldNavigate = true;
      }

      if (action) {
        params.delete('action');
        shouldNavigate = true;
      }

      if (shouldNavigate) {
        const newSearch = params.toString();
        navigate(targetPath + (newSearch ? `?${newSearch}` : ''), { replace: true });
      }

      if (isOnline) {
        syncPendingCausalMatrices(user.uid).then(() => refreshPendingCount());
      }
      refreshPendingCount();
    }
  }, [loading, user, location.search, navigate, location.pathname, isOnline]);

  const handleManualSync = async () => {
    if (user && isOnline) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      const toastId = toast.loading('Intentando sincronizar matrices pendientes...');
      try {
        await syncPendingCausalMatrices(user.uid, true);
        const newPendingCount = await getPendingCausalMatricesCount(user.uid);
        setPendingMatricesCount(newPendingCount);
        toast.dismiss(toastId);

        if (newPendingCount === 0) {
          toast.success('Todas las matrices pendientes han sido sincronizadas.');
          await saveSessionHistory({
            userId: user.uid,
            sessionType: 'manual_sync',
            responses: { success: true, remaining: newPendingCount }
          }).catch((e) => console.error('Error saving sync session history:', e));
        } else {
          toast.error(`Se sincronizaron algunas matrices. Quedan ${newPendingCount} pendientes.`);
        }
      } catch (error) {
        console.error('Error during manual sync:', error);
        toast.dismiss(toastId);
        toast.error('Error al sincronizar matrices pendientes.');
      }
    } else if (!isOnline) {
      toast.error('Estás desconectado. Conéctate para sincronizar.');
    } else {
      toast.error('Inicia sesión para sincronizar.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-800 font-sans flex flex-col overflow-hidden">
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1e293b', // slate-800
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', // green-500
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
          },
        }}
      />
      <div className={`flex-shrink-0 p-1 text-center text-xs font-medium z-50 flex items-center justify-center gap-2 flex-nowrap overflow-x-auto
                  ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
        <span>{isOnline ? 'Online' : 'Offline'}</span>
        {isAppInstalled && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">
            App Instalada
          </span>
        )}
        {pendingMatricesCount > 0 && (
          <button
            onClick={handleManualSync}
            className="ml-2 px-2 py-0.5 rounded-full bg-white text-red-600 text-xs font-bold flex items-center"
            title="Sincronizar matrices pendientes"
          >
            {pendingMatricesCount} Pendiente{pendingMatricesCount > 1 ? 's' : ''}
            <RotateCw className="w-3 h-3 ml-1" />
          </button>
        )}
        {deferredPrompt && !isAppInstalled && (
          <button
            onClick={handleInstallClick}
            className="ml-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center"
            title="Instalar aplicación"
          >
            Instalar
            <Download className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/legal" element={<LegalNotice />} />

          {/* Protected Routes */}
          {user ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-matrix" element={<CausalMatrixForm />} />
              <Route path="/night-mode" element={<NightMode />} />
              <Route path="/tomorrow" element={<TomorrowBox />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/connection-map" element={<ConnectionMap />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
