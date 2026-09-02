import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices, getNightModeEntries, getExperiments } from '../../services/db';
import { CausalMatrix, SomaticCompulsion } from '../../types/causal';
import { NightModeEntry } from '../../types/nightMode';
import { Experiment } from '../../types/experiments';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Repeat, Eye, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { Timestamp } from 'firebase/firestore';

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

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = (date: Date) => {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  // Assuming week starts on Monday for Peru
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  d.setDate(diff);
  return d;
};

const startOfMonth = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return d;
};

const isWithinRange = (timestamp: any, startDate: Date): boolean => {
  if (!timestamp) return false;
  let date;
  if (timestamp instanceof Timestamp) date = timestamp.toDate();
  else if (timestamp instanceof Date) date = timestamp;
  else if (typeof timestamp === 'object' && timestamp.seconds) date = new Date(timestamp.seconds * 1000);
  else return false;
  return date >= startDate;
};

const findRepeatedPatterns = (matrices: CausalMatrix[]): { value: string; count: number }[] => {
  const patterns: Record<string, number> = {};
  matrices.forEach(m => {
    const pairs = [
      `${m.rootWound} → ${m.triggerEvent}`,
      `${m.triggerEvent} → ${m.cognitiveBias}`,
      `${m.cognitiveBias} → ${m.emotion}`,
      `${m.emotion} → ${m.somaticCompulsion}`,
      `${m.somaticCompulsion} → ${m.feedbackLoop}`,
    ];
    pairs.forEach(p => {
      if (!p.includes('undefined') && !p.includes('null')) {
        patterns[p] = (patterns[p] || 0) + 1;
      }
    });
  });
  return Object.entries(patterns)
    .map(([value, count]) => ({ value, count }))
    .filter(p => p.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

const getCheckingFrequency = (matrices: CausalMatrix[]): number => {
  return matrices.filter(m => 
    m.somaticCompulsion === SomaticCompulsion.LastSeenChecking || 
    m.somaticCompulsion === SomaticCompulsion.ImpulsiveMessaging
  ).length;
};

const PeriodSection = ({ title, matrices }: { title: string; matrices: CausalMatrix[] }) => {
  if (matrices.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
        <p className="text-slate-500 text-center py-4">No hay datos suficientes para este período.</p>
      </div>
    );
  }

  const avgClarity = getAverage(matrices, 'clarityIndex');
  const avgLoopIntensity = getAverage(matrices, 'loopIntensity');
  const avgCoupleFriction = getAverage(matrices, 'coupleFriction');
  const avgSleepLatencyRisk = getAverage(matrices, 'sleepLatencyRisk');

  const frequentRootWound = getMostFrequent(matrices, 'rootWound');
  const frequentTriggerEvent = getMostFrequent(matrices, 'triggerEvent');
  const frequentCognitiveBias = getMostFrequent(matrices, 'cognitiveBias');
  const frequentEmotion = getMostFrequent(matrices, 'emotion');
  const frequentSomaticCompulsion = getMostFrequent(matrices, 'somaticCompulsion');
  const frequentFeedbackLoop = getMostFrequent(matrices, 'feedbackLoop');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">{title} ({matrices.length} registros)</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Claridad Prom.</p>
          <p className="text-2xl font-bold text-slate-800">{avgClarity}%</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Intensidad Prom.</p>
          <p className="text-2xl font-bold text-slate-800">{avgLoopIntensity}%</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Fricción Prom.</p>
          <p className="text-2xl font-bold text-slate-800">{avgCoupleFriction}%</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Riesgo Insomnio Prom.</p>
          <p className="text-2xl font-bold text-slate-800">{avgSleepLatencyRisk}%</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-sm text-slate-500">Herida Raíz Frecuente</span>
          <span className="text-sm font-medium text-slate-800">{frequentRootWound}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-sm text-slate-500">Disparador Frecuente</span>
          <span className="text-sm font-medium text-slate-800">{frequentTriggerEvent}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-sm text-slate-500">Pensamiento Frecuente</span>
          <span className="text-sm font-medium text-slate-800">{frequentCognitiveBias}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-sm text-slate-500">Emoción Frecuente</span>
          <span className="text-sm font-medium text-slate-800">{frequentEmotion}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-sm text-slate-500">Comportamiento Frecuente</span>
          <span className="text-sm font-medium text-slate-800">{frequentSomaticCompulsion}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Consecuencia Frecuente</span>
          <span className="text-sm font-medium text-slate-800">{frequentFeedbackLoop}</span>
        </div>
      </div>
    </div>
  );
};

