import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/core/Dashboard';
import Spinner from './components/ui/Spinner';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'; // Import routing components
import CausalMatrixForm from './components/causal/CausalMatrixForm'; // Import CausalMatrixForm
import { useEffect, useState, useRef, useCallback } from 'react'; // Import useRef, useCallback
import { syncPendingCausalMatrices, getPendingCausalMatricesCount, clearPendingCausalMatricesForUser } from './services/offlineSync'; // Import clearPendingCausalMatricesForUser
import toast from 'react-hot-toast'; // Explicitly import toast
import { RotateCw, Download } from 'lucide-react'; // Import Lucide icons

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const prevUserIdRef = useRef<string | null>(null); // To store the previous user ID for logout cleanup

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingMatricesCount, setPendingMatricesCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null); // State for A2HS prompt
  const [isAppInstalled, setIsAppInstalled] = useState(false); // State to track if app is installed

  // Function to refresh the pending matrices count
  const refreshPendingCount = useCallback(async () => {
    if (user) {
      const count = await getPendingCausalMatricesCount();
      setPendingMatricesCount(count);
    } else {
      setPendingMatricesCount(0);
    }
  }, [user]); // Dependency on user

  // Effect for PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('beforeinstallprompt fired');
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null); // Clear the prompt once installed
      console.log('PWA installed successfully!');
    };

    // Check if already installed on load
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsAppInstalled(isStandalone);
    console.log(`PWA is installed (standalone mode): ${isStandalone}`);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Provide haptic feedback for Android users
      if (navigator.vibrate) {
        navigator.vibrate(50); // Vibrate for 50ms
      }
      // Show the install prompt
      (deferredPrompt as any).prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await (deferredPrompt as any).userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, so clear it.
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        toast.success('¡Aplicación instalada con éxito!');
        setIsAppInstalled(true); // Update state immediately
      } else {
        toast.error('Instalación cancelada.');
      }
    }
  };

  // Effect to handle online/offline status and synchronization
  useEffect(() => {
    const handleOnlineStatusChange = async () => {
      const currentOnlineStatus = navigator.onLine;
      setIsOnline(currentOnlineStatus);
      if (currentOnlineStatus && user) {
        console.log('App is online, attempting to sync pending matrices...');
        await syncPendingCausalMatrices(user.uid);
        await refreshPendingCount();
      } else {
        await refreshPendingCount();
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Initial count fetch and setup for periodic refresh
    refreshPendingCount();
    // Add listener for messages from service worker
    const handleServiceWorkerMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_PENDING_CAUSAL_MATRICES') {
        console.log('Service Worker requested sync of pending causal matrices.');
        if (user) {
          toast.loading('Sincronizando matrices pendientes en segundo plano...');
          await syncPendingCausalMatrices(user.uid);
          await refreshPendingCount();
          toast.dismiss();
          toast.success('Sincronización de matrices pendientes completada.');
        } else {
          console.warn('Cannot sync pending matrices: User not authenticated.');
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    const intervalId = setInterval(refreshPendingCount, 30000); // Refresh every 30 seconds

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage); // Cleanup
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      clearInterval(intervalId);
    };
  }, [user, isOnline]); // Re-run if user or online status changes

  // Effect to handle user logout and clear pending matrices for the logged-out user
  useEffect(() => {
    if (!loading) {
      if (user) {
        // User logged in or is already logged in
        prevUserIdRef.current = user.uid;
      } else {
        // User logged out
        if (prevUserIdRef.current) {
          console.log(`User ${prevUserIdRef.current} logged out. Clearing their pending matrices.`);
          clearPendingCausalMatricesForUser(prevUserIdRef.current)
            .then(() => {
              toast.success('Matrices pendientes del usuario anterior limpiadas.');
              prevUserIdRef.current = null; // Clear ref after cleanup
              refreshPendingCount(); // Refresh count after cleanup
            })
            .catch(error => {
              console.error('Error clearing pending matrices for previous user:', error);
              toast.error('Error al limpiar matrices pendientes del usuario anterior.');
            });
        }
      }
    }
  }, [loading, user, refreshPendingCount]); // Depend on loading, user, and refreshPendingCount

  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const action = params.get('action');

      let targetPath = location.pathname; // Default to current path
      let shouldNavigate = false;

      if (action === 'new_matrix') {
        targetPath = '/new-matrix';
        shouldNavigate = true;
      } else if (action === 'view_dashboard') {
        targetPath = '/dashboard';
        shouldNavigate = true;
      }

      if (action) { // If an action parameter was present, we need to clear it from the URL
        params.delete('action');
        shouldNavigate = true; // Ensure navigation happens to clear the param
      }

      if (shouldNavigate) {
        const newSearch = params.toString();
        navigate(targetPath + (newSearch ? `?${newSearch}` : ''), { replace: true });
      }

      // Attempt to sync pending matrices when user is authenticated on initial load/login
      // This is in addition to the online event listener
      if (isOnline) { // Only attempt sync if currently online
        syncPendingCausalMatrices(user.uid).then(() => refreshPendingCount()); // Refresh count after sync
      }
      refreshPendingCount(); // Initial refresh when user loads
    }
  }, [loading, user, location.search, navigate, location.pathname, isOnline]);

  const handleManualSync = async () => {
    if (user && isOnline) {
      if (navigator.vibrate) {
        navigator.vibrate(50); // Vibrate for 50ms
      }
      toast.loading('Intentando sincronizar matrices pendientes...');
      await syncPendingCausalMatrices(user.uid);
      const newPendingCount = await getPendingCausalMatricesCount(); // Get the updated count directly
      setPendingMatricesCount(newPendingCount); // Update state
      toast.dismiss(); // Dismiss loading toast

      if (newPendingCount === 0) {
        toast.success('Todas las matrices pendientes han sido sincronizadas.');
      } else {
        toast.error(`Se sincronizaron algunas matrices. Quedan ${newPendingCount} pendientes.`);
      }
    } else if (!isOnline) {
      toast.error('Estás desconectado. Conéctate para sincronizar.');
    } else {
      toast.error('Inicia sesión para sincronizar.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <div className={`fixed top-0 left-0 right-0 p-1 text-center text-xs font-medium z-50 flex items-center justify-center gap-2
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
      <Routes>
        <Route path="/login" element={<Login />} />
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-matrix" element={<CausalMatrixForm />} />
            {/* Redirect root path to dashboard if authenticated and no specific action */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Redirect any other path to dashboard if authenticated and no specific action */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : ( // Not authenticated
          <>
            {/* Redirect root path to login if not authenticated */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Redirect any other path to login if not authenticated */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
