// AppRoutes.jsx
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Stagiaire/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import FormateurDashboard from './pages/Formateur/FormateurDashboard';
import AbsencesJustification from './pages/Stagiaire/AbsencesJustification';
import EtudiantGroupsPage from './pages/Formateur/EtudiantGroupsPage';
import ListeDesAbsences from './pages/Formateur/ListeDesAbsences';
import AdminAbsences from './pages/Admin/Absences';
import AdminJustifications from './pages/Admin/Justification';

const getDashboardRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'formateur':
      return '/formateur/dashboard';
    default:
      return '/dashboard';
  }
};

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userWithRole = {
          ...data,
          role: data.role || role,
        };

        setUser(userWithRole);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (matricule, password) => {
    try {
      const { data } = await axios.post('http://localhost:8000/api/login', {
        matricule,
        password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('matricule', data.user?.matricule);
      localStorage.setItem('user', data.user);
   

      const userWithRole = {
        ...data.user,
        role: data.role,
      };

      setUser(userWithRole);
      setIsAuthenticated(true);

      navigate(getDashboardRoute(data.role));

      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={getDashboardRoute(user.role)} replace />;
    }

    return element;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRoute(user.role)} replace />
          ) : (
            <Login login={login} />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRoute(user.role)} replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRoute(user.role)} replace />
          ) : (
            <ResetPassword />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<Dashboard user={user} onLogout={logout} />}
            allowedRoles={['stagiaire']}
          />
        }
      />
      <Route
        path="/stagiaire/absences-justification"
        element={
          <ProtectedRoute
            element={<AbsencesJustification user={user} onLogout={logout} />}
            allowedRoles={['stagiaire']}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            element={<AdminDashboard user={user} onLogout={logout} />}
            allowedRoles={['admin']}
          />
        }
      />
      <Route
        path="/absences"
        element={
          <ProtectedRoute
            element={<AdminAbsences user={user} onLogout={logout} />}
            allowedRoles={['admin']}
          />
        }
      />
      <Route
        path="/justifications"
        element={
          <ProtectedRoute
            element={<AdminJustifications user={user} onLogout={logout}/>}
            allowedRoles={['admin']}
          />
        }
      />
      <Route
        path="/formateur/dashboard"
        element={
          <ProtectedRoute
            element={<FormateurDashboard user={user} onLogout={logout} />}
            allowedRoles={['formateur']}
          />
        }
      />
      <Route
        path="/groupes"
        element={
          <ProtectedRoute
            element={<EtudiantGroupsPage user={user} onLogout={logout} />}
            allowedRoles={['formateur']}
          />
        }
      />
      <Route
        path="/groupes/:groupId/absences"
        element={
          <ProtectedRoute
            element={<ListeDesAbsences user={user} onLogout={logout} />}
            allowedRoles={['formateur']}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            element={<Profile user={user} />}
            allowedRoles={['admin', 'formateur', 'stagiaire']}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute
            element={<Settings user={user} />}
            allowedRoles={['admin', 'formateur', 'stagiaire']}
          />
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRoute(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
