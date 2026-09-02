import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { saveNightModeEntry } from '../../services/db';
import { savePendingNightModeEntry, syncPendingNightModeEntries } from '../../services/offlineSync';
import { serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Moon, ArrowLeft, Check } from 'lucide-react';

const isDevelopment = import.meta.env.DEV;

const NightMode = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState('');
  const [needsActionNow, setNeedsActionNow] = useState<boolean | null>(null);
  const [actionForTomorrow, setActionForTomorrow] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !thought) {
      toast.error('Por favor, describe qué está dando vueltas en tu cabeza.');
      return;
    }
    if (needsActionNow === null) {
      toast.error('Por favor, indica si esto necesita una acción ahora.');
      return;
    }
    if (!needsActionNow && !actionForTomorrow) {
      toast.error('Por favor, escribe qué harás mañana.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveNightModeEntry({
        userId: user.uid,
        thought,
        needsActionNow,
        actionForTomorrow: needsActionNow ? '' : actionForTomorrow,
        timestamp: serverTimestamp()
      });
      toast.success('Pensamiento guardado. Intenta relajarte ahora.');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving night mode entry to Firestore, attempting offline save: ", error);
      try {
        await savePendingNightModeEntry({
          userId: user.uid,
          thought,
          needsActionNow,
          actionForTomorrow: needsActionNow ? '' : actionForTomorrow,
        });
        toast.success('Pensamiento guardado localmente. Se sincronizará cuando haya conexión.');
        navigate('/dashboard');

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('sync-night-mode-entries')
              .then(() => { if (isDevelopment) console.log('Background sync registered: sync-night-mode-entries'); })
              .catch(err => console.error('Failed to register background sync:', err));
          });
        } else {
          if (isDevelopment) console.warn('Background Sync API not supported or service worker not ready.');
        }

        // Attempt immediate sync silently
        await syncPendingNightModeEntries(user.uid, true);
      } catch (offlineError) {
        console.error('Error saving night mode entry offline:', offlineError);
        toast.error('Error al guardar el pensamiento.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2 flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-400" />
          Modo Noche
        </h1>
      </header>

      <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
        {step === 1 && (
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">¿Qué está dando vueltas en tu cabeza?</h2>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg p-4 mb-6 flex-1 min-h-[150px] resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Escribe lo que estás pensando..."
            />
            <button
              onClick={() => setStep(2)}
              disabled={!thought}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-indigo-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">¿Esto necesita una acción ahora?</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setNeedsActionNow(true)}
                className={`p-6 rounded-lg border-2 transition-colors ${needsActionNow === true ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
              >
                <span className="text-lg font-bold">Sí</span>
              </button>
              <button
                onClick={() => setNeedsActionNow(false)}
                className={`p-6 rounded-lg border-2 transition-colors ${needsActionNow === false ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
              >
                <span className="text-lg font-bold">No</span>
              </button>
            </div>

            {needsActionNow === false && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-slate-300">¿Qué harás mañana?</h3>
                <textarea
                  value={actionForTomorrow}
                  onChange={(e) => setActionForTomorrow(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-lg p-4 min-h-[100px] resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: Buscar trabajo mañana, Resolver problema financiero..."
                />
                <p className="text-sm text-slate-400 mt-2">Guárdalo para mañana. Ahora es momento de descansar.</p>
              </div>
            )}

            {needsActionNow === true && (
              <div className="mb-6 p-4 bg-slate-800 rounded-lg">
                <p className="text-slate-300">Si necesita acción ahora, tómate un momento para respirar. ¿Es realmente urgente o tu mente te lo está diciendo?</p>
              </div>
            )}

            <div className="mt-auto flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (needsActionNow === false && !actionForTomorrow)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-indigo-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Guardando...' : <>Guardar <Check className="w-5 h-5" /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NightMode;
