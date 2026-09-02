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

export const CookiePolicy = () => (
  <LegalLayout title="Política de Cookies">
    <p>MenteEnCalma utiliza cookies y tecnologías similares para proporcionar y mejorar nuestros servicios. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo.</p>
    <h2>Tipos de Cookies que Utilizamos</h2>
    <ul>
      <li><strong>Cookies de Autenticación:</strong> Necesarias para mantener tu sesión iniciada de forma segura.</li>
      <li><strong>Cookies de Preferencias:</strong> Recordar tus configuraciones, como el modo oscuro.</li>
      <li><strong>Cookies de Analítica:</strong> Nos ayudan a entender cómo interactúas con la aplicación para mejorar la experiencia (si aplica).</li>
    </ul>
    <h2>Gestión de Cookies</h2>
    <p>Puedes configurar tu navegador para aceptar o bloquear cookies. Ten en cuenta que bloquear cookies esenciales puede afectar la funcionalidad de la aplicación.</p>
  </LegalLayout>
);

export const LegalNotice = () => (
  <LegalLayout title="Aviso Legal">
    <p>En cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales del Perú, y su Reglamento aprobado por D.S. 003-2013-JUS, te informamos lo siguiente:</p>
    <h2>Responsable del Tratamiento</h2>
    <p>El responsable del tratamiento de tus datos personales es MenteEnCalma, con domicilio en Lima, Perú.</p>
    <h2>Finalidad del Tratamiento</h2>
    <p>Los datos personales recopilados se utilizan exclusivamente para proporcionarte acceso a las funcionalidades de la aplicación, generar tus mapas de patrones y mejorar tu experiencia.</p>
    <h2>Derechos ARCO</h2>
    <p>Como titular de los datos personales, tienes derecho a ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO). Puedes ejercer estos derechos desde la configuración de la aplicación o contactándonos directamente.</p>
  </LegalLayout>
);
