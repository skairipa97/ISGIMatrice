import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    pendingJustifications: 0,
    longAbsences: 0,
    adminLevel: user?.isSuperAdmin ? 'super-admin' : 'admin' // Use prop data as fallback
  });
  const [criticalAbsenceStudents, setCriticalAbsenceStudents] = useState([]);
  const [absencesByGroupData, setAbsencesByGroupData] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          onLogout();
          return;
        }

        // Only fetch what we know exists from Justification.jsx
        const pendingResponse = await axios.get(
          'http://localhost:8000/api/justifications/pending', 
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        // For critical absences endpoint
        let criticalAbsences = [];
        try {
          const absencesResponse = await axios.get(
            'http://localhost:8000/api/absences/critical',
            {
              headers: { 'Authorization': `Bearer ${token}` },
              params: { threshold: 20 }
            }
          );
          criticalAbsences = absencesResponse.data || [];
        } catch (absencesError) {
          console.error('Critical absences fetch error:', absencesError);
          // Si erreur, on garde longAbsences à 0
          criticalAbsences = [];
        }
        setCriticalAbsenceStudents(criticalAbsences);
        setStats(prevStats => ({
          ...prevStats,
          longAbsences: criticalAbsences.length,
          adminLevel: user?.isSuperAdmin ? 'super-admin' : 'admin'
        }));

        // New API call for absences by group over time
        try {
          const absencesByGroupResponse = await axios.get(
            'http://localhost:8000/api/absences/by-group',
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          
          if (absencesByGroupResponse.data && Array.isArray(absencesByGroupResponse.data)) {
            setAbsencesByGroupData(absencesByGroupResponse.data);
          }
        } catch (groupAbsencesError) {
          console.error('Group absences data fetch error:', groupAbsencesError);
          // En cas d'erreur, on utilise des données vides
          setAbsencesByGroupData([]);
        }

        setStats({
          pendingJustifications: pendingResponse.data.length || 0,
          longAbsences: criticalAbsences.length || 0,
          adminLevel: user?.isSuperAdmin ? 'super-admin' : 'admin'
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        
        // More specific error message
        if (err.response?.status === 404) {
          setError('Some dashboard features are currently unavailable');
        } else if (err.response?.status === 401) {
          setError('Session expired - Please login again');
          onLogout();
        } else {
          setError('Failed to load dashboard data');
        }
        
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [onLogout, user]);

  // Function to transform the data for the chart if needed
  const processChartData = () => {
    // If we have real data, return it
    if (absencesByGroupData.length > 0) {
      return absencesByGroupData;
    }
    
    // Otherwise, return sample data for demonstration purposes
    return [
      { date: '2025-05-01', 'Groupe A': 15, 'Groupe B': 12, 'Groupe C': 8 },
      { date: '2025-05-02', 'Groupe A': 18, 'Groupe B': 10, 'Groupe C': 7 },
      { date: '2025-05-03', 'Groupe A': 12, 'Groupe B': 15, 'Groupe C': 10 },
      { date: '2025-05-04', 'Groupe A': 10, 'Groupe B': 8, 'Groupe C': 12 },
      { date: '2025-05-05', 'Groupe A': 8, 'Groupe B': 9, 'Groupe C': 15 },
      { date: '2025-05-06', 'Groupe A': 7, 'Groupe B': 11, 'Groupe C': 13 },
      { date: '2025-05-07', 'Groupe A': 9, 'Groupe B': 13, 'Groupe C': 11 },
    ];
  };

  // Function to dynamically generate lines for each group
  const renderLines = () => {
    const chartData = processChartData();
    if (chartData.length === 0) return null;
    
    // Get all group names from the first data item
    const groupNames = Object.keys(chartData[0]).filter(key => key !== 'date');
    
    // Array of colors for different lines
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];
    
    return groupNames.map((group, index) => (
      <Line 
        key={group}
        type="monotone"
        dataKey={group}
        stroke={colors[index % colors.length]}
        strokeWidth={2}
        activeDot={{ r: 6 }}
      />
    ));
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      onLogout();
    }
  };

  const getAdminLevelColor = () => {
    return stats.adminLevel === 'super-admin' 
      ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
      : 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <DashboardLayout user={userData} onLogout={handleLogout}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-100 max-w-md" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
            <button 
              onClick={() => setError('')}
              className="absolute top-0 right-0 px-2 py-1"
            >
              ×
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={userData} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Tableau de Bord de Surveillance général
              </h1>
              <p className="mt-2 text-indigo-100">
                Bienvenue!
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
              <Avatar 
                name={userData?.name || 'Surveillance'}
                size="xl" 
                status="online"
              />
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Alertes et Statistiques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Justificatifs en attente - This one works */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Justificatifs en attente</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.pendingJustifications}
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      À traiter
                    </span>
                  </p>
                </div>
                <span className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
              </div>
            </div>
            
            {/* +20h d'absences - Now working */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Absences critiques</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.longAbsences}
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-500" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Critique
                    </span>
                  </p>
                </div>
                <span className="p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Nouveau graphique d'absences par groupe */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Absences par Groupe</CardTitle>
              <CardDescription>Suivi des absences par groupe au fil du temps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }}
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      label={{ 
                        value: 'Nombre d\'absences', angle: -90, position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#333' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    {renderLines()}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Critical Absences List - New section */}
        {criticalAbsenceStudents.length > 0 && (
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Absences Critiques</CardTitle>
                <CardDescription>Étudiants avec plus de 20 heures d'absence non justifiées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Étudiant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Heures
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {criticalAbsenceStudents.map((item) => (
                        <tr key={item.stagiaire.matricule} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {item.stagiaire.photo ? (
                                  <img className="h-10 w-10 rounded-full" src={item.stagiaire.photo.startsWith('http') ? item.stagiaire.photo : `http://localhost:8000/storage/${item.stagiaire.photo}`} alt="" />
                                ) : (
                                  <Avatar name={item.stagiaire.nom + ' ' + item.stagiaire.prenom} size="md" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.stagiaire.nom} {item.stagiaire.prenom}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.stagiaire.matricule}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="danger">
                              {item.totalHours} heures
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
        
        {/* Admin level */}
        <section className="mb-8">
          <div className={`rounded-lg p-4 ${getAdminLevelColor()}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {stats.adminLevel === 'super-admin' ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">
                  {stats.adminLevel === 'super-admin' ? 'Privilèges Super Admin' : 'Privilèges Admin'}
                </h3>
                <p className="text-sm mt-1">
                  {stats.adminLevel === 'super-admin' 
                    ? 'Vous avez un accès complet au système, y compris la gestion des utilisateurs et des paramètres système.' 
                    : 'Vous avez accès à la gestion des utilisateurs et à l\'administration du contenu.'}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Admin Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Administrateur</CardTitle>
            <CardDescription>Détails de votre compte et privilèges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom Admin</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{userData?.name || 'Admin'}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Niveau d'Accès</p>
                  <div className="mt-1 flex items-center">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {stats.adminLevel === 'super-admin' ? 'Super Admin' : 'Admin'}
                    </p>
                    <Badge 
                      variant={stats.adminLevel === 'super-admin' ? 'premium' : 'primary'} 
                      className="ml-2"
                    >
                      {stats.adminLevel === 'super-admin' ? 'Premium' : 'Standard'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{userData?.email || 'admin@example.com'}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:w-1/2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière Connexion</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;