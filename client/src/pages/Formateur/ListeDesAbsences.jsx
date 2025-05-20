import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card'
import { Check, X } from 'lucide-react'

function ListeDesAbsences({ user, onLogout }) {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [formateurId, setFormateurId] = useState(null);
  const today = new Date()
  const dateFormatted = today.toISOString().split('T')[0]
  const [date, setDate] = useState(dateFormatted)
  const [isPresentiel, setIsPresentiel] = useState(true)
  const [isMatinee, setIsMatinee] = useState(true) // New state for Matinée/Après-midi switch
  const [lieu, setLieu] = useState('')
  const [stagiaires, setStagiaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const errorRef = useRef(null); 

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [error]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
  
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
  
        // Fetch group
        const groupResponse = await axios.get(
          `http://localhost:8000/api/groupes/${groupId}`, 
          { headers }
        ).catch(err => {
          throw new Error(err.response?.data?.message || 'Erreur lors du chargement du groupe');
        });
  
        setGroup(groupResponse.data);
        
        // Here we would typically get the current module and formateur
        // This is placeholder data - you should fetch this from API
        setModuleId(groupResponse.data.current_module_id || 1);
        setFormateurId(localStorage.getItem('user_id') || 1);
  
        // Fetch stagiaires
        const stagiairesResponse = await axios.get(
          `http://localhost:8000/api/groupes/${groupId}/stagiaires`,
          { headers }
        ).catch(err => {
          throw new Error(err.response?.data?.message || 'Erreur lors du chargement des stagiaires');
        });
  
        // Make sure each stagiaire has an ID property
        const processedStagiaires = stagiairesResponse.data.map(s => ({
          ...s,
          id: s.id || s._id || s.stagiaire_id || s.matricule, // Ensure there's always an ID
          absence: { s1: false, s2: false, s3: false, s4: false } // Default to not absent
        }));
        
        setStagiaires(processedStagiaires);
        console.log('Processed stagiaires:', processedStagiaires);
  
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
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

  // Gestion du changement de mode matinée/après-midi
  const handleMatineeChange = (e) => {
    const isChecked = e.target.checked
    setIsMatinee(isChecked)
    
    // Réinitialiser les absences pour les séances qui ne sont plus disponibles
    setStagiaires(stagiaires.map(stagiaire => {
      return {
        ...stagiaire,
        absence: {
          ...stagiaire.absence,
          // Si matinée, réinitialiser s3 et s4; si après-midi, réinitialiser s1 et s2
          s1: isChecked ? stagiaire.absence.s1 : false,
          s2: isChecked ? stagiaire.absence.s2 : false,
          s3: isChecked ? false : stagiaire.absence.s3,
          s4: isChecked ? false : stagiaire.absence.s4
        }
      }
    }))
  }
  
  // Gestion du marquage des absences
  const handleAbsenceChange = (stagiaireId, session) => {
    // Vérifier si la session est active selon le mode matinée/après-midi
    if (
      (isMatinee && (session === 's3' || session === 's4')) ||
      (!isMatinee && (session === 's1' || session === 's2'))
    ) {
      return; // Ne rien faire si la session est désactivée
    }
    
    setStagiaires(stagiaires.map(stagiaire => {
      if (stagiaire.id === stagiaireId) {
        return {
          ...stagiaire,
          absence: {
            ...stagiaire.absence,
            [session]: !stagiaire.absence[session]
          }
        }
      }
      return stagiaire
    }))
  }
  
  // Calculer la durée des séances (2,5H par séance) basée sur les séances avec des absences
  const calculateTotalSessionsWithAttendance = () => {
    const seances = isMatinee ? ['s1', 's2'] : ['s3', 's4']; // Filtrer selon le mode
    const sessionsWithAttendance = new Set();
    
    // Pour chaque séance disponible selon le mode, vérifier s'il y a au moins un stagiaire marqué absent
    for (const seance of seances) {
      if (stagiaires.some(s => s.absence[seance])) {
        sessionsWithAttendance.add(seance);
      }
    }
    
    return sessionsWithAttendance.size;
  }
  
  // Calculer la durée totale basée sur le nombre de séances avec des absences
  const calculateDuration = () => {
    const sessionCount = calculateTotalSessionsWithAttendance();
    return sessionCount * 2.5; // Chaque séance dure 2.5 heures
  }
  
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation du lieu si en présentiel
  if (isPresentiel && !lieu.trim()) {
    setError('Veuillez saisir le numéro ou le nom de la salle');
    return;
  }
  
  try {
    setSaveStatus('saving');
    const token = localStorage.getItem('token');
    
    // Préparation des données
    const seanceData = {
      date,
      type: isPresentiel ? 'presentiel' : 'a distance',
      lieu,
      duree: calculateDuration(),
      groupe_id: parseInt(groupId),
      module_id: moduleId,
      formateur_id: formateurId,
      nombre_sessions: calculateTotalSessionsWithAttendance(),
      periode: isMatinee ? 'matinee' : 'apres-midi' // Ajouter la période à la séance
    };

    // Préparation des absences (uniquement les stagiaires absents)
    const absencesData = stagiaires.flatMap(stagiaire => 
      // Filtrer les séances selon le mode matinée/après-midi
      (isMatinee ? ['s1', 's2'] : ['s3', 's4'])
        .filter(session => stagiaire.absence[session])
        .map(session => ({
          stagiaire_matricule: stagiaire.matricule,
          session
        }))
    );

    // Envoi des données
    const response = await axios.post('http://localhost:8000/api/seances', {
      seance: seanceData,
      absences: absencesData
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Affichage du message de succès
    setSaveStatus('success');
    setError('');
    
    // Redirection après 2 secondes
    setTimeout(() => {
      window.location.href = '/groupes';
    }, 2000);
    
  } catch (err) {
    console.error('Erreur:', err.response?.data);
    
    // Gestion spécifique de l'erreur de séance dupliquée
    if (err.response?.status === 422 && err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
    
    setSaveStatus('error');
  }
};
  
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
  <DashboardLayout user={user} onLogout={onLogout}>
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Feuille de Présence - {group?.nom || 'Groupe'}
        </h1>
        
         {/* Error message with ref */}
         {error && (
          <div ref={errorRef} className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            {error}
            {error.includes('déjà programmé') && (
              <div className="mt-2 text-sm">
                Vous pouvez seulement marquer des absences pour d'autres sessions (S3, S4) si elles n'ont pas déjà été enregistrées.
              </div>
            )}
          </div>
        )}
        
        {saveStatus === 'success' && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            Enregistré avec succès! Redirection en cours...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations de la séance</CardTitle>
              <CardDescription>Détails sur la séance du cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      required={isPresentiel}
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
                
                {/* Switch Matinée/Après-midi */}
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="matinee"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={isMatinee}
                      onChange={handleMatineeChange}
                    />
                    <label htmlFor="matinee" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Matinée
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isMatinee ? 'Sessions S1 et S2 (matin)' : 'Sessions S3 et S4 (après-midi)'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gestion des absences</CardTitle>
              <CardDescription>
                Marquez les absences pour chaque session ({isMatinee ? 'S1-S2' : 'S3-S4'}, chacune de 2h30)
              </CardDescription>
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
                        S1 (2h30)
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S2 (2h30)
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S3 (2h30)
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        S4 (2h30)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {stagiaires.map((stagiaire) => (
                      <tr key={stagiaire.matricule} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
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
                              !isMatinee 
                                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                : stagiaire.absence.s1 
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's1')}
                            disabled={!isMatinee}
                          >
                            {stagiaire.absence.s1 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              !isMatinee 
                                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                : stagiaire.absence.s2 
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's2')}
                            disabled={!isMatinee}
                          >
                            {stagiaire.absence.s2 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              isMatinee 
                                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                : stagiaire.absence.s3 
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's3')}
                            disabled={isMatinee}
                          >
                            {stagiaire.absence.s3 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                              isMatinee 
                                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                : stagiaire.absence.s4 
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                            onClick={() => handleAbsenceChange(stagiaire.id, 's4')}
                            disabled={isMatinee}
                          >
                            {stagiaire.absence.s4 ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Résumé:</strong> {calculateTotalSessionsWithAttendance()} séances avec absences, durée totale: {calculateDuration()} heures
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 dark:bg-gray-800">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  // Réinitialiser les absences selon le mode matinée/après-midi
                  setStagiaires(stagiaires.map(stagiaire => ({
                    ...stagiaire,
                    absence: {
                      ...stagiaire.absence,
                      s1: isMatinee ? false : stagiaire.absence.s1,
                      s2: isMatinee ? false : stagiaire.absence.s2,
                      s3: isMatinee ? stagiaire.absence.s3 : false,
                      s4: isMatinee ? stagiaire.absence.s4 : false
                    }
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
                  <span className="flex items-center ">
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