import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PeriodosPage from './pages/periodos/PeriodosPage';
import MateriasPage from './pages/materias/MateriasPage';
import TareasPage from './pages/tareas/TareasPage';
import HorariosPage from './pages/horarios/HorariosPage';
import CalendarioPage from './pages/calendario/CalendarioPage';
import HorarioSemanalPage from './pages/horario-semanal/HorarioSemanalPage';

import './index.css';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes inside Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/tareas" replace />} />
                  <Route path="/periodos" element={<PeriodosPage />} />
                  <Route path="/materias" element={<MateriasPage />} />
                  <Route path="/tareas" element={<TareasPage />} />
                  <Route path="/horarios" element={<HorariosPage />} />
                  <Route path="/calendario" element={<CalendarioPage />} />
                  <Route path="/horario-semanal" element={<HorarioSemanalPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
