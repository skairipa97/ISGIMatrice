import { useState, useEffect } from 'react';
import axios from 'axios';
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
    search: '',
    date: '',
    groupe: '',
    filiere: '',
    statut: '',
    formateur: ''
  });
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });
  const tableStyle = {
    backgroundColor: '#f3f4f6', // Gris clair
    width: '100%',
    borderCollapse: 'collapse',
  };

  // Fetch absences when component mounts or filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/admin/absences', {
          params: {
            ...filters,
            page: pagination.current_page
          },
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setAbsences(response.data.absences);
        setPagination({
          current_page: response.data.pagination.current_page,
          last_page: response.data.pagination.last_page,
          per_page: response.data.pagination.per_page,
          total: response.data.pagination.total
        });
      } catch (err) {
        console.error('Error fetching absences:', err);
        setError(err.response?.data?.message || 'Failed to fetch absences');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, pagination.current_page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleStatusChange = (value) => {
    setFilters(prev => ({ 
      ...prev, 
      statut: value 
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      current_page: newPage
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      date: '',
      groupe: '',
      filiere: '',
      statut: '',
      formateur: ''
    });
  };
 
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

        {/* Filters Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filtres de recherche</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetFilters}
              >
                Réinitialiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Input
                type="text"
                name="search"
                placeholder="Recherche (nom, groupe, filière, formateur, date...)"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
          <Card className="bg-gray-100 dark:bg-gray-800"> {/* Add bg color to Card */}
            <CardHeader className="bg-gray-100 dark:bg-gray-800">
            <CardTitle>Liste des absences</CardTitle>
            <CardDescription>
              {loading ? 'Chargement...' : `${pagination.total} absences trouvées`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : absences.length === 0 ? (
              <div className="text-center py-8 bg-gray-100 dark:bg-gray-800">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune absence trouvée</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {Object.values(filters).some(Boolean) 
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucune absence enregistrée pour le moment"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto bg-gray-100 dark:bg-gray-800">
                  <Table className="bg-gray-100 dark:bg-gray-800" style={tableStyle}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom stagiaire</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Groupe</TableHead>
                        <TableHead>Filière</TableHead>
                        <TableHead>Formateur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Note/20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {absences.map(absence => (
                        <TableRow key={absence.id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
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
                              <span>{Number(absence.current_note).toFixed(1)}</span>
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
                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                  <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Page {pagination.current_page} sur {pagination.last_page}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={pagination.current_page === 1}
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}