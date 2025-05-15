import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import ThemeToggle from '../../components/ThemeToggle';
import Badge from '../../components/ui/Badge'

function Dashboard({ user, onLogout }) {
  const [userData, setUserData] = useState(user)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [photoPreview, setPhotoPreview] = useState(user?.photo ? `http://localhost:8000/storage/${user.photo}` : null);
  const [stats, setStats] = useState({
    totalAbsences: 0,
    justifiedAbsences: 0,
    unjustifiedAbsences: 0,   
    warningLevel: 'normal' // normal, warning, danger
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          onLogout()
          return
        }

        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        setUserData(response.data)
        
        // Simulate fetching stats
        setStats({
          totalAbsences: 8,
          justifiedAbsences: 6,
          unjustifiedAbsences: 2,
          warningLevel: 'warning'
        })
        
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch user data')
        setLoading(false)
        // If unauthorized, log out
        if (err.response?.status === 401) {
          onLogout()
        }
      }
    }

    if (!userData) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [userData, onLogout])
  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      onLogout()
    }
  }

  // Get appropriate color for warning level
  const getWarningLevelColor = (level) => {
    switch (level) {
      case 'normal':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'danger':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-100" role="alert">
          <span className="block sm:inline">Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={userData} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {userData?.nom}&nbsp;{userData?.prenom}

              </h1>
              <p className="mt-2 text-indigo-100">
                Here's an overview of your attendance information.
              </p>
            </div>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          {photoPreview ? (
            <div className="h-20 w-20 rounded-full overflow-hidden ring-1 ring-indigo-500 dark:ring-indigo-400">
              <img 
                src={photoPreview} 
                alt="Profile" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error('Photo inaccessible:', photoPreview);
                  e.target.src = ''; // Force le fallback
                  setPhotoPreview(null);
                }}
              />
            </div>
          ) : (
            <Avatar 
              name={`${userData?.nom} ${userData?.prenom}`}
              src={userData?.photo}
              size="xl" 
              status="online"
              className="ring-2 ring-indigo-500 dark:ring-indigo-400"
            />
  )}
</div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Absence Statistics
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Absences</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalAbsences}</p>
                  </div>
                  <span className="p-2 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Justified Absences</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.justifiedAbsences}</p>
                  </div>
                  <span className="p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unjustified Absences</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.unjustifiedAbsences}</p>
                  </div>
                  <span className="p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Warning level */}
        {!loading && !error && (
          <section className="mb-8">
            <div className={`rounded-lg p-4 ${getWarningLevelColor(stats.warningLevel)}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {stats.warningLevel === 'normal' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : stats.warningLevel === 'warning' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">
                    {stats.warningLevel === 'normal' ? 'Your attendance is good' : 
                     stats.warningLevel === 'warning' ? 'Warning: You\'re approaching the absence limit' :
                     'Alert: You\'ve exceeded the absence limit'}
                  </h3>
                  <p className="text-sm mt-1">
                    {stats.warningLevel === 'normal' ? 'Keep up the good work! Your absences are under control.' : 
                     stats.warningLevel === 'warning' ? 'You should be careful with further absences.' :
                     'Please contact administration immediately regarding your absences.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom Complet</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{userData?.nom}&nbsp;{userData?.prenom}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Matricule</p>
                  <div className="mt-1 flex items-center">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{userData?.matricule}</p>
                    <Badge variant="primary" className="ml-2">Active</Badge>
                  </div>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard