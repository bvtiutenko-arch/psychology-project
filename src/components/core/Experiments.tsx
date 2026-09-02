import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getExperiments, saveExperiment, updateExperiment, deleteExperiment } from '../../services/db';
import { Experiment } from '../../types/experiments';
import { InterventionStrategy } from '../../types/causal';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, Trash2, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/date';

const Experiments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [strategy, setStrategy] = useState<InterventionStrategy | ''>('');

  useEffect(() => {
    if (user) {
      getExperiments(user.uid)
        .then(data => {
          setExperiments(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching experiments:', err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleAdd = async () => {
    if (!user || !hypothesis || !strategy) {
      toast.error('Por favor, completa la hipótesis y la estrategia.');
      return;
    }
    try {
      await saveExperiment({ userId: user.uid, hypothesis, strategy, status: 'pending' });
      setHypothesis('');
      setStrategy('');
      setShowForm(false);
      const updatedExperiments = await getExperiments(user.uid);
      setExperiments(updatedExperiments);
      toast.success('Experimento creado.');
    } catch (error) {
      console.error('Error saving experiment:', error);
      toast.error('Error al guardar el experimento.');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'success' | 'failure' | 'inconclusive') => {
    if (!user) return;
    try {
      await updateExperiment(id, { status, completedAt: new Date() });
      const updatedExperiments = await getExperiments(user.uid);
      setExperiments(updatedExperiments);
      toast.success('Experimento actualizado.');
    } catch (error) {
      toast.error('Error al actualizar el experimento.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperiment(id);
      setExperiments(experiments.filter(e => e.id !== id));
      toast.success('Experimento eliminado.');
    } catch (error) {
      toast.error('Error al eliminar el experimento.');
    }
  };

  const activeExperiments = experiments.filter(e => e.status === 'pending');
  const completedExperiments = experiments.filter(e => e.status !== 'pending');

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Experimentos</h1>
      </header>

      <div className="mb-6">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Nuevo Experimento
          </button>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Nuevo Experimento</h2>
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-bold mb-2">Hipótesis</label>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                placeholder="Ej: Si practico respiración cuando me dejen en visto, pensaré menos en ello."
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-bold mb-2">Estrategia</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as InterventionStrategy)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="" disabled>Selecciona una estrategia</option>
                {Object.values(InterventionStrategy).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-200 text-slate-800 p-3 rounded-lg hover:bg-slate-300">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">Guardar</button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-indigo-500" />
              Activos
            </h2>
            {activeExperiments.length === 0 ? (
              <p className="text-slate-500 text-center py-4 bg-white rounded-xl shadow-sm">No hay experimentos activos.</p>
            ) : (
              <div className="space-y-4">
                {activeExperiments.map(exp => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">{formatDate(exp.createdAt, true)}</p>
                    <p className="text-sm font-medium text-slate-800 mb-1">Hipótesis: {exp.hypothesis}</p>
                    <p className="text-sm text-slate-600 mb-3">Estrategia: {exp.strategy}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateStatus(exp.id!, 'success')} className="flex-1 bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 flex items-center justify-center gap-1 text-sm font-medium">
                        <Check className="w-4 h-4" /> Funcionó
                      </button>
                      <button onClick={() => handleUpdateStatus(exp.id!, 'failure')} className="flex-1 bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 flex items-center justify-center gap-1 text-sm font-medium">
                        <X className="w-4 h-4" /> No funcionó
                      </button>
                      <button onClick={() => handleDelete(exp.id!)} className="bg-slate-100 text-slate-500 p-2 rounded-lg hover:bg-slate-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {completedExperiments.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Historial</h2>
              <div className="space-y-4">
                {completedExperiments.map(exp => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">{formatDate(exp.createdAt, true)}</p>
                    <p className="text-sm font-medium text-slate-800 mb-1">Hipótesis: {exp.hypothesis}</p>
                    <p className="text-sm text-slate-600 mb-2">Estrategia: {exp.strategy}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        exp.status === 'success' ? 'bg-green-100 text-green-600' :
                        exp.status === 'failure' ? 'bg-red-100 text-red-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {exp.status === 'success' ? 'Funcionó' : exp.status === 'failure' ? 'No funcionó' : 'Inconcluso'}
                      </span>
                      <button onClick={() => handleDelete(exp.id!)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Experiments;
