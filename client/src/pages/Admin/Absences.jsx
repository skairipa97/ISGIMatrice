import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

export default function AdminAbsences({ user, onLogout }) {
  const [filters, setFilters] = useState({
    date: '',
    groupe: '',
    filiere: '',
    statut: '',
    search: '',
    formateur: '' // Nouveau champ pour la recherche par formateur
  });

  const [absences, setAbsences] = useState([
    {
      id: 1,
      student_id: 101,
      student_name: "Jean Dupont",
      date: "2023-05-15",
      groupe: "Groupe A",
      filiere: "Informatique",
      status: "unjustified",
      base_note: 15.5,
      current_note: 15.0,
      formateur: "Pierre Martin"
    },
    {
      id: 2,
      student_id: 102,
      student_name: "Marie Martin",
      date: "2023-05-16",
      groupe: "Groupe B",
      filiere: "Design",
      status: "justified",
      base_note: 18.0,
      current_note: 18.0,
      formateur: "Sophie Dupont"
    },
    {
      id: 3,
      student_id: 103,
      student_name: "Pierre Durand",
      date: "2023-05-17",
      groupe: "Groupe A",
      filiere: "Informatique",
      status: "pending",
      base_note: 12.0,
      current_note: 12.0,
      formateur: "Pierre Martin"
    }
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Logique de filtrage sera appliquée automatiquement via le rendering
    console.log("Recherche lancée avec les critères:", filters);
  };

  // Filtrer les absences selon les critères
  const filteredAbsences = absences.filter(absence => {
    return (
      absence.student_name.toLowerCase().includes(filters.search.toLowerCase()) &&
      absence.formateur.toLowerCase().includes(filters.formateur.toLowerCase()) &&
      (filters.date === '' || absence.date === filters.date) &&
      (filters.groupe === '' || absence.groupe.includes(filters.groupe)) &&
      (filters.filiere === '' || absence.filiere.includes(filters.filiere)) &&
      (filters.statut === '' || absence.status === filters.statut)
    );
  });

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Gestion des Absences
              </h1>
              <p className="mt-2 text-indigo-100">
                Consultez et gérez les absences des stagiaires
              </p>
            </div>
          </div>
        </div>

        {/* Filters Card avec nouveau champ formateur */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres de recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Input
                type="text"
                name="search"
                placeholder="Nom stagiaire"
                value={filters.search}
                onChange={handleFilterChange}
              />
              <Input
                type="text"
                name="formateur"
                placeholder="Nom formateur"
                value={filters.formateur}
                onChange={handleFilterChange}
              />
              <Input 
                type="date" 
                name="date" 
                value={filters.date} 
                onChange={handleFilterChange} 
              />
              <Input
                type="text"
                name="groupe"
                placeholder="Groupe"
                value={filters.groupe}
                onChange={handleFilterChange}
              />
              <Input
                type="text"
                name="filiere"
                placeholder="Filière"
                value={filters.filiere}
                onChange={handleFilterChange}
              />
              <div className="flex gap-2">
                <Select
                  value={filters.statut}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, statut: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous statuts</SelectItem>
                    <SelectItem value="justified">Justifié</SelectItem>
                    <SelectItem value="unjustified">Non justifié</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch}>Rechercher</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau avec colonnes réorganisées */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des absences</CardTitle>
            <CardDescription>
              {filteredAbsences.length} absences trouvées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom stagiaire</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Groupe</TableHead>
                    <TableHead>Filière</TableHead>
                    <TableHead>Formateur</TableHead> {/* Déplacé avant Statut */}
                    <TableHead>Statut</TableHead>
                    <TableHead>Note/20</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.map(absence => (
                    <TableRow key={absence.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <span className="text-indigo-600 hover:underline dark:text-indigo-400">
                          {absence.student_name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(absence.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{absence.groupe}</TableCell>
                      <TableCell>{absence.filiere}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {absence.formateur}
                        </span>
                      </TableCell>
                      <TableCell>
                        {absence.status === 'justified' ? (
                          <Badge variant="success">Justifiée</Badge>
                        ) : absence.status === 'unjustified' ? (
                          <Badge variant="destructive">Non justifiée</Badge>
                        ) : (
                          <Badge variant="warning">En attente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{absence.current_note.toFixed(1)}</span>
                          {absence.status === 'unjustified' && (
                            <span className="text-red-500 ml-1">(-0.5)</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}