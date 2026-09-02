import { useNavigate } from 'react-router-dom';
import { Brain, Moon, Activity, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-400">MenteEnCalma</h1>
        <button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Iniciar sesión
        </button>
      </header>

      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-300">
          Tu mapa personal de patrones
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          No es un diario. No es un chatbot. Es tu inteligencia personal para entender el sobrepensamiento y la ansiedad.
        </p>
        <button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
          Comenzar ahora
        </button>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl">
          <Activity className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Motor de Patrones</h3>
          <p className="text-slate-400">Registra pequeños eventos y descubre conexiones causales en tu comportamiento.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl">
          <Moon className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Modo Noche</h3>
          <p className="text-slate-400">¿No puedes dormir por pensar demasiado? Guarda tus pensamientos para mañana.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl">
          <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Privacidad Total</h3>
          <p className="text-slate-400">Tus datos son tuyos. Exporta o elimina todo cuando quieras.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacidad</button>
          <button onClick={() => navigate('/terms')} className="hover:text-white">Términos</button>
          <button onClick={() => navigate('/contact')} className="hover:text-white">Contacto</button>
          <button onClick={() => navigate('/faq')} className="hover:text-white">FAQ</button>
          <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
          <button onClick={() => navigate('/legal')} className="hover:text-white">Aviso Legal</button>
        </div>
        <p>© 2024 MenteEnCalma. Hecho en Perú.</p>
      </footer>
    </div>
  );
};

export default Landing;
