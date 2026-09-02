import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Hand, Ear, Flower, Coffee, Check } from 'lucide-react';

const steps = [
  { sense: 'ver', icon: Eye, color: 'text-blue-500', prompt: 'Nombra 5 cosas que puedes ver a tu alrededor.' },
  { sense: 'tocar', icon: Hand, color: 'text-green-500', prompt: 'Nombra 4 cosas que puedes tocar o sentir.' },
  { sense: 'escuchar', icon: Ear, color: 'text-yellow-500', prompt: 'Nombra 3 cosas que puedes escuchar.' },
  { sense: 'oler', icon: Flower, color: 'text-purple-500', prompt: 'Nombra 2 cosas que puedes oler.' },
  { sense: 'saborear', icon: Coffee, color: 'text-red-500', prompt: 'Nombra 1 cosa que puedes saborear.' },
];

const GroundingExercise = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInput('');
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">¡Bien hecho!</h1>
        <p className="text-slate-600 text-center mb-8">
          Has completado el ejercicio de anclaje. Espero que te sientas más presente y tranquilo.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col max-w-md mx-auto">
      <header className="flex items-center mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Ejercicio de Anclaje</h1>
      </header>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-12">
        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-8">
          <Icon className={`w-12 h-12 ${step.color}`} />
        </div>
        
        <p className="text-sm text-slate-500 mb-2">Paso {currentStep + 1} de {steps.length}</p>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{step.prompt}</h2>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-white rounded-lg p-4 mb-6 min-h-[120px] resize-none border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          placeholder={`Escribe aquí lo que puedes ${step.sense}...`}
        />

        <button
          onClick={handleNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {currentStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
        </button>
      </div>
    </div>
  );
};

export default GroundingExercise;
