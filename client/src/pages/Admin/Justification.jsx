import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Composants Avatar
const Avatar = ({ children, className = "" }) => (
  <div className={`relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className = "" }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`aspect-square h-full w-full ${className}`}
  />
);

const AvatarFallback = ({ children, className = "" }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 ${className}`}>
    {children}
  </div>
);

// Composants Dialog
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 mx-4 shadow-xl relative">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h3 className="text-lg font-semibold dark:text-white">{children}</h3>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
);

const DialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-2 mt-4">{children}</div>
);

export default function AdminJustifications({ user, onLogout }) {
  const [justifications, setJustifications] = useState([]);
  const [selectedJustification, setSelectedJustification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProof, setShowProof] = useState(false);

  // Récupérer les justifications en attente
  useEffect(() => {
    const fetchPendingJustifications = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:8000/api/justifications/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Réponse invalide (${response.status}): ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur ${response.status}`);
        }
    
        const data = await response.json();
        setJustifications(data);
      } catch (err) {
        console.error('Erreur complète:', err);
        setError(err.message.includes('500') 
          ? 'Erreur serveur - Veuillez réessayer plus tard'
          : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingJustifications();
  }, []);

  const handleViewDetails = (justification) => {
    setSelectedJustification(justification);
    setIsDialogOpen(true);
    setShowProof(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/justifications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Échec de la mise à jour');
      }
  
      // Update local state by removing the processed justification
      setJustifications(prev => prev.filter(j => j.id !== id));
      setIsDialogOpen(false);
      setSelectedJustification(null);
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

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
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="space-y-4">
        {/* En-tête */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold hover:text-red-900 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-white">
              Demandes de justification d'absence
            </h1>
            <p className="mt-2 text-indigo-100">
              {justifications.length} demandes en attente
            </p>
          </div>
        </div>

        {/* Liste des justifications */}
        <div className="space-y-4">
          {justifications.filter(j => !j.validation).map((justification) => {
            const student = justification.student || justification.stagiaire || {};
            const avatarUrl = student.avatar 
              ? student.avatar.startsWith('http')
                ? student.avatar 
                : `http://localhost:8000/storage/${student.avatar}`
              : null;
            return (
              <Card key={justification.id} className="w-full hover:shadow-md transition-shadow dark:bg-gray-800">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={student.name || 'Student'} />
                      ) : (
                        <AvatarFallback>
                          {student.name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold dark:text-white">{student.name || 'Unknown Student'}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {student.groupe || 'No group'} • {new Date(justification.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => handleViewDetails(justification)}
                  >
                    Voir détail
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Modal de détails */}
        {selectedJustification && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Détails de la justification</DialogTitle>
                <DialogDescription>
                  Demande de {selectedJustification.student?.name || 'Unknown Student'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    
                      <AvatarFallback>
                        {selectedJustification.student?.name?.charAt(0) || 'S'}
                      </AvatarFallback>
                  
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{selectedJustification.student?.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedJustification.student?.groupe}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                    <p className="dark:text-white">{new Date(selectedJustification.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Durée</p>
                    <p className="dark:text-white">{selectedJustification.duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Raison</p>
                  <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded dark:text-gray-200">
                    {selectedJustification.details}
                  </p>
                </div>

                {selectedJustification.proof && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preuve</p>
                    <Button
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                      onClick={() => setShowProof(!showProof)}
                    >
                      {showProof ? 'Masquer preuve' : 'Voir preuve'}
                    </Button>
                    {showProof && (
                      <div className="mt-4 relative">
                        <img 
                          src={selectedJustification.proof} 
                          alt="Preuve de justification" 
                          className="w-full rounded-md object-contain border dark:border-gray-600 max-h-64"
                        />
                        <a 
                          href={selectedJustification.proof} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm hover:bg-black/70"
                        >
                          Ouvrir en plein écran
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange(selectedJustification.id, 'rejected')}
                >
                  Refuser
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange(selectedJustification.id, 'accepted')}
                >
                  Valider
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* État vide */}
        {justifications.length === 0 && !loading && (
          <Card className="dark:bg-gray-800">
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Aucune demande de justification en attente</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}