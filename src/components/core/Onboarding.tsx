import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Map, ShieldCheck, Activity, Sparkles, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = [
  {
    icon: Map,
    title: 'Tu Mapa Personal',
    description: 'MenteEnCalma no es un diario ni un chatbot. Es tu inteligencia personal para entender el sobrepensamiento y la ansiedad.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-100',
  },
  {
    icon: ShieldCheck,
    title: 'Privacidad Total',
    description: 'Tus datos son tuyos. Todo se almacena de forma segura. Puedes exportar o eliminar todo cuando quieras.',
    color: 'text-green-500',
    bg: 'bg-green-100',
  },
  {
    icon: Activity,
    title: 'Cómo Funciona',
    description: 'Registra pequeños eventos. Nuestro motor encontrará conexiones causales en tu comportamiento para ayudarte a romper patrones.',
    color: 'text-blue-500',
    bg: 'bg-blue-100',
  },
  {
    icon: Sparkles,
    title: 'Comienza tu Viaje',
    description: 'Estás a un paso de descubrir tus patrones mentales y emocionales. Empecemos.',
    color: 'text-purple-500',
    bg: 'bg-purple-100',
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    try {
      // Use setDoc with merge to ensure the document exists even if creation failed somehow
      await setDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true,
      }, { merge: true });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      toast.error('Error al guardar el progreso. Intenta de nuevo.');
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${step.bg} flex items-center justify-center`}>
          <Icon className={`w-10 h-10 ${step.color}`} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h2>
        <p className="text-slate-600 mb-8">{step.description}</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep ? 'bg-indigo-600 w-6' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? (
            <>Comenzar <Check className="w-5 h-5" /></>
          ) : (
            <>Siguiente <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
