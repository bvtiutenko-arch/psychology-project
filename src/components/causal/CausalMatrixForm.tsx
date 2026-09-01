import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CausalInputs, RootWound, TriggerEvent, CognitiveBias, SomaticCompulsion, FeedbackLoop, MentalMetrics } from '../../types/causal';
import toast from 'react-hot-toast';
import { calculateMetrics } from '../../services/patternEngine';
import { getMetricColorClass } from '../../lib/metrics';
import SelectField from '../ui/SelectField';

// Initial state for the form data
const initialFormData: CausalInputs = {
  rootWound: '' as RootWound,
  triggerEvent: '' as TriggerEvent,
  cognitiveBias: '' as CognitiveBias,
  somaticCompulsion: '' as SomaticCompulsion,
  feedbackLoop: '' as FeedbackLoop,
};

const MetricDisplay = ({ label, value, colorClass }: { label: string; value: number; colorClass: { text: string; bg: string } }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-base font-medium text-slate-700">{label}</span>
      <span className={`text-sm font-medium ${colorClass.text}`}>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className={`${colorClass.bg} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const ResultsView = ({ metrics, onReset }: { metrics: MentalMetrics; onReset: () => void }) => {
  const clarityColors = getMetricColorClass(metrics.clarityIndex, false); // Higher is better
  const loopIntensityColors = getMetricColorClass(metrics.loopIntensity, true); // Lower is better
  const coupleFrictionColors = getMetricColorClass(metrics.coupleFriction, true); // Lower is better
  const sleepLatencyRiskColors = getMetricColorClass(metrics.sleepLatencyRisk, true); // Lower is better

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Análisis de tu Matriz</h2>
      <p className="text-slate-600 mb-6 text-center">Este es el impacto de tu patrón actual.</p>
      
      <MetricDisplay label="Índice de Claridad" value={metrics.clarityIndex} colorClass={clarityColors} />
      <MetricDisplay label="Intensidad del Bucle" value={metrics.loopIntensity} colorClass={loopIntensityColors} />
      <MetricDisplay label="Fricción en Pareja" value={metrics.coupleFriction} colorClass={coupleFrictionColors} />
      <MetricDisplay label="Riesgo de Insomnio" value={metrics.sleepLatencyRisk} colorClass={sleepLatencyRiskColors} />

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">Estrategias de Intervención Recomendadas</h3>
        {metrics.interventionStrategies.length > 0 ? (
          <ul className="list-disc list-inside text-slate-600 space-y-2 px-4">
            {metrics.interventionStrategies.map((strategy, index) => (
              <li key={index} className="bg-blue-50 p-2 rounded-md shadow-sm">{strategy}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600 text-center">No se encontraron estrategias específicas, pero siempre puedes practicar mindfulness y autocompasión.</p>
        )}
      </div>

      <button 
        onClick={onReset}
        className="w-full mt-6 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        Registrar otra matriz
      </button>
    </div>
  );
};

const SummaryView = ({ formData, onEdit, onConfirm, isSubmitting }: {
  formData: CausalInputs;
  onEdit: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}) => (
  <div>
    <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Revisa tu Matriz Causal</h2>
    <p className="text-slate-600 mb-6 text-center">Confirma tus selecciones antes de registrar.</p>

    <div className="space-y-4 mb-6">
      <div>
        <p className="font-semibold text-slate-700">1. Herida Raíz:</p>
        <p className="text-slate-600">{formData.rootWound}</p>
      </div>
      <div>
        <p className="font-semibold text-slate-700">2. Evento Disparador:</p>
        <p className="text-slate-600">{formData.triggerEvent}</p>
      </div>
      <div>
        <p className="font-semibold text-slate-700">3. Distorsión Cognitiva:</p>
        <p className="text-slate-600">{formData.cognitiveBias}</p>
      </div>
      <div>
        <p className="font-semibold text-slate-700">4. Compulsión Somática:</p>
        <p className="text-slate-600">{formData.somaticCompulsion}</p>
      </div>
      <div>
        <p className="font-semibold text-slate-700">5. Bucle de Retroalimentación:</p>
        <p className="text-slate-600">{formData.feedbackLoop}</p>
      </div>
    </div>

    <button
      onClick={onConfirm}
      disabled={isSubmitting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed mb-3"
    >
      {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
    </button>
    <button
      onClick={onEdit}
      disabled={isSubmitting}
      className="w-full bg-gray-300 hover:bg-gray-400 text-slate-800 font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
    >
      Editar Matriz
    </button>
  </div>
);

const CausalMatrixForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CausalInputs>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestMetrics, setLatestMetrics] = useState<MentalMetrics | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleReset = () => {
    setFormData(initialFormData);
    setLatestMetrics(null);
    setShowSummary(false);
  };

  const handleChange = (field: keyof CausalInputs, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as any })); // Cast to any for enum type compatibility
  };

  const isFormComplete = Object.values(formData).every(value => value !== '');

  const handleSubmit = async () => {
    if (!user || !isFormComplete) {
      toast.error('Por favor, completa todos los campos de la matriz.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { interventionStrategies, ...mentalMetricsWithoutStrategies } = calculateMetrics(formData);

      await addDoc(collection(db, 'causal_matrices'), {
        userId: user.uid,
        ...formData,
        ...mentalMetricsWithoutStrategies,
        interventionStrategies, // Store strategies separately
        timestamp: serverTimestamp(),
      });

      setLatestMetrics({ ...mentalMetricsWithoutStrategies, interventionStrategies });

      toast.success('Matriz Causal registrada con éxito.');
      setShowSummary(false); // Hide summary after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Hubo un error al registrar tu matriz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {latestMetrics ? (
        <ResultsView metrics={latestMetrics} onReset={handleReset} />
      ) : showSummary ? (
        <SummaryView
          formData={formData}
          onEdit={() => setShowSummary(false)}
          onConfirm={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Registra tu Matriz Causal de Hoy</h2>
          <p className="text-slate-600 mb-6 text-center">Identificar el patrón es el primer paso para romperlo.</p>
          <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
              <SelectField label="1. Herida Raíz" value={formData.rootWound} onChange={(e) => handleChange('rootWound', e.target.value)} enumObject={RootWound} disabled={isSubmitting} />
              <SelectField label="2. Evento Disparador" value={formData.triggerEvent} onChange={(e) => handleChange('triggerEvent', e.target.value)} enumObject={TriggerEvent} disabled={isSubmitting} />
              <SelectField label="3. Distorsión Cognitiva" value={formData.cognitiveBias} onChange={(e) => handleChange('cognitiveBias', e.target.value)} enumObject={CognitiveBias} disabled={isSubmitting} />
              <SelectField label="4. Compulsión Somática" value={formData.somaticCompulsion} onChange={(e) => handleChange('somaticCompulsion', e.target.value)} enumObject={SomaticCompulsion} disabled={isSubmitting} />
              <SelectField label="5. Bucle de Retroalimentación" value={formData.feedbackLoop} onChange={(e) => handleChange('feedbackLoop', e.target.value)} enumObject={FeedbackLoop} disabled={isSubmitting} />
              
              <button 
                  type="button" // Changed to type="button" to prevent form submission
                  onClick={() => setShowSummary(true)}
                  disabled={isSubmitting || !isFormComplete}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                  Revisar Matriz
              </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CausalMatrixForm;
