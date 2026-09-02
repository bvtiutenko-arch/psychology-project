import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTomorrowTasks, saveTomorrowTask, updateTomorrowTask, deleteTomorrowTask } from '../../services/db';
import { TomorrowTask } from '../../types/tomorrowBox';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TomorrowBox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TomorrowTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getTomorrowTasks(user.uid).then(data => {
        setTasks(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleAdd = async () => {
    if (!user || !newTask) return;
    try {
      await saveTomorrowTask({ userId: user.uid, text: newTask, completed: false });
      setNewTask('');
      const updatedTasks = await getTomorrowTasks(user.uid);
      setTasks(updatedTasks);
      toast.success('Tarea guardada para mañana.');
    } catch (error) {
      toast.error('Error al guardar la tarea.');
    }
  };

  const handleToggle = async (task: TomorrowTask) => {
    if (!task.id) return;
    try {
      await updateTomorrowTask(task.id, { completed: !task.completed, completedAt: !task.completed ? new Date() : null });
      const updatedTasks = await getTomorrowTasks(user.uid);
      setTasks(updatedTasks);
    } catch (error) {
      toast.error('Error al actualizar la tarea.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTomorrowTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Tarea eliminada.');
    } catch (error) {
      toast.error('Error al eliminar la tarea.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Caja de Mañana</h1>
      </header>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ej: Buscar trabajo, Resolver problema..."
          className="flex-1 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button onClick={handleAdd} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay tareas pendientes. ¡Añade una!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id} className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${task.completed ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggle(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <span className={`${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.text}</span>
              </div>
              <button onClick={() => handleDelete(task.id!)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TomorrowBox;
