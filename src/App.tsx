import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/core/Dashboard';
import Spinner from './components/ui/Spinner';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'; // Import routing components
import CausalMatrixForm from './components/causal/CausalMatrixForm'; // Import CausalMatrixForm
import { useEffect } from 'react'; // Import useEffect
import { syncPendingCausalMatrices } from './services/offlineSync'; // New import

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

      // Attempt to sync pending matrices when user is authenticated
      syncPendingCausalMatrices(user.uid);
    }
  }, [loading, user, location.search, navigate, location.pathname]);

  // Effect to handle online/offline synchronization
  useEffect(() => {
    const handleOnline = () => {
      if (user) {
        console.log('App is online, attempting to sync pending matrices...');
        syncPendingCausalMatrices(user.uid);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user]); // Re-run if user changes (e.g., logs in/out)

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
