import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import ThemeToggle from '../../components/ThemeToggle'
import Badge from '../../components/ui/Badge'

function FormateurDashboard({ user, onLogout }) {
  const [userData, setUserData] = useState(user)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalGroupes: 0,
    totalEtudiants: 0,
    absencesRecentes: 0
  })
  const [selectedGroupe, setSelectedGroupe] = useState('all')
  const [selectedFiliere, setSelectedFiliere] = useState('all')
  const [groupes, setGroupes] = useState([])
  const [filieres, setFilieres] = useState([])
  const [absences, setAbsences] = useState([])

  useEffect(() => {
    const fetchFormateurData = async () => {
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
          totalGroupes: 6,
          totalEtudiants: 158,
          absencesRecentes: 24
        })

        // Simulate fetching groupes
        setGroupes([
          { id: 1, nom: 'GLSID 1', filiere: 'GLSID' },
          { id: 2, nom: 'GLSID 2', filiere: 'GLSID' },
          { id: 3, nom: 'BDCC 1', filiere: 'BDCC' },
          { id: 4, nom: 'BDCC 2', filiere: 'BDCC' },
          { id: 5, nom: 'IIR 1', filiere: 'IIR' },
          { id: 6, nom: 'IIR 2', filiere: 'IIR' },
        ])

        // Simulate fetching filieres
        setFilieres([
          { id: 1, nom: 'GLSID' },
          { id: 2, nom: 'BDCC' },
          { id: 3, nom: 'IIR' },
        ])

        // Simulate fetching absences
        setAbsences([
          { id: 1, etudiant: { nom: 'Alaoui', prenom: 'Karim', matricule: 'ETU001', avatar: null }, date: '2025-05-10', cours: 'Java Avancé', groupe: 'GLSID 1', filiere: 'GLSID', justifiee: false },
          { id: 2, etudiant: { nom: 'Bennani', prenom: 'Laila', matricule: 'ETU023', avatar: null }, date: '2025-05-10', cours: 'Java Avancé', groupe: 'GLSID 1', filiere: 'GLSID', justifiee: true },
          { id: 3, etudiant: { nom: 'Tazi', prenom: 'Youssef', matricule: 'ETU045', avatar: null }, date: '2025-05-11', cours: 'DevOps', groupe: 'BDCC 2', filiere: 'BDCC', justifiee: false },
          { id: 4, etudiant: { nom: 'Idrissi', prenom: 'Salma', matricule: 'ETU067', avatar: null }, date: '2025-05-12', cours: 'Réseaux', groupe: 'IIR 1', filiere: 'IIR', justifiee: false },
          { id: 5, etudiant: { nom: 'El Amrani', prenom: 'Ahmed', matricule: 'ETU089', avatar: null }, date: '2025-05-12', cours: 'Réseaux', groupe: 'IIR 1', filiere: 'IIR', justifiee: true },
          { id: 6, etudiant: { nom: 'Bouhdoud', prenom: 'Fatima', matricule: 'ETU125', avatar: null }, date: '2025-05-13', cours: 'Big Data', groupe: 'BDCC 1', filiere: 'BDCC', justifiee: false },
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
      fetchFormateurData()
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

  // Filtrer les absences selon les filtres sélectionnés
  const filteredAbsences = absences.filter(absence => {
    const groupeMatch = selectedGroupe === 'all' || absence.groupe === selectedGroupe
    const filiereMatch = selectedFiliere === 'all' || absence.filiere === selectedFiliere
    return groupeMatch && filiereMatch
  })

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
    <DashboardLayout user={userData} onLogout={handleLogout} showGroupsLink>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bienvenue, Pr. {userData?.nom}&nbsp;{userData?.prenom}
              </h1>
              <p className="mt-2 text-indigo-100">
                Voici une vue d'ensemble de vos groupes et des absences d'étudiants.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
              <Avatar 
                name={`${userData?.nom} ${userData?.prenom}`}
                size="xl" 
                status="online"
              />
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Statistiques Générales
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total des Groupes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalGroupes}</p>
                  </div>
                  <span className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total des Étudiants</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalEtudiants}</p>
                  </div>
                  <span className="p-2 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absences Récentes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.absencesRecentes}</p>
                  </div>
                  <span className="p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Filters Section */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtres</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="groupe-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filtrer par Groupe
                </label>
                <div className="relative">
                  <select
                    id="groupe-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:text-white"
                    value={selectedGroupe}
                    onChange={(e) => setSelectedGroupe(e.target.value)}
                  >
                    <option value="all">Tous les groupes</option>
                    {groupes.map(groupe => (
                      <option key={groupe.id} value={groupe.nom}>{groupe.nom}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="filiere-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filtrer par Filière
                </label>
                <div className="relative">
                  <select
                    id="filiere-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:text-white"
                    value={selectedFiliere}
                    onChange={(e) => setSelectedFiliere(e.target.value)}
                  >
                    <option value="all">Toutes les filières</option>
                    {filieres.map(filiere => (
                      <option key={filiere.id} value={filiere.nom}>{filiere.nom}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Absences List */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Liste des Absences
          </h2>
          
          {filteredAbsences.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Aucune absence trouvée avec les filtres actuels.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAbsences.map(absence => (
                <Card key={absence.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar 
                        name={`${absence.etudiant.nom} ${absence.etudiant.prenom}`}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {absence.etudiant.nom} {absence.etudiant.prenom}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {absence.etudiant.matricule}
                        </p>
                      </div>
                      <Badge 
                        variant={absence.justifiee ? "success" : "danger"}
                        className={absence.justifiee ? 
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {absence.justifiee ? "Justifiée" : "Non Justifiée"}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{absence.date}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Cours</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{absence.cours}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Groupe</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{absence.groupe}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Filière</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{absence.filiere}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                        Voir détails
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}

export default FormateurDashboard