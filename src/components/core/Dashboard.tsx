import { auth } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices } from '../../services/db';
import { CausalMatrix, SomaticCompulsion } from '../../types/causal';
import { useEffect, useState, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Moon, Activity, Heart, TrendingDown, Sparkles, Calendar, BarChart, Settings, Network, History, Lightbulb, Anchor, FlaskConical } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { getMetricColorClass } from '../../lib/metrics';

const MetricCard = ({ title, value, change, invertColor }: { title: string; value?: number; change?: number | null; invertColor?: boolean }) => {
  if (value === undefined) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-sm text-slate-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-300">--</p>
      </div>
    );
  }
  const safeChange = change ?? 0;
  const isPositive = invertColor ? safeChange < 0 : safeChange > 0;
  const changeColor = safeChange === 0 ? 'text-slate-400' : isPositive ? 'text-green-500' : 'text-red-500';
  const valueColorClass = getMetricColorClass(value, invertColor);
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-sm text-slate-500 mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className={`text-2xl font-bold ${valueColorClass.text}`}>{value}%</p>
        {safeChange !== 0 && (
          <span className={`text-xs font-medium ${changeColor}`}>
            {safeChange > 0 ? '↑' : '↓'} {Math.abs(safeChange)}
          </span>
        )}
      </div>
    </div>
  );
};

const NavCard = ({ icon, title, path, color }: { icon: ReactNode; title: string; path: string; color: string }) => (
  <Link 
    to={path}
    className={`${color} text-white p-4 rounded-xl shadow-sm hover:opacity-90 hover:scale-105 transition-all flex flex-col items-center justify-center gap-2`}
  >
    {icon}
    <span className="font-medium text-sm">{title}</span>
  </Link>
);

const getWellBeingScore = (matrix: CausalMatrix): number => {
  const clarityScore = matrix.clarityIndex;
  const loopScore = 100 - matrix.loopIntensity;
  const frictionScore = 100 - matrix.coupleFriction;
  const sleepScore = 100 - matrix.sleepLatencyRisk;
  return Math.round((clarityScore + loopScore + frictionScore + sleepScore) / 4);
};