const NightModeSection = ({ title, entries }: { title: string; entries: NightModeEntry[] }) => {
  if (entries.length === 0) return null;
  const urgentCount = entries.filter(e => e.needsActionNow).length;
  const tomorrowCount = entries.length - urgentCount;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Moon className="w-5 h-5 text-indigo-500" />
        {title} - Modo Noche ({entries.length} registros)
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Pensamientos Urgentes</p>
          <p className="text-2xl font-bold text-red-500">{urgentCount}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Para Mañana</p>
          <p className="text-2xl font-bold text-blue-500">{tomorrowCount}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">Pensamientos Recientes:</h3>
        {entries.slice(0, 3).map(entry => (
          <div key={entry.id} className="text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
            <p className="font-medium">{formatDate(entry.timestamp, true)}</p>
            <p>{entry.thought}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RepeatedPatternsSection = ({ patterns }: { patterns: { value: string; count: number }[] }) => {
  if (patterns.length === 0) return null;
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Repeat className="w-5 h-5 text-indigo-500" />
        Patrones Repetidos
      </h2>
      <div className="space-y-3">
        {patterns.map((p, i) => (
          <div key={i} className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-sm text-slate-700">{p.value}</span>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{p.count} veces</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckingFrequencySection = ({ count, total }: { count: number; total: number }) => {
  if (total === 0) return null;
  const percentage = Math.round((count / total) * 100);
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Eye className="w-5 h-5 text-indigo-500" />
        Frecuencia de Comprobación
      </h2>
      <p className="text-sm text-slate-600 mb-2">
        Has registrado comportamientos de comprobación (revisar última conexión, mensajes impulsivos) en <span className="font-bold text-indigo-600">{count}</span> de tus <span className="font-bold">{total}</span> registros ({percentage}%).
      </p>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const HelpfulPatternsSection = ({ experiments }: { experiments: Experiment[] }) => {
  const successfulExperiments = experiments.filter(e => e.status === 'success');
  if (successfulExperiments.length === 0) return null;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-green-500" />
        ¿Qué te ayuda? (Basado en tus experimentos)
      </h2>
      <div className="space-y-3">
        {successfulExperiments.map(exp => (
          <div key={exp.id} className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-sm text-slate-700">{exp.hypothesis}</span>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{exp.strategy}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);
  const [nightEntries, setNightEntries] = useState<NightModeEntry[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getCausalMatrices(user.uid),
        getNightModeEntries(user.uid),
        getExperiments(user.uid)
      ]).then(([mData, nData, eData]) => {
        setMatrices(mData);
        setNightEntries(nData);
        setExperiments(eData);
        setLoading(false);
      }).catch(err => {
        console.error('Error fetching analytics data:', err);
        setLoading(false);
      });
    }
  }, [user]);

  const todayMatrices = matrices.filter(m => isWithinRange(m.timestamp, startOfDay(new Date())));
  const weekMatrices = matrices.filter(m => isWithinRange(m.timestamp, startOfWeek(new Date())));
  const monthMatrices = matrices.filter(m => isWithinRange(m.timestamp, startOfMonth(new Date())));

  const todayNightEntries = nightEntries.filter(e => isWithinRange(e.timestamp, startOfDay(new Date())));
  const weekNightEntries = nightEntries.filter(e => isWithinRange(e.timestamp, startOfWeek(new Date())));
  const monthNightEntries = nightEntries.filter(e => isWithinRange(e.timestamp, startOfMonth(new Date())));

  const repeatedPatterns = findRepeatedPatterns(matrices);
  const checkingFrequency = getCheckingFrequency(matrices);

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
      ) : matrices.length === 0 && nightEntries.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay datos suficientes para análisis. Registra más eventos.</p>
      ) : (
        <div className="space-y-6">
          {/* Daily, Weekly, Monthly Sections */}
          <PeriodSection title="Hoy" matrices={todayMatrices} />
          <NightModeSection title="Hoy" entries={todayNightEntries} />
          
          <PeriodSection title="Esta Semana" matrices={weekMatrices} />
          <NightModeSection title="Esta Semana" entries={weekNightEntries} />
          
          <PeriodSection title="Este Mes" matrices={monthMatrices} />
          <NightModeSection title="Este Mes" entries={monthNightEntries} />

          <HelpfulPatternsSection experiments={experiments} />
          <RepeatedPatternsSection patterns={repeatedPatterns} />
          <CheckingFrequencySection count={checkingFrequency} total={matrices.length} />

          {/* Charts Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tendencias Generales (Últimos 10)</h2>
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
