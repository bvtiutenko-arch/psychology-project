import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { exportUserData, deleteAllUserData } from '../../services/db';
import { auth } from '../../firebase';
import { ArrowLeft, Download, Trash2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExport = async () => {
    if (!user) return;
    try {
      const data = await exportUserData(user.uid);
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `menteencalma_data_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Datos exportados.');
    } catch (error) {
      toast.error('Error al exportar datos.');
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer. Se eliminarán todos tus registros.')) {
      try {
        await deleteAllUserData(user.uid);
        toast.success('Todos tus datos han sido eliminados.');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error al eliminar datos.');
      }
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Ajustes y Privacidad</h1>
      </header>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 mb-2">Tus Datos</h2>
          <p className="text-sm text-slate-500 mb-4">Tienes control total sobre tu información.</p>
          <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 px-4 rounded-lg mb-2">
            <Download className="w-5 h-5" /> Exportar Mis Datos
          </button>
          <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg">
            <Trash2 className="w-5 h-5" /> Eliminar Todos Mis Datos
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 mb-2">Sesión</h2>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 px-4 rounded-lg">
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
