import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Dashboard from './pages/Stagiaire/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Adashboard from './pages/Admin/Adashboard';
import Absences from './pages/Admin/Absences';
import StagiaireDetails from './pages/Admin/StagiaireDetails';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on page load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(response.data)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Authentication error:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = async (matricule, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        matricule,
        password
      })
      console.log(response.data);
      
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message)
      return { 
        success: false, 
        error: error.response?.data?.message || 'An error occurred during login' 
      }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUserProfile = (updatedUserData) => {
    setUser(prevUser => {
      // Create a new user object with the updated data
      const updatedUser = {
        ...prevUser,
        ...updatedUserData
      };
      
      // If first_name or last_name are updated, also update the virtual name property
      if (updatedUserData.first_name || updatedUserData.last_name) {
        const firstName = updatedUserData.first_name || prevUser.first_name;
        const lastName = updatedUserData.last_name || prevUser.last_name;
        updatedUser.name = `${firstName} ${lastName}`;
      }
      
      return updatedUser;
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden touch-auto">
      <Router>
        <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Adashboard />} />
              <Route path="/absences" element={<Absences />} />
              <Route path="/stagiaire/:id" element={<StagiaireDetails />} />
            </Routes>
          </main>
        </div>
        </div>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login login={login} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile user={user} onLogout={logout} updateUserProfile={updateUserProfile} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <Settings user={user} onLogout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App