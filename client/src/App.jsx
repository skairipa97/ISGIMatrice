import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider } from './contexts/ThemeContext';

import Login from './pages/Login';
import Dashboard from './pages/Stagiaire/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import FormateurDashboard from './pages/Formateur/FormateurDashboard';
import AbsencesJustification from './pages/Stagiaire/AbsencesJustification';
import EtudiantGroupsPage from  './pages/Formateur/EtudiantGroupsPage';

import './App.css';
import AdminAbsences from './pages/Admin/Absences';

// Fonction utilitaire pour obtenir la route du dashboard selon le rôle
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
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
      // Merge role into user object if not present
      const userWithRole = { ...data.user, role: data.role || data.user.role };
      setUser(userWithRole);
      setIsAuthenticated(true);
      return {
        success: true,
        user: userWithRole,
      };
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login',
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUserProfile = (updatedUserData) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        ...updatedUserData,
      };

      if (updatedUserData.first_name || updatedUserData.last_name) {
        const firstName = updatedUserData.first_name || prevUser.first_name;
        const lastName = updatedUserData.last_name || prevUser.last_name;
        updatedUser.name = `${firstName} ${lastName}`;
      }

      return updatedUser;
    });
  };

  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirige vers le dashboard approprié selon le rôle
      return <Navigate to={getDashboardRoute(user.role)} />;
    }

    return element;
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-3 text-gray-700 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden touch-auto">
        <Router>
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to={getDashboardRoute(user.role)} />
                ) : <Login login={login} />
              }
            />

            {/* Stagiaire Protected Routes */}
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
              path="/profile"
              element={
                isAuthenticated && user?.role === 'stagiaire'
                  ? <Profile user={user} onLogout={logout} updateUserProfile={updateUserProfile} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated && user?.role === 'stagiaire'
                  ? <Settings user={user} onLogout={logout} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/stagiaire/absences-justification"
              element={
                <ProtectedRoute
                  element={<AbsencesJustification user={user} />}
                  allowedRoles={['stagiaire']}
                />
              }
            />

            {/* Admin Protected Route */}
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

            {/* Formateur Protected Route */}
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

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to={getDashboardRoute(user.role)} />
                ) : <Navigate to="/login" />
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;