import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);

  useEffect(() => {
    if (user) {
      getCausalMatrices(user.uid).then(data => setMatrices(data.reverse())); // Reverse for chronological order
    }
  }, [user]);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    let date;
    if (timestamp instanceof Date) date = timestamp;
    else if (timestamp instanceof Timestamp) date = timestamp.toDate();
    else if (typeof timestamp === 'object' && timestamp.seconds) date = new Date(timestamp.seconds * 1000);
    else return '';
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
  };

  const Chart = ({ title, matrices, metricKey, color }: { title: string; matrices: CausalMatrix[]; metricKey: keyof CausalMatrix; color: string }) => {
    const max = 100; // Metrics are 0-100
    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-700 mb-4">{title}</h3>
        <div className="flex items-end gap-2 h-40 border-b border-slate-200">
          {matrices.map((matrix, i) => {
            const val = matrix[metricKey] as number;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full bg-slate-100 rounded-t-sm relative" style={{ height: '100%' }}>
                  <div className={`absolute bottom-0 w-full ${color} rounded-t-sm transition-all duration-500`} style={{ height: `${(val / max) * 100}%` }}></div>
                </div>
                <span className="text-xs text-slate-400 mt-1">{formatDate(matrix.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-4xl mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Análisis</h1>
      </header>

      {matrices.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay datos suficientes para análisis. Registra más eventos.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Chart title="Claridad" matrices={matrices} metricKey="clarityIndex" color="bg-green-500" />
          <Chart title="Intensidad del Bucle" matrices={matrices} metricKey="loopIntensity" color="bg-red-500" />
          <Chart title="Fricción en Pareja" matrices={matrices} metricKey="coupleFriction" color="bg-orange-500" />
          <Chart title="Riesgo de Insomnio" matrices={matrices} metricKey="sleepLatencyRisk" color="bg-purple-500" />
        </div>
      )}
    </div>
  );
};

export default Analytics;
