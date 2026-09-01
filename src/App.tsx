import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/core/Dashboard';
import Spinner from './components/ui/Spinner';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'; // Import routing components
import CausalMatrixForm from './components/causal/CausalMatrixForm'; // Import CausalMatrixForm
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { syncPendingCausalMatrices, getPendingCausalMatricesCount } from './services/offlineSync'; // New import

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(navigator.onLine); // Track online status
  const [pendingMatricesCount, setPendingMatricesCount] = useState(0); // New state for pending count

  // Function to refresh the pending matrices count
  const refreshPendingCount = async () => {
    if (user) {
      const count = await getPendingCausalMatricesCount();
      setPendingMatricesCount(count);
    } else {
      setPendingMatricesCount(0);
    }
  };

  // Effect to handle online/offline status and synchronization
  useEffect(() => {
    const handleOnlineStatusChange = async () => { // Made async to await refreshPendingCount
      const currentOnlineStatus = navigator.onLine;
      setIsOnline(currentOnlineStatus);
      if (currentOnlineStatus && user) {
        console.log('App is online, attempting to sync pending matrices...');
        await syncPendingCausalMatrices(user.uid); // Await sync to ensure count is updated after
        await refreshPendingCount(); // Refresh count after sync attempt
      } else {
        await refreshPendingCount(); // Refresh count even if offline, to show current pending
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Initial count fetch and setup for periodic refresh
    refreshPendingCount();
    const intervalId = setInterval(refreshPendingCount, 30000); // Refresh every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      clearInterval(intervalId);
    };
  }, [user]); // Re-run if user changes (e.g., logs in/out)

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
      toast.loading('Intentando sincronizar matrices pendientes...');
      await syncPendingCausalMatrices(user.uid);
      await refreshPendingCount();
      toast.dismiss(); // Dismiss loading toast
      if (pendingMatricesCount === 0) {
        toast.success('Todas las matrices pendientes han sido sincronizadas.');
      } else {
        toast.error('No se pudieron sincronizar todas las matrices. Revisa tu conexión.');
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
        {pendingMatricesCount > 0 && (
          <button
            onClick={handleManualSync}
            className="ml-2 px-2 py-0.5 rounded-full bg-white text-red-600 text-xs font-bold flex items-center"
            title="Sincronizar matrices pendientes"
          >
            {pendingMatricesCount} Pendiente{pendingMatricesCount > 1 ? 's' : ''}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.181m0-4.991-3.181-3.181m0 8.25 3.181 3.181m0-4.991-3.181-3.181A9.347 9.347 0 0 0 5.942 3.563H5.4M7.487 3.51H18.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H7.488m-4.5-8.25h11.25" />
            </svg>
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
