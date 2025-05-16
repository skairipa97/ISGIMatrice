import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card'
import { Check, X } from 'lucide-react'

function ListeDesAbsences() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  // État pour la date (défaut = aujourd'hui)
  const today = new Date()
  const dateFormatted = today.toISOString().split('T')[0]
  const [date, setDate] = useState(dateFormatted)
  
  // État pour le mode présentiel
  const [isPresentiel, setIsPresentiel] = useState(true)
  
  // État pour le lieu/salle
  const [lieu, setLieu] = useState('')
  
  // État pour la liste des stagiaires
  const [stagiaires, setStagiaires] = useState([])
  
  // État pour indiquer le chargement
  const [loading, setLoading] = useState(true)
  
  // État pour les messages d'erreur
  const [error, setError] = useState('')
  
  // État pour le statut de sauvegarde
  const [saveStatus, setSaveStatus] = useState('')
  
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // 1. Fetch group details if groupId exists
      if (groupId) {
        const groupResponse = await axios.get(
          `http://votre-domaine-laravel/api/groups/${groupId}`, 
          { headers }
        );
        setGroup(groupResponse.data);
      }

      // 2. Fetch students for the group (or all students if no group specified)
      const stagiairesResponse = await axios.get(
        groupId 
          ? `http://votre-domaine-laravel/api/groups/${groupId}/stagiaires`
          : 'http://votre-domaine-laravel/api/stagiaires',
        { headers }
      );

      // Add default absence status to each stagiaire
      const stagiairesWithAbsences = stagiairesResponse.data.map(stagiaire => ({
        ...stagiaire,
        absences: { s1: false, s2: false, s3: false, s4: false }
      }));

      setStagiaires(stagiairesWithAbsences);

    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Handle different error cases
      if (err.response?.status === 401) {
        setError('Session expirée - Veuillez vous reconnecter');
        // Optionally redirect to login
      } else if (err.response?.status === 404) {
        setError('Groupe non trouvé');
      } else {
        setError('Erreur lors du chargement des données');
      }
      
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [groupId]);
  
  // Gestion du changement de mode présentiel/distanciel
  const handlePresentielChange = (e) => {
    const isChecked = e.target.checked
    setIsPresentiel(isChecked)
    
    // Réinitialiser le lieu selon le mode
    if(!isChecked) {
      setLieu('Teams')
    } else {
      setLieu('')
    }
  }
  
  // Gestion du marquage des absences
  const handleAbsenceChange = (stagiaireId, session) => {
    setStagiaires(stagiaires.map(stagiaire => {
      if (stagiaire.id === stagiaireId) {
        return {
          ...stagiaire,
          absences: {
            ...stagiaire.absences,
            [session]: !stagiaire.absences[session]
          }
        }
      }
      return stagiaire
    }))
  }
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation du lieu si en présentiel
    if (isPresentiel && !lieu.trim()) {
      setError('Veuillez saisir le numéro ou le nom de la salle')
      return
    }
    
    try {
      setSaveStatus('saving')
      
      // Construction des données à envoyer
      const absenceData = {
        date,
        mode: isPresentiel ? 'présentiel' : 'distanciel',
        lieu,
        absences: stagiaires.map(stagiaire => ({
          matricule: stagiaire.matricule,
          nom: `${stagiaire.nom} ${stagiaire.prenom}`,
          s1: stagiaire.absences.s1,
          s2: stagiaire.absences.s2,
          s3: stagiaire.absences.s3,
          s4: stagiaire.absences.s4
        }))
      }
      
      // Simulation d'un appel API pour sauvegarder
      console.log('Données à envoyer:', absenceData)
      
      // Ici vous feriez normalement un appel API pour enregistrer les données
      /*
      await axios.post('http://localhost:8000/api/absences', absenceData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      */
      
      // Simulation d'un délai de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveStatus('success')
      setError('')
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setSaveStatus('')
      }, 3000)
      
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err)
      setError('Erreur lors de l\'enregistrement des absences')
      setSaveStatus('error')
    }
  }
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Liste des Absences</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}
        
        {saveStatus === 'success' && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            Absences enregistrées avec succès!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations de la séance</CardTitle>
              <CardDescription>Détails sur la séance du cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Date de la séance */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de la séance
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                {/* Mode présentiel/distanciel */}
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="presentiel"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={isPresentiel}
                      onChange={handlePresentielChange}
                    />
                    <label htmlFor="presentiel" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mode présentiel
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isPresentiel ? 'La séance se déroule en présentiel' : 'La séance se déroule à distance'}
                  </p>
                </div>
                
                {/* Lieu de la séance */}
                <div>
                  <label htmlFor="lieu" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isPresentiel ? 'Salle' : 'Plateforme'}
                  </label>
                  {isPresentiel ? (
                    <input
                      type="text"
                      id="lieu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      value={lieu}
                      onChange={(e) => setLieu(e.target.value)}
                      placeholder="Numéro ou nom de la salle"
                    />
                  ) : (
                    <input
                      type="text"
                      id="lieu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      value={lieu}
                      readOnly
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gestion des absences</CardTitle>
              <CardDescription>Marquez les absences pour chaque session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Matricule
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nom Complet
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S1
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S2
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S3
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S4
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {stagiaires.map((stagiaire) => (
                      <tr key={stagiaire.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {stagiaire.matricule}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {stagiaire.nom} {stagiaire.prenom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              stagiaire.absences.s1 
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's1')}
                          >
                            {stagiaire.absences.s1 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              stagiaire.absences.s2 
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's2')}
                          >
                            {stagiaire.absences.s2 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              stagiaire.absences.s3 
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's3')}
                          >
                            {stagiaire.absences.s3 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              stagiaire.absences.s4 
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's4')}
                          >
                            {stagiaire.absences.s4 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  // Réinitialiser toutes les absences
                  setStagiaires(stagiaires.map(stagiaire => ({
                    ...stagiaire,
                    absences: { s1: false, s2: false, s3: false, s4: false }
                  })))
                }}
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  saveStatus === 'saving' 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                }`}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : 'Enregistrer'}
              </button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default ListeDesAbsences