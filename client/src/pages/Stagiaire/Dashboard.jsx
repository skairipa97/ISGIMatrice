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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const matricule = localStorage.getItem('matricule')
        
        if (!token || !matricule) {
          onLogout()
          return
        }

        // Récupération des données utilisateur
        const userResponse = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setUserData(userResponse.data)
        
        // Récupération des données d'absences
        const absencesResponse = await fetch(`http://localhost:8000/api/absences?stagiaire=${matricule}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!absencesResponse.ok) {
          throw new Error('Échec de récupération des données d\'absences')
        }

        const absencesData = await absencesResponse.json()
        
        // Calcul des statistiques
        const justifiedAbsences = absencesData.filter(abs => abs.is_justified).length
        const unjustifiedAbsences = absencesData.filter(abs => !abs.is_justified).length
        
        // Détermination du niveau d'alerte
        let warningLevel = 'normal'
        if (unjustifiedAbsences >= 5) {
          warningLevel = 'danger'
        } else if (unjustifiedAbsences >= 3) {
          warningLevel = 'warning'
        }

        setStats({
          totalAbsences: absencesData.length,
          justifiedAbsences,
          unjustifiedAbsences,
          warningLevel
        })
        
        setLoading(false)
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err)
        setError(err.message.includes('<!doctype') 
          ? 'Erreur de connexion au serveur' 
          : err.message)
        setLoading(false)
        
        if (err.response?.status === 401 || err.message.includes('401')) {
          onLogout()
        }
      }
    }

    fetchData()
  }, [onLogout])
  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (err) {
      console.error('Erreur de déconnexion:', err)
    } finally {
      onLogout()
    }
  }

  // Obtenir la couleur appropriée pour le niveau d'alerte
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
          <span className="block sm:inline">Erreur : {error}</span>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={userData} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Section de bienvenue */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bon retour, {userData?.nom}&nbsp;{userData?.prenom}
              </h1>
              <p className="mt-2 text-indigo-100">
                Voici un aperçu de vos informations de présence.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
              {photoPreview ? (
                <div className="h-20 w-20 rounded-full overflow-hidden ring-1 ring-indigo-500 dark:ring-indigo-400">
                  <img 
                    src={photoPreview} 
                    alt="Profil" 
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
        
        {/* Grille de statistiques */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Statistiques d'absence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total des absences</p>
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absences justifiées</p>
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absences non justifiées</p>
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
        </section>
        
        {/* Niveau d'alerte */}
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
                  {stats.warningLevel === 'normal' ? 'Votre assiduité est bonne' : 
                   stats.warningLevel === 'warning' ? 'Attention : Vous approchez de la limite d\'absences' :
                   'Alerte : Vous avez dépassé la limite d\'absences'}
                </h3>
                <p className="text-sm mt-1">
                  {stats.warningLevel === 'normal' ? 'Continuez ainsi ! Vos absences sont sous contrôle.' : 
                   stats.warningLevel === 'warning' ? 'Vous devriez faire attention aux absences supplémentaires.' :
                   'Veuillez contacter l\'administration immédiatement concernant vos absences.'}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Carte d'informations utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
            <CardDescription>Détails de votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{userData?.nom}&nbsp;{userData?.prenom}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Matricule</p>
                  <div className="mt-1 flex items-center">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{userData?.matricule}</p>
                    <Badge variant="primary" className="ml-2">Actif</Badge>
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