import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const LegalLayout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8">
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </button>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="prose prose-slate max-w-none">
        {children}
      </div>
    </div>
  );
};

export const Privacy = () => (
  <LegalLayout title="Política de Privacidad">
    <p>MenteEnCalma respeta tu privacidad. No vendemos tus datos emocionales. Toda la información se almacena de forma segura en Firebase.</p>
    <h2>Datos que almacenamos</h2>
    <ul>
      <li>Información de tu cuenta de Google (nombre, email, foto).</li>
      <li>Registros de eventos, pensamientos y emociones que tú ingresas.</li>
    </ul>
    <h2>Tus derechos</h2>
    <p>Puedes exportar o eliminar todos tus datos en cualquier momento desde la configuración.</p>
  </LegalLayout>
);

export const Terms = () => (
  <LegalLayout title="Términos de Servicio">
    <p>Al usar MenteEnCalma, aceptas que esta aplicación no es un sustituto de tratamiento médico o psicológico profesional.</p>
    <p>La aplicación proporciona herramientas de autoconocimiento basadas en tus propios registros, pero no emite diagnósticos.</p>
  </LegalLayout>
);

export const Contact = () => (
  <LegalLayout title="Contacto">
    <p>Si tienes preguntas o sugerencias, puedes contactarnos en: <a href="mailto:soporte@menteencalma.app" className="text-indigo-600">soporte@menteencalma.app</a></p>
  </LegalLayout>
);

export const FAQ = () => (
  <LegalLayout title="Preguntas Frecuentes">
    <h2>¿MenteEnCalma usa IA?</h2>
    <p>No. MenteEnCalma utiliza un motor determinístico basado en reglas para encontrar patrones. No hay chatbots ni IA generativa.</p>
    <h2>¿Mis datos están seguros?</h2>
    <p>Sí, utilizamos Firebase con reglas de seguridad estrictas. Solo tú puedes ver tus datos.</p>
  </LegalLayout>
);
