import React, { useEffect, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../layouts/DashboardLayout';

function AbsencesJustification({ user, onLogout }) {
  const [absences, setAbsences] = useState([]);
  const [justifications, setJustifications] = useState([]);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [raison, setRaison] = useState('');
  const [preuve, setPreuve] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch absences and justifications for the connected stagiaire
    async function fetchData() {
      // Replace with your API endpoints
      const abs = await fetch(`/api/absences?stagiaire=${user.matricule}`).then(r => r.json());
      const just = await fetch(`/api/justifications?stagiaire=${user.matricule}`).then(r => r.json());
      setAbsences(abs);
      setJustifications(just);
    }
    if (user?.matricule) fetchData();
  }, [user]);

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
    const formData = new FormData();
    formData.append('absence_id', selectedAbsence.id);
    formData.append('raison', raison);
    formData.append('preuve', preuve);
    try {
      // Replace with your API endpoint
      const res = await fetch('/api/justifications', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur lors de la soumission.');
      setSuccess('Justification soumise avec succès.');
      setSelectedAbsence(null);
      setRaison('');
      setPreuve(null);
      // Refresh justifications
      const just = await fetch(`/api/justifications?stagiaire=${user.matricule}`).then(r => r.json());
      setJustifications(just);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Absences non justifiées */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <svg className="w-8 h-8 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Absences Non Justifiées
          </h2>
          <div className="grid gap-4">
            {absences.filter(abs => !justifications.some(j => j.absence_id === abs.id)).length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune absence non justifiée à afficher</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Vous êtes à jour !</p>
              </div>
            ) : (
              absences.filter(abs => !justifications.some(j => j.absence_id === abs.id)).map(abs => (
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
                        <span className="text-lg font-semibold text-red-700 dark:text-red-400">{abs.date}</span>
                      </div>
                      <div className="mt-2 text-red-600 dark:text-red-300">{abs.module_libelle}</div>
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

        {/* Modal de justification */}
        {selectedAbsence && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Justifier l'absence du {selectedAbsence.date}
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

        {/* Absences justifiées */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <svg className="w-8 h-8 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Absences Justifiées
          </h2>
          <div className="grid gap-4">
            {justifications.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Aucune absence justifiée</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Les absences justifiées apparaîtront ici</p>
              </div>
            ) : (
              justifications.map(j => (
                <div 
                  key={j.id}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fadeIn"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-lg font-semibold text-green-700 dark:text-green-400">{j.absence_date}</span>
                        </div>
                        <div className="mt-2 text-green-600 dark:text-green-300">{j.module_libelle}</div>
                        <div className="mt-2 text-sm text-green-600 dark:text-green-300">Raison: {j.raison}</div>
                      </div>
                      {j.preuve && (
                        <a
                          href={j.preuve}
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