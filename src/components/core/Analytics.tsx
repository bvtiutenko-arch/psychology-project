import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '../../utils/date';

const Chart = ({ title, matrices, metricKey, color }: { title: string; matrices: CausalMatrix[]; metricKey: keyof CausalMatrix; color: string }) => {
  const max = 100; // Metrics are 0-100
  const displayMatrices = [...matrices].slice(0, 10).reverse(); // Get newest 10, reverse for chronological order
  
  if (displayMatrices.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-700 mb-4">{title}</h3>
      <div className="flex items-end gap-2 h-40 border-b border-slate-200 overflow-x-auto pb-2">
        {displayMatrices.map((matrix, i) => {
          const val = typeof matrix[metricKey] === 'number' ? matrix[metricKey] as number : 0;
          return (
            <div key={i} className="flex flex-col items-center justify-end h-full w-12 flex-shrink-0">
              <div className="w-full bg-slate-100 rounded-t-sm relative" style={{ height: '100%' }}>
                <div
                  className={`absolute bottom-0 w-full ${color} rounded-t-sm transition-all duration-500 flex items-start justify-center pt-1`}
                  style={{ height: `${(val / max) * 100}%` }}
                >
                  {val >= 15 && (
                    <span className="text-xs text-white font-medium">{val}</span>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-1 whitespace-nowrap">{formatDate(matrix.timestamp)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getMostFrequent = (matrices: CausalMatrix[], key: keyof CausalMatrix): string => {
  const counts: Record<string, number> = {};
  matrices.forEach(m => {
    const val = m[key];
    if (typeof val === 'string' && val) {
      counts[val] = (counts[val] || 0) + 1;
    }
  });
  let maxCount = 0;
  let mostFrequent = 'N/A';
  for (const val in counts) {
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      mostFrequent = val;
    }
  }
  return mostFrequent;
};

const getAverage = (matrices: CausalMatrix[], key: keyof CausalMatrix): number => {
  if (matrices.length === 0) return 0;
  const sum = matrices.reduce((acc, m) => {
    const val = m[key];
    return acc + (typeof val === 'number' ? val : 0);
  }, 0);
  return Math.round(sum / matrices.length);
};

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getCausalMatrices(user.uid)
        .then(data => {
          setMatrices(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching analytics data:', err);
          setLoading(false);
        });
    }
  }, [user]);

  const avgClarity = getAverage(matrices, 'clarityIndex');
  const avgLoopIntensity = getAverage(matrices, 'loopIntensity');
  const avgCoupleFriction = getAverage(matrices, 'coupleFriction');
  const avgSleepLatencyRisk = getAverage(matrices, 'sleepLatencyRisk');

  const frequentRootWound = getMostFrequent(matrices, 'rootWound');
  const frequentTriggerEvent = getMostFrequent(matrices, 'triggerEvent');
  const frequentCognitiveBias = getMostFrequent(matrices, 'cognitiveBias');
  const frequentSomaticCompulsion = getMostFrequent(matrices, 'somaticCompulsion');
  const frequentFeedbackLoop = getMostFrequent(matrices, 'feedbackLoop');

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-4xl mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Análisis</h1>
      </header>

      {loading ? (
        <p className="text-slate-500 text-center py-8">Cargando análisis...</p>
      ) : matrices.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay datos suficientes para análisis. Registra más eventos.</p>
      ) : (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Resumen General</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Claridad Promedio</p>
                <p className="text-2xl font-bold text-slate-800">{avgClarity}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Intensidad Promedio</p>
                <p className="text-2xl font-bold text-slate-800">{avgLoopIntensity}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Fricción Promedio</p>
                <p className="text-2xl font-bold text-slate-800">{avgCoupleFriction}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Riesgo Insomnio Prom.</p>
                <p className="text-2xl font-bold text-slate-800">{avgSleepLatencyRisk}%</p>
              </div>
            </div>
          </div>

          {/* Frequent Patterns Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Patrones Frecuentes</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Herida Raíz</span>
                <span className="text-sm font-medium text-slate-800">{frequentRootWound}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Disparador</span>
                <span className="text-sm font-medium text-slate-800">{frequentTriggerEvent}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Pensamiento</span>
                <span className="text-sm font-medium text-slate-800">{frequentCognitiveBias}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Comportamiento</span>
                <span className="text-sm font-medium text-slate-800">{frequentSomaticCompulsion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Consecuencia</span>
                <span className="text-sm font-medium text-slate-800">{frequentFeedbackLoop}</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tendencias</h2>
            <Chart title="Claridad" matrices={matrices} metricKey="clarityIndex" color="bg-green-500" />
            <Chart title="Intensidad del Bucle" matrices={matrices} metricKey="loopIntensity" color="bg-red-500" />
            <Chart title="Fricción en Pareja" matrices={matrices} metricKey="coupleFriction" color="bg-orange-500" />
            <Chart title="Riesgo de Insomnio" matrices={matrices} metricKey="sleepLatencyRisk" color="bg-purple-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
