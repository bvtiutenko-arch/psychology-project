import { auth } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';
import CausalMatrixForm from '../causal/CausalMatrixForm';

const Dashboard = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Bienvenido, {user?.displayName?.split(' ')[0]}
        </h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </header>
      <main>
        <CausalMatrixForm />
      </main>
    </div>
  );
};

export default Dashboard;
