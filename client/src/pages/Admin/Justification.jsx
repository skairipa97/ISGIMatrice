import { useState } from 'react';
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
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`}>
    {children}
  </div>
);

// Composants Dialog
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 mx-4">
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
  <h3 className="text-lg font-semibold">{children}</h3>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

const DialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-2 mt-4">{children}</div>
);

export default function AdminJustifications({ user, onLogout }) {
  const [justifications, setJustifications] = useState([
    {
      id: 1,
      student: {
        id: 101,
        name: "Jean Dupont",
        avatar: "/avatars/jean-dupont.jpg",
        groupe: "Groupe A"
      },
      date: "2023-05-15",
      duration: "1 journée",
      status: "pending",
      details: "J'étais malade avec certificat médical",
      proof: "/proofs/medical-certificate.jpg"
    },
    {
      id: 2,
      student: {
        id: 102,
        name: "Marie Martin",
        avatar: "/avatars/marie-martin.jpg",
        groupe: "Groupe B"
      },
      date: "2023-05-16",
      duration: "2 heures",
      status: "pending",
      details: "Problème de transport en commun",
      proof: "/proofs/bus-ticket.jpg"
    }
  ]);

  const [selectedJustification, setSelectedJustification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (justification) => {
    setSelectedJustification(justification);
    setIsDialogOpen(true);
  };

  const handleAccept = (id) => {
    setJustifications(justifications.map(j => 
      j.id === id ? {...j, status: "accepted"} : j
    ));
    setIsDialogOpen(false);
  };

  const handleReject = (id) => {
    setJustifications(justifications.map(j => 
      j.id === id ? {...j, status: "rejected"} : j
    ));
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="space-y-4">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-white">
              Demandes de justification d'absence
            </h1>
            <p className="mt-2 text-indigo-100">
              {justifications.filter(j => j.status === "pending").length} demandes en attente
            </p>
          </div>
        </div>

        {/* Liste des justifications */}
        <div className="space-y-4">
          {justifications.filter(j => j.status === "pending").map((justification) => (
            <Card key={justification.id} className="w-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {justification.student.avatar ? (
                      <AvatarImage src={justification.student.avatar} alt={justification.student.name} />
                    ) : (
                      <AvatarFallback>
                        {justification.student.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{justification.student.name}</h3>
                    <p className="text-sm text-gray-600">
                      {justification.student.groupe} • {new Date(justification.date).toLocaleDateString('fr-FR')}
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
          ))}
        </div>

        {/* Modal de détails */}
        {selectedJustification && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Détails de la justification</DialogTitle>
                <DialogDescription>
                  Demande de {selectedJustification.student.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {selectedJustification.student.avatar ? (
                      <AvatarImage src={selectedJustification.student.avatar} alt={selectedJustification.student.name} />
                    ) : (
                      <AvatarFallback>
                        {selectedJustification.student.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedJustification.student.name}</h3>
                    <p className="text-sm text-gray-600">{selectedJustification.student.groupe}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{new Date(selectedJustification.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Durée</p>
                    <p>{selectedJustification.duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Raison</p>
                  <p className="mt-1 p-2 bg-gray-50 rounded">{selectedJustification.details}</p>
                </div>

                {selectedJustification.proof && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preuve</p>
                    <img 
                      src={selectedJustification.proof} 
                      alt="Preuve de justification" 
                      className="mt-2 max-h-40 rounded-md object-cover border"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => handleReject(selectedJustification.id)}
                >
                  Refuser
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => handleAccept(selectedJustification.id)}
                >
                  Valider
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* État vide */}
        {justifications.filter(j => j.status === "pending").length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <p className="text-gray-500">Aucune demande de justification en attente</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}