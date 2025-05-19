import React, { useEffect, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../layouts/DashboardLayout';

function AbsencesJustification({ onLogout }) {
  const [absences, setAbsences] = useState([]);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [raison, setRaison] = useState('');
  const [preuve, setPreuve] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const matricule = localStorage.getItem('matricule') || '';

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const matricule = localStorage.getItem('matricule');
  
        if (!matricule) {
          throw new Error('Matricule non trouvé dans le localStorage');
        }
  
        const response = await fetch(`http://localhost:8000/api/absences?stagiaire=${matricule}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' // Important
          }
        });
  
        // Vérifiez d'abord le type de contenu
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Réponse non-JSON reçue:', text.substring(0, 100));
          throw new Error('Le serveur a retourné une réponse non valide');
        }
  
        const data = await response.json();
        setAbsences(data);
  
      } catch (err) {
        console.error('Erreur lors de la récupération:', err);
        setError(err.message.includes('<!doctype') 
          ? 'Erreur de connexion au serveur' 
          : err.message);
        
        // Redirection si le token est invalide
        if (err.message.includes('401')) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchAbsences();
  }, []);

  const handleJustifyClick = (absence) => {
    setSelectedAbsence(absence);
    setRaison('');
    setPreuve(null);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    setPreuve(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    if (!raison || !preuve) {
      setError('Raison et preuve sont requises.');
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      
      
      const formData = new FormData();
      formData.append('absence_id', selectedAbsence.id);
      formData.append('stagiaire_matricule', matricule);
      formData.append('raison', raison);
      formData.append('preuve', preuve);
  
      console.log('Envoi à:', `http://localhost:8000/api/justifications`); // Debug
  
      const response = await fetch(`http://localhost:8000/api/justifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas mettre 'Content-Type' pour FormData, le navigateur le fera automatiquement
        },
        body: formData
      });
  
      console.log('Status:', response.status); // Debug
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur serveur:', errorText);
        throw new Error(errorText || 'Erreur lors de la soumission');
      }
  
      const data = await response.json();
      console.log('Réponse:', data); // Debug
      
      
    setSelectedAbsence(null); // This will hide the modal
    setRaison('');
    setPreuve(null);
    setSuccess('Justification soumise avec succès!');
    

    // Refresh absences list
    const absResponse = await fetch(`http://localhost:8000/api/absences?stagiaire=${matricule}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const updatedAbsences = await absResponse.json();
    setAbsences(updatedAbsences);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err.message.includes('<!doctype') 
        ? 'Erreur de connexion au serveur' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Separate justified and unjustified absences
  const justifiedAbsences = absences.filter(abs => abs.is_justified);
  const unjustifiedAbsences = absences.filter(abs => !abs.is_justified);
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Unjustified absences */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <svg className="w-8 h-8 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Absences Non Justifiées
          </h2>
          <div className="grid gap-4">
            {unjustifiedAbsences.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune absence non justifiée à afficher</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Vous êtes à jour !</p>
              </div>
            ) : (
              unjustifiedAbsences.map(abs => (
                <div 
                  key={abs.id}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-lg font-semibold text-red-700 dark:text-red-400">{new Date(abs.date).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 text-red-600 dark:text-red-300">{abs.module_libelle}</div>
                      <div className="mt-1 text-sm text-red-600 dark:text-red-300">Session: {abs.session}</div>
                    </div>
                    <Button 
                      onClick={() => handleJustifyClick(abs)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Justifier
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Justification modal */}
        {selectedAbsence && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Justifier l'absence du {new Date(selectedAbsence.date).toLocaleDateString()}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Raison <span className="text-red-500">*</span></label>
                    <Input type="text" value={raison} onChange={e => setRaison(e.target.value)} required className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Preuve (fichier) <span className="text-red-500">*</span></label>
                    <input 
                      type="file" 
                      accept="*" 
                      onChange={handleFileChange} 
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2"
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <div className="flex space-x-2 justify-end mt-6">
                    <Button type="button" variant="secondary" onClick={() => setSelectedAbsence(null)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Envoi...' : 'Soumettre'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Justified absences */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <svg className="w-8 h-8 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Absences Justifiées
          </h2>
          <div className="grid gap-4">
            {justifiedAbsences.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune absence justifiée</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Les absences justifiées apparaîtront ici</p>
              </div>
            ) : (
              justifiedAbsences.map(abs => (
                <div 
                  key={abs.id}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fadeIn"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                            {new Date(abs.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-2 text-green-600 dark:text-green-300">
                          {abs.module_libelle}
                        </div>
                        <div className="mt-1 text-sm text-green-600 dark:text-green-300">
                          Session: {abs.session}
                        </div>
                        <div className="mt-2 text-sm text-green-600 dark:text-green-300">
                          Raison: {abs.justification?.raison}
                        </div>
                      </div>
                      {abs.justification?.preuve_path && (
                        <a
                          href={`/storage/${abs.justification.preuve_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                          </svg>
                          Voir preuve
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AbsencesJustification;