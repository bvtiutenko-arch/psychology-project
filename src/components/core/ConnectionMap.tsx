import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { getMetricColorClass } from '../../lib/metrics';

const Node = ({ label, value, color, isLast, usuallyFollows, avgIntensity }: { 
  label: string; 
  value: string; 
  color: string; 
  isLast: boolean;
  usuallyFollows?: { value: string; count: number } | null;
  avgIntensity?: number | null;
}) => (
  <div className="flex flex-col items-center mb-8 relative">
    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold p-2 text-center shadow-md`}>
      {label}
    </div>
    <p className="mt-2 text-sm text-slate-700 text-center max-w-[120px]">{value}</p>
    {avgIntensity !== null && avgIntensity !== undefined && (
      <p className="text-xs text-slate-500 mt-1">Intensidad promedio: {avgIntensity}/5</p>
    )}
    {usuallyFollows && (
      <p className="text-xs text-indigo-500 mt-1 font-medium text-center max-w-[140px]">
        Suele llevar a: {usuallyFollows.value} ({usuallyFollows.count} {usuallyFollows.count === 1 ? 'vez' : 'veces'})
      </p>
    )}
    {!isLast && <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-slate-300"></div>}
  </div>
);

const MetricBadge = ({ label, value, reverseColor }: { label: string; value: number; reverseColor: boolean }) => {
  const colors = getMetricColorClass(value, reverseColor);
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-white text-sm font-bold`}>
        {value}%
      </div>
      <p className="mt-1 text-xs text-slate-500 text-center">{label}</p>
    </div>
  );
};

const getMostFrequentNextStep = (matrices: CausalMatrix[], currentField: keyof CausalMatrix, currentValue: string, nextField: keyof CausalMatrix): { value: string; count: number } | null => {
  const counts: Record<string, number> = {};
  matrices.forEach(m => {
    const val = m[currentField];
    if (typeof val === 'string' && val === currentValue) {
      const nextVal = m[nextField];
      if (typeof nextVal === 'string' && nextVal) {
        counts[nextVal] = (counts[nextVal] || 0) + 1;
      }
    }
  });
  
  let maxCount = 0;
  let mostFrequent = '';
  for (const val in counts) {
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      mostFrequent = val;
    }
  }
  
  if (maxCount > 0) {
    return { value: mostFrequent, count: maxCount };
  }
  return null;
};

const getAverageIntensity = (matrices: CausalMatrix[], emotion: string): number | null => {
  const matching = matrices.filter(m => m.emotion === emotion);
  if (matching.length === 0) return null;
  const sum = matching.reduce((acc, m) => acc + m.intensity, 0);
  return Math.round((sum / matching.length) * 10) / 10; // 1 decimal place
};

const ConnectionMap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);
  const [selectedMatrixId, setSelectedMatrixId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getCausalMatrices(user.uid).then(data => {
        setMatrices(data);
        const initialId = searchParams.get('id') || (data.length > 0 ? data[0].id || null : null);
        setSelectedMatrixId(initialId);
        setLoading(false);
      });
    }
  }, [user, searchParams]);

  const selectedMatrix = matrices.find(m => m.id === selectedMatrixId);

  // Calculate aggregated insights for the selected matrix
  const rootWoundFollows = selectedMatrix ? getMostFrequentNextStep(matrices, 'rootWound', selectedMatrix.rootWound, 'triggerEvent') : null;
  const triggerEventFollows = selectedMatrix ? getMostFrequentNextStep(matrices, 'triggerEvent', selectedMatrix.triggerEvent, 'cognitiveBias') : null;
  const cognitiveBiasFollows = selectedMatrix ? getMostFrequentNextStep(matrices, 'cognitiveBias', selectedMatrix.cognitiveBias, 'emotion') : null;
  const emotionFollows = selectedMatrix ? getMostFrequentNextStep(matrices, 'emotion', selectedMatrix.emotion, 'somaticCompulsion') : null;
  const somaticCompulsionFollows = selectedMatrix ? getMostFrequentNextStep(matrices, 'somaticCompulsion', selectedMatrix.somaticCompulsion, 'feedbackLoop') : null;

  const emotionAvgIntensity = selectedMatrix ? getAverageIntensity(matrices, selectedMatrix.emotion) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Mapa de Conexión</h1>
      </header>

      {loading ? (
        <p className="text-slate-500 text-center py-8">Cargando...</p>
      ) : matrices.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay datos para mostrar el mapa. Registra un evento primero.</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <label htmlFor="matrix-select" className="block text-sm font-medium text-slate-700 mb-2">Selecciona un registro:</label>
            <select
              id="matrix-select"
              value={selectedMatrixId || ''}
              onChange={(e) => setSelectedMatrixId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {matrices.map(m => (
                <option key={m.id} value={m.id}>{formatDate(m.timestamp, true)}</option>
              ))}
            </select>
          </div>

          {selectedMatrix && (
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
              <Node label="Herida Raíz" value={selectedMatrix.rootWound} color="bg-red-800" isLast={false} usuallyFollows={rootWoundFollows} />
              <Node label="Disparador" value={selectedMatrix.triggerEvent} color="bg-blue-500" isLast={false} usuallyFollows={triggerEventFollows} />
              <Node label="Pensamiento" value={selectedMatrix.cognitiveBias} color="bg-purple-500" isLast={false} usuallyFollows={cognitiveBiasFollows} />
              <Node label="Emoción" value={`${selectedMatrix.emotion} (${selectedMatrix.intensity}/5)`} color="bg-pink-500" isLast={false} usuallyFollows={emotionFollows} avgIntensity={emotionAvgIntensity} />
              <Node label="Comportamiento" value={selectedMatrix.somaticCompulsion} color="bg-orange-500" isLast={false} usuallyFollows={somaticCompulsionFollows} />
              <Node label="Consecuencia" value={selectedMatrix.feedbackLoop} color="bg-red-500" isLast={true} />

              {/* Metrics Section */}
              <div className="mt-2 w-full">
                <h3 className="text-sm font-bold text-slate-700 mb-3 text-center">Impacto en tu bienestar</h3>
                <div className="grid grid-cols-4 gap-2">
                  <MetricBadge label="Claridad" value={selectedMatrix.clarityIndex} reverseColor={false} />
                  <MetricBadge label="Bucle" value={selectedMatrix.loopIntensity} reverseColor={true} />
                  <MetricBadge label="Fricción" value={selectedMatrix.coupleFriction} reverseColor={true} />
                  <MetricBadge label="Insomnio" value={selectedMatrix.sleepLatencyRisk} reverseColor={true} />
                </div>
              </div>

              {/* Intervention Strategies */}
              {selectedMatrix.interventionStrategies.length > 0 && (
                <div className="mt-6 w-full">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 text-center">Estrategias Recomendadas</h3>
                  <ul className="space-y-2">
                    {selectedMatrix.interventionStrategies.map((strategy, i) => (
                      <li key={i} className="text-sm text-slate-600 bg-green-50 p-2 rounded-md text-center">
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionMap;
