import { auth } from '../../firebase';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { useEffect, useState, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Moon, Activity, Heart, TrendingDown, Sparkles, Calendar, BarChart, Settings, Network, History } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const MetricCard = ({ title, value, change, invertColor }: { title: string; value?: number; change?: number | null; invertColor?: boolean }) => {
  if (value === undefined) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-sm text-slate-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-300">--</p>
      </div>
    );
  }
  const isPositive = invertColor ? change! < 0 : change! > 0;
  const changeColor = change === null || change === 0 ? 'text-slate-400' : isPositive ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-sm text-slate-500 mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-800">{value}%</p>
        {change !== null && change !== 0 && (
          <span className={`text-xs font-medium ${changeColor}`}>
            {change! > 0 ? '↑' : '↓'} {Math.abs(change!)}
          </span>
        )}
      </div>
    </div>
  );
};

const NavCard = ({ icon, title, path, color }: { icon: ReactNode; title: string; path: string; color: string }) => (
  <Link 
    to={path}
    className={`${color} text-white p-4 rounded-xl shadow-sm hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2`}
  >
    {icon}
    <span className="font-medium text-sm">{title}</span>
  </Link>
);

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

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Hola, {user?.displayName?.split(' ')[0]}
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
        <NavCard icon={<Settings className="w-6 h-6" />} title="Ajustes" path="/settings" color="bg-slate-500" />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          {latestDateLabel}
        </h2>
        {loading ? (
          <p className="text-slate-500">Cargando datos...</p>
        ) : latestMatrix ? (
          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="Claridad" value={latestMatrix.clarityIndex} change={clarityChange} />
            <MetricCard title="Overthinking" value={latestMatrix.loopIntensity} change={loopChange} invertColor />
            <MetricCard title="Fricción Pareja" value={latestMatrix.coupleFriction} change={frictionChange} invertColor />
            <MetricCard title="Riesgo Insomnio" value={latestMatrix.sleepLatencyRisk} change={sleepChange} invertColor />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500 mb-4">Aún no has registrado nada hoy.</p>
            <button 
              onClick={() => navigate('/new-matrix')}
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Registrar mi primer evento
            </button>
          </div>
        )}
      </section>

      {latestMatrix && (
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
      )}

      {latestMatrix && latestMatrix.interventionStrategies.length > 0 && (
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
    </div>
  );
};

export default Dashboard;
