import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices, getNightModeEntries } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { NightModeEntry } from '../../types/nightMode';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Moon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const formatDate = (timestamp: any): string => {
  if (!timestamp) return 'Fecha no disponible';
  if (timestamp instanceof Date) return timestamp.toLocaleString('es-PE');
  if (timestamp instanceof Timestamp) return timestamp.toDate().toLocaleString('es-PE');
  if (typeof timestamp === 'object' && timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString('es-PE');
  return 'Fecha no disponible';
};

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);
  const [nightEntries, setNightEntries] = useState<NightModeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getCausalMatrices(user.uid),
        getNightModeEntries(user.uid)
      ]).then(([mData, nData]) => {
        setMatrices(mData);
        setNightEntries(nData);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-4xl mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Historial</h1>
      </header>

      {loading ? (
        <p className="text-slate-500">Cargando historial...</p>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              Matrices Causales
            </h2>
            {matrices.length === 0 ? (
              <p className="text-slate-500 text-center py-4 bg-white rounded-xl shadow-sm">No hay matrices registradas.</p>
            ) : (
              <div className="space-y-4">
                {matrices.map((matrix) => (
                  <div key={matrix.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">{formatDate(matrix.timestamp)}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium text-slate-700">Herida:</span> {matrix.rootWound}</div>
                      <div><span className="font-medium text-slate-700">Disparador:</span> {matrix.triggerEvent}</div>
                      <div><span className="font-medium text-slate-700">Pensamiento:</span> {matrix.cognitiveBias}</div>
                      <div><span className="font-medium text-slate-700">Comportamiento:</span> {matrix.somaticCompulsion}</div>
                      <div className="col-span-2"><span className="font-medium text-slate-700">Consecuencia:</span> {matrix.feedbackLoop}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              Modo Noche
            </h2>
            {nightEntries.length === 0 ? (
              <p className="text-slate-500 text-center py-4 bg-white rounded-xl shadow-sm">No hay registros de Modo Noche.</p>
            ) : (
              <div className="space-y-4">
                {nightEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">{formatDate(entry.timestamp)}</p>
                    <p className="text-sm text-slate-800 mb-2"><span className="font-medium">Pensamiento:</span> {entry.thought}</p>
                    {entry.needsActionNow ? (
                      <p className="text-sm text-red-500">Marcado como urgente.</p>
                    ) : (
                      <p className="text-sm text-slate-600"><span className="font-medium">Para mañana:</span> {entry.actionForTomorrow}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default History;
