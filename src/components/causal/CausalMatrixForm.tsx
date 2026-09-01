import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { RootWound, TriggerEvent, CognitiveBias, SomaticCompulsion, FeedbackLoop } from '../../types/causal';
import toast from 'react-hot-toast';
import { calculateMentalMetrics } from '../../lib/metrics';

const CausalMatrixForm = () => {
  const { user } = useAuth();
  const [rootWound, setRootWound] = useState<RootWound | ''>('');
  const [triggerEvent, setTriggerEvent] = useState<TriggerEvent | ''>('');
  const [cognitiveBias, setCognitiveBias] = useState<CognitiveBias | ''>('');
  const [somaticCompulsion, setSomaticCompulsion] = useState<SomaticCompulsion | ''>('');
  const [feedbackLoop, setFeedbackLoop] = useState<FeedbackLoop | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rootWound || !triggerEvent || !cognitiveBias || !somaticCompulsion || !feedbackLoop) {
      toast.error('Por favor, completa todos los campos de la matriz.');
      return;
    }

    setIsSubmitting(true);
    try {
      const causalInputs = {
        rootWound,
        triggerEvent,
        cognitiveBias,
        somaticCompulsion,
        feedbackLoop,
      };

      const mentalMetrics = calculateMentalMetrics(causalInputs);

      const newMatrixData = {
        userId: user.uid,
        ...causalInputs,
        ...mentalMetrics,
      };

      await addDoc(collection(db, 'causal_matrices'), {
        ...newMatrixData,
        timestamp: serverTimestamp(),
      });

      toast.success('Matriz Causal registrada con éxito.');
      // Reset form after successful submission
      setRootWound('');
      setTriggerEvent('');
      setCognitiveBias('');
      setSomaticCompulsion('');
      setFeedbackLoop('');

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Hubo un error al registrar tu matriz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelect = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    enumObject: { [key: string]: string }
  ) => (
    <div className="mb-4">
      <label className="block text-slate-700 text-sm font-bold mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="shadow border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
      >
        <option value="" disabled>Selecciona una opción</option>
        {Object.values(enumObject).map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Registra tu Matriz Causal de Hoy</h2>
        <p className="text-slate-600 mb-6 text-center">Identificar el patrón es el primer paso para romperlo.</p>
        <form onSubmit={handleSubmit}>
            {renderSelect('1. Herida Raíz', rootWound, (e) => setRootWound(e.target.value as RootWound), RootWound)}
            {renderSelect('2. Evento Disparador', triggerEvent, (e) => setTriggerEvent(e.target.value as TriggerEvent), TriggerEvent)}
            {renderSelect('3. Distorsión Cognitiva', cognitiveBias, (e) => setCognitiveBias(e.target.value as CognitiveBias), CognitiveBias)}
            {renderSelect('4. Compulsión Somática', somaticCompulsion, (e) => setSomaticCompulsion(e.target.value as SomaticCompulsion), SomaticCompulsion)}
            {renderSelect('5. Bucle de Retroalimentación', feedbackLoop, (e) => setFeedbackLoop(e.target.value as FeedbackLoop), FeedbackLoop)}
            
            <button 
                type="submit"
                disabled={isSubmitting || !rootWound || !triggerEvent || !cognitiveBias || !somaticCompulsion || !feedbackLoop}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Registrando...' : 'Registrar Matriz'}
            </button>
        </form>
    </div>
  );
};

export default CausalMatrixForm;
