import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function EtudiantGroupsPage({ user, onLogout }) {
  const [userData, setUserData] = useState(user)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [groups, setGroups] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate();

  const getColorByModule = (libelle) => {
  const label = (libelle || '').toLowerCase();

  if (label.includes('fs')|| label.includes('dd')) return 'bg-blue-500';
  if (label.includes('infra')) return 'bg-green-500';
  if (label.includes('market') || label.includes('mkt')) return 'bg-purple-500';

  return 'bg-gray-500';
};
 console.log(userData)


  const getBgColorByModule = (libelle) => {
  const label = (libelle || '').toLowerCase();
  
  if (label.includes('fs') || label.includes('dd')) {return 'bg-blue-100 dark:bg-blue-900/30';}  
  if (label.includes('id')) return 'bg-green-100 dark:bg-green-900/30';
  if (label.includes('Gestion') || label.includes('mkt')) return 'bg-purple-100 dark:bg-purple-900/30';

  return 'bg-gray-100 dark:bg-gray-800';
};


  const getTextColorByModule = (libelle) => {
  const label = (libelle || '').toLowerCase();

  if (label.includes('fs') || label.includes('dd')) return 'text-blue-800 dark:text-blue-300';
  if (label.includes('id')) return 'text-green-800 dark:text-green-300';
  if (label.includes('Gestion') || label.includes('mkt')) return 'text-purple-800 dark:text-purple-300';

  return 'text-gray-800 dark:text-gray-300';
};


  const handleViewDetails = (groupId) => {
    navigate(`/groupes/${groupId}/absences`);
  };

  useEffect(() => {
    const fetchAffectations = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const userInfo = user || JSON.parse(localStorage.getItem('user'));
        const formateurId = userInfo?.id;

        if (!formateurId) {
          throw new Error('Utilisateur non identifié - Veuillez vous reconnecter');
        }

        const response = await axios.get(
          `http://localhost:8000/api/formateurs/${formateurId}/groups`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        const affectations = response.data.affectations || [];
        console.log(affectations);

        if (!Array.isArray(affectations) || affectations.length === 0) {
          setGroups([]);
          setError('Aucune affectation trouvée pour ce formateur.');
        } else {
          setGroups(affectations);
        }

      } catch (error) {
        console.error('Erreur:', error);
        const errorMessage = error.response
          ? `Erreur serveur: ${error.response.status} - ${error.response.statusText}`
          : error.message;
        setError(errorMessage);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAffectations();
  }, [user]);

  const filterGroups = () => {
    let filtered = [...groups];

    if (selectedType !== 'all') {
      filtered = filtered.filter(a => {
        const libelle = a.module?.libelle?.toLowerCase() || '';
        return selectedType === 'development'
          ? libelle.includes('dev')
          : selectedType === 'infrastructure'
          ? libelle.includes('infra')
          : selectedType === 'marketing'
          ? libelle.includes('market')
          : true;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.groupe?.libelle?.toLowerCase().includes(query) ||
        a.module?.libelle?.toLowerCase().includes(query)
      );
    }

    return filtered;
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
      <DashboardLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="h-40 w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
  <DashboardLayout user={user} onLogout={onLogout}>
        <div className="container px-4 py-6 mx-auto">
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

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg">
            <p className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <section className="mb-8">
          {groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filterGroups().map((affectation) => {
                const group = affectation.groupe || {};
                const groupeLibelle = affectation.groupe.libelle;
                const module = affectation.module || {};
                const moduleId = module.id || '';
                const moduleLibelle = module.libelle || 'Module inconnu';

                return (
                  <Card key={affectation.affectation_id || `${group.id}-${module.id}`} className="overflow-hidden">
                    <div className={`h-2 ${getColorByModule(groupeLibelle)}`}></div>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTextColorByModule(groupeLibelle)} ${getBgColorByModule(groupeLibelle)}`}>
                          {moduleLibelle}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {group.libelle || 'Groupe inconnu'}
                      </h3>
                      <div className="mt-6 flex justify-between items-center">
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm font-medium"
                          onClick={() => handleViewDetails(group.id)}
                        >
                          View Details
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : !error ? (
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Groups Found</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">You are not currently enrolled in any groups.</p>
            </div>
          ) : null}
        </section>

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
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{userData?.nom || 'FATIHI'} {userData?.prenom || 'Aicha'}</p>
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
