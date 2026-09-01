import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Dashboard from './components/core/Dashboard';
import Spinner from './components/ui/Spinner';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import routing components
import CausalMatrixForm from './components/causal/CausalMatrixForm'; // Import CausalMatrixForm

function App() {
  const { user, loading } = useAuth();

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
            <Route path="/causal-matrix" element={<CausalMatrixForm />} />
            {/* Redirect any other path to dashboard if authenticated */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          /* Redirect any path to login if not authenticated */
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
