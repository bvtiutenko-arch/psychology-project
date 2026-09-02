import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Node = ({ label, value, color, isLast }: { label: string; value: string; color: string; isLast: boolean }) => (
  <div className="flex flex-col items-center mb-8 relative">
    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold p-2 text-center shadow-md`}>
      {label}
    </div>
    <p className="mt-2 text-sm text-slate-700 text-center max-w-[120px]">{value}</p>
    {!isLast && <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-slate-300"></div>}
  </div>
);

const ConnectionMap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrix, setMatrix] = useState<CausalMatrix | null>(null);

  useEffect(() => {
    if (user) {
      getCausalMatrices(user.uid).then(data => {
        if (data.length > 0) setMatrix(data[0]); // Get latest
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Mapa de Conexión</h1>
      </header>

      {!matrix ? (
        <p className="text-slate-500 text-center py-8">No hay datos para mostrar el mapa. Registra un evento primero.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
          <Node label="Disparador" value={matrix.triggerEvent} color="bg-blue-500" isLast={false} />
          <Node label="Pensamiento" value={matrix.cognitiveBias} color="bg-purple-500" isLast={false} />
          <Node label="Comportamiento" value={matrix.somaticCompulsion} color="bg-orange-500" isLast={false} />
          <Node label="Consecuencia" value={matrix.feedbackLoop} color="bg-red-500" isLast={true} />
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">Herida Raíz: {matrix.rootWound}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionMap;
