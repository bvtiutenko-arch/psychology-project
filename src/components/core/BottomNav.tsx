import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Moon, ListTodo, BarChart2 } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: Home },
    { path: '/new-matrix', label: 'Matriz', icon: PlusCircle },
    { path: '/night-mode', label: 'Noche', icon: Moon },
    { path: '/tomorrow', label: 'Mañana', icon: ListTodo },
    { path: '/analytics', label: 'Datos', icon: BarChart2 },
  ];

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-40 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors ${
              isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
