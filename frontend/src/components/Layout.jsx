import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Calendar, Clock, BookOpen, Layers, CheckSquare, LogOut, GraduationCap
} from 'lucide-react';

const navItems = [
  { to: '/periodos', icon: Layers, label: 'Periodos' },
  { to: '/materias', icon: BookOpen, label: 'Materias' },
  { to: '/tareas', icon: CheckSquare, label: 'Tareas' },
  { to: '/horarios', icon: Clock, label: 'Horarios' },
  { to: '/calendario', icon: Calendar, label: 'Calendario' },
  { to: '/horario-semanal', icon: LayoutDashboard, label: 'Horario Semanal' },
];

const Layout = ({ children }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <GraduationCap size={28} className="brand-icon" />
          <span className="brand-name">EduTask</span>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{usuario?.nombre?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{usuario?.nombre}</span>
            <span className="user-email">{usuario?.correo}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
