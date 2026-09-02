import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCausalMatrices, getNightModeEntries, getTomorrowTasks, deleteCausalMatrix, deleteNightModeEntry, deleteTomorrowTask } from '../../services/db';
import { CausalMatrix } from '../../types/causal';
import { NightModeEntry } from '../../types/nightMode';
import { TomorrowTask } from '../../types/tomorrowBox';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Moon, Calendar, Trash2, Check } from 'lucide-react';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<CausalMatrix[]>([]);
  const [nightEntries, setNightEntries] = useState<NightModeEntry[]>([]);
  const [tomorrowTasks, setTomorrowTasks] = useState<TomorrowTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getCausalMatrices(user.uid),
        getNightModeEntries(user.uid),
        getTomorrowTasks(user.uid)
      ]).then(([mData, nData, tData]) => {
        setMatrices(mData);
        setNightEntries(nData);
        setTomorrowTasks(tData);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
    }
  }, [user]);

  const handleDeleteMatrix = async (id: string) => {
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      try {
        await deleteCausalMatrix(id);
        setMatrices(matrices.filter(m => m.id !== id));
        toast.success('Matriz eliminada.');
      } catch (error) {
        console.error('Error deleting matrix:', error);
        toast.error('Error al eliminar la matriz.');
      }
    }
  };

  const handleDeleteNightEntry = async (id: string) => {
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      try {
        await deleteNightModeEntry(id);
        setNightEntries(nightEntries.filter(e => e.id !== id));
        toast.success('Registro eliminado.');
      } catch (error) {
        console.error('Error deleting night entry:', error);
        toast.error('Error al eliminar el registro.');
      }
    }
  };

  const handleDeleteTomorrowTask = async (id: string) => {
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      try {
        await deleteTomorrowTask(id);
        setTomorrowTasks(tomorrowTasks.filter(t => t.id !== id));
        toast.success('Tarea eliminada.');
      } catch (error) {
        console.error('Error deleting tomorrow task:', error);
        toast.error('Error al eliminar la tarea.');
      }
    }
  };

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
                  <div key={matrix.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative">
                    <button 
                      onClick={() => handleDeleteMatrix(matrix.id!)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-slate-500 mb-2">{formatDate(matrix.timestamp, true)}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium text-slate-700">Herida:</span> {matrix.rootWound}</div>
                      <div><span className="font-medium text-slate-700">Disparador:</span> {matrix.triggerEvent}</div>
                      <div><span className="font-medium text-slate-700">Pensamiento:</span> {matrix.cognitiveBias}</div>
                      <div><span className="font-medium text-slate-700">Emoción:</span> {matrix.emotion} ({matrix.intensity}/5)</div>
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
                  <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative">
                    <button 
                      onClick={() => handleDeleteNightEntry(entry.id!)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-slate-500 mb-2">{formatDate(entry.timestamp, true)}</p>
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

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Caja de Mañana
            </h2>
            {tomorrowTasks.length === 0 ? (
              <p className="text-slate-500 text-center py-4 bg-white rounded-xl shadow-sm">No hay tareas registradas.</p>
            ) : (
              <div className="space-y-4">
                {tomorrowTasks.map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative">
                    <button 
                      onClick={() => handleDeleteTomorrowTask(task.id!)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-slate-500 mb-2">{formatDate(task.createdAt, true)}</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                        {task.completed && <Check className="w-4 h-4" />}
                      </div>
                      <span className={`${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.text}</span>
                    </div>
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