const getWellBeingColor = (score: number): string => {
  if (score >= 70) return 'text-green-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

const getWellBeingBg = (score: number): string => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getWellBeingLabel = (score: number): string => {
  if (score >= 70) return 'Bien';
  if (score >= 40) return 'Moderado';
  return 'Atención';
};

const getInsight = (matrix: CausalMatrix | undefined, checkingFrequency: number): string | null => {
  if (!matrix) return null;
  
  if (checkingFrequency > 5) {
    return "Has registrado comportamientos de comprobación (revisar última conexión, mensajes impulsivos) con frecuencia. Considera practicar técnicas de tolerancia a la incertidumbre.";
  }
  
  if (matrix.sleepLatencyRisk > 70) {
    return "Tu riesgo de insomnio está alto. Considera practicar técnicas de relajación antes de dormir y limitar el uso de dispositivos.";
  }
  if (matrix.loopIntensity > 70) {
    return "El sobrepensamiento está afectando tu bienestar. Intenta actividades que te mantengan en el presente.";
  }
  if (matrix.coupleFriction > 70) {
    return "Hay tensión en tu relación. Considera comunicarte abierta y calmadamente con tu pareja.";
  }
  if (matrix.clarityIndex < 30) {
    return "Tu claridad mental está baja. Tómate un momento para respirar y reflexionar sin juicio.";
  }
  if (matrix.clarityIndex > 70 && matrix.loopIntensity < 40) {
    return "¡Vas por buen camino! Tu claridad mental es alta y el sobrepensamiento está bajo control.";
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getCausalMatrices(user.uid).then(data => {
        setMatrices(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
  };

  const latestMatrix = matrices[0];
  const previousMatrix = matrices[1];

  // Calculate changes
  const getChange = (current?: number, previous?: number) => {
    if (current === undefined || previous === undefined) return null;
    return current - previous;
  };

  const clarityChange = getChange(latestMatrix?.clarityIndex, previousMatrix?.clarityIndex);
  const loopChange = getChange(latestMatrix?.loopIntensity, previousMatrix?.loopIntensity);
  const frictionChange = getChange(latestMatrix?.coupleFriction, previousMatrix?.coupleFriction);
  const sleepChange = getChange(latestMatrix?.sleepLatencyRisk, previousMatrix?.sleepLatencyRisk);

  const isToday = (timestamp: any): boolean => {
    if (!timestamp) return false;
    let date;
    if (timestamp instanceof Date) date = timestamp;
    else if (timestamp instanceof Timestamp) date = timestamp.toDate();
    else if (typeof timestamp === 'object' && timestamp.seconds) date = new Date(timestamp.seconds * 1000);
    else return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const latestDateLabel = latestMatrix ? (isToday(latestMatrix.timestamp) ? 'Hoy' : 'Último registro') : 'Hoy';
  const wellBeingScore = latestMatrix ? getWellBeingScore(latestMatrix) : null;
  
  const checkingFrequency = matrices.filter(m => 
    m.somaticCompulsion === SomaticCompulsion.LastSeenChecking || 
    m.somaticCompulsion === SomaticCompulsion.ImpulsiveMessaging
  ).length;
  
  const insight = getInsight(latestMatrix, checkingFrequency);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Hola, {user?.displayName?.split(' ')[0] || 'usuario'}
        </h1>
        <button 
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <NavCard icon={<Plus className="w-6 h-6" />} title="Registrar Evento" path="/new-matrix" color="bg-indigo-600" />
        <NavCard icon={<Moon className="w-6 h-6" />} title="No Puedo Dormir" path="/night-mode" color="bg-slate-800" />
        <NavCard icon={<Calendar className="w-6 h-6" />} title="Caja de Mañana" path="/tomorrow" color="bg-blue-500" />
        <NavCard icon={<Network className="w-6 h-6" />} title="Mapa de Conexión" path="/connection-map" color="bg-purple-500" />
        <NavCard icon={<BarChart className="w-6 h-6" />} title="Análisis" path="/analytics" color="bg-green-500" />
        <NavCard icon={<History className="w-6 h-6" />} title="Historial" path="/history" color="bg-teal-500" />
        <NavCard icon={<Anchor className="w-6 h-6" />} title="Ejercicio de Anclaje" path="/grounding" color="bg-cyan-500" />
        <NavCard icon={<FlaskConical className="w-6 h-6" />} title="Experimentos" path="/experiments" color="bg-pink-500" />
        <NavCard icon={<Settings className="w-6 h-6" />} title="Ajustes" path="/settings" color="bg-slate-500" />
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando datos...</p>
      ) : latestMatrix ? (
        <>
          {wellBeingScore !== null && (
            <section className="mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Índice de Bienestar</h2>
                  <span className={`text-sm font-medium ${getWellBeingColor(wellBeingScore)}`}>
                    {getWellBeingLabel(wellBeingScore)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-full ${getWellBeingBg(wellBeingScore)} flex items-center justify-center text-white`}>
                      <span className="text-2xl font-bold">{wellBeingScore}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`${getWellBeingBg(wellBeingScore)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${wellBeingScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {isToday(latestMatrix.timestamp) ? 'Basado en el registro de hoy' : 'Basado en tu último registro'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {insight && (
            <section className="mb-8">
              <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 mb-1">Reflexión</h3>
                    <p className="text-sm text-indigo-800">{insight}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              {latestDateLabel}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard title="Claridad" value={latestMatrix.clarityIndex} change={clarityChange} />
              <MetricCard title="Overthinking" value={latestMatrix.loopIntensity} change={loopChange} invertColor />
              <MetricCard title="Fricción Pareja" value={latestMatrix.coupleFriction} change={frictionChange} invertColor />
              <MetricCard title="Riesgo Insomnio" value={latestMatrix.sleepLatencyRisk} change={sleepChange} invertColor />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Conexión
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Herida Raíz</p>
                    <p className="text-sm font-medium text-slate-800">{latestMatrix.rootWound}</p>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-slate-200 pl-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500">Disparador</p>
                    <p className="text-sm font-medium text-slate-800">{latestMatrix.triggerEvent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Pensamiento</p>
                    <p className="text-sm font-medium text-slate-800">{latestMatrix.cognitiveBias}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Comportamiento</p>
                    <p className="text-sm font-medium text-slate-800">{latestMatrix.somaticCompulsion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Consecuencia</p>
                    <p className="text-sm font-medium text-slate-800">{latestMatrix.feedbackLoop}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {latestMatrix.interventionStrategies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                ¿Qué te ayuda?
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <ul className="space-y-3">
                  {latestMatrix.interventionStrategies.map((strategy, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <p className="text-sm text-slate-700">{strategy}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            {latestDateLabel}
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-slate-600 mb-2 font-medium">Comienza tu viaje de autoconocimiento</p>
            <p className="text-sm text-slate-500 mb-6">Registra tu primer evento para descubrir tus patrones mentales y emocionales.</p>
            <button 
              onClick={() => navigate('/new-matrix')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Registrar mi primer evento
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
