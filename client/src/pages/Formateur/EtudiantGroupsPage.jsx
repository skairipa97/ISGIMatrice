import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Search } from 'lucide-react'

function EtudiantGroupsPage({ user, onLogout }) {
  const [userData, setUserData] = useState(user)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [groups, setGroups] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
        
        // Simulate fetching groups data
        setGroups([
          {
            id: 'DD101',
            name: 'Développement Digital',
            type: 'development',
            color: 'bg-blue-600',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-100',
            darkBgColor: 'dark:bg-blue-900/30',
            darkTextColor: 'dark:text-blue-400'
          },
          {
            id: 'ID202',
            name: 'Infrastructure Digitale',
            type: 'infrastructure',
            color: 'bg-green-600',
            textColor: 'text-green-600',
            bgColor: 'bg-green-100',
            darkBgColor: 'dark:bg-green-900/30',
            darkTextColor: 'dark:text-green-400'
          },
          {
            id: 'MD303',
            name: 'Marketing Digital',
            type: 'marketing',
            color: 'bg-purple-600',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-100',
            darkBgColor: 'dark:bg-purple-900/30',
            darkTextColor: 'dark:text-purple-400'
          }
        ])
        
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
      // Simulate fetching groups data
      setGroups([
        {
          id: 'DD101',
          name: 'Développement Digital',
          type: 'development',
          color: 'bg-blue-600',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          darkBgColor: 'dark:bg-blue-900/30',
          darkTextColor: 'dark:text-blue-400'
        },
        {
          id: 'ID202',
          name: 'Infrastructure Digitale',
          type: 'infrastructure',
          color: 'bg-green-600',
          textColor: 'text-green-600',
          bgColor: 'bg-green-100',
          darkBgColor: 'dark:bg-green-900/30',
          darkTextColor: 'dark:text-green-400'
        },
        {
          id: 'MD303',
          name: 'Marketing Digital',
          type: 'marketing',
          color: 'bg-purple-600',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-100',
          darkBgColor: 'dark:bg-purple-900/30',
          darkTextColor: 'dark:text-purple-400'
        }
      ])
      setLoading(false)
    }
  }, [userData, onLogout])
  

  const filterGroups = () => {
    let filteredGroups = [...groups];
    
    // Filter by type
    if (selectedType !== 'all') {
      filteredGroups = filteredGroups.filter(group => group.type === selectedType);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredGroups = filteredGroups.filter(group => 
        group.id.toLowerCase().includes(query) || 
        group.name.toLowerCase().includes(query)
      );
    }
    
    return filteredGroups;
  };

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
    <DashboardLayout>
      <div className="container px-4 py-6 mx-auto">
        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Group Enrollments</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 sm:text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="development">Development</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>
        
        {/* Groups Grid */}
        <section className="mb-8">
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
              {filterGroups().map((group) => (
                <Card key={group.id} className="overflow-hidden">
                  <div className={`h-2 ${group.color}`}></div>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${group.textColor} ${group.bgColor} ${group.darkBgColor} ${group.darkTextColor}`}>
                        {group.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{group.id}</h3>
                    <div className="mt-6 flex justify-between items-center">
                      <button 
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm font-medium"
                      >
                        View Details
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
        
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Your enrollment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom Complet</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{userData?.nom || 'FATIHI'}&nbsp;{userData?.prenom || 'Aicha'}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Matricule</p>
                  <div className="mt-1 flex items-center">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{userData?.matricule || '979797'}</p>
                    <Badge variant="primary" className="ml-2">Active</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Groups</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{groups.length}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <div className="mt-1 flex items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Enrolled
                    </span>
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

export default EtudiantGroupsPage