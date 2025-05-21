<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\Justification;
use App\Models\Stagiaire;
use App\Models\Affectation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AbsenceController extends Controller
{
    public function index(Request $request)
    {
        // Get matricule from request (support both parameter names)
        $matricule = $request->stagiaire ?? $request->stagiaire_matricule;
        
        if (!$matricule) {
            return response()->json(['error' => 'Matricule parameter required'], 400);
        }

        // Get all absences with their related seance and module data
        $absences = Absence::with(['seance.module', 'justification'])
            ->where('stagiaire_matricule', $matricule)
            ->get()
            ->map(function ($absence) {
                // Check if seance exists
                if (!$absence->seance) {
                    return [
                        'id' => $absence->id,
                        'seance_id' => $absence->seance_id,
                        'error' => 'Seance data missing',
                        'is_justified' => false
                    ];
                }

                return [
                    'id' => $absence->id,
                    'date' => $absence->seance->date,
                    'session' => $absence->seance->session,
                    'duree' => $absence->seance->duree,
                    'module_libelle' => $absence->seance->module->libelle ?? 'Module inconnu',
                    'seance_id' => $absence->seance_id,
                    'stagiaire_matricule' => $absence->stagiaire_matricule,
                    'is_justified' => $absence->justification ? true : false,
                    'justification' => $absence->justification
                ];
            });

        return response()->json($absences);
    }

    /**
     * Retourne les absences critiques (non justifiées avec un total d'heures > seuil)
     */
    public function critical(Request $request)
    {
        // Seuil par défaut (20h) pouvant être modifié via paramètre
        $threshold = $request->input('threshold', 20);

        // Récupérer les stagiaires avec absences non justifiées et total heures > seuil
        $criticalStagiaires = Stagiaire::select(['stagiaires.matricule'])
            ->join('absences', 'absences.stagiaire_matricule', '=', 'stagiaires.matricule')
            ->join('seances', 'seances.id', '=', 'absences.seance_id')
            ->leftJoin('justifications', function($join) {
                $join->on('justifications.absence_id', '=', 'absences.id')
                     ->where('justifications.validation', '=', true);
            })
            ->whereNull('justifications.id') // Absences non justifiées
            ->groupBy('stagiaires.matricule')
            ->havingRaw('SUM(seances.duree) > ?', [$threshold])
            ->pluck('stagiaires.matricule');

        $result = [];
        foreach ($criticalStagiaires as $matricule) {
            $stagiaire = Stagiaire::where('matricule', $matricule)->first();
            $absences = Absence::with('seance')
                ->where('stagiaire_matricule', $matricule)
                ->whereDoesntHave('justification', function($q) {
                    $q->where('validation', false);
                })
                ->get();
            $totalHours = $absences->sum(function($a) { return $a->seance ? $a->seance->duree : 0; });
            $seances = $absences->map(function($a) { return $a->seance; })->filter()->values();

            // Send email if stagiaire has an email address
            if ($stagiaire && !empty($stagiaire->email)) {
                try {
                    Mail::send('emails.comite-discipline', [
                        'stagiaire' => $stagiaire,
                        'totalHours' => $totalHours
                    ], function ($message) use ($stagiaire) {
                        $message->to($stagiaire->email)
                                ->subject('Convocation au Comité de Discipline');
                    });
                } catch (\Exception $e) {
                    \Log::error('Erreur lors de l\'envoi de l\'email de convocation au comité de discipline', [
                        'stagiaire' => $stagiaire->matricule,
                        'email' => $stagiaire->email,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $result[] = [
                'stagiaire' => $stagiaire,
                'totalHours' => $totalHours,
                'seances' => $seances
            ];
        }
        return response()->json($result);
    }


    public function absencesForFormateur($formateurId)
{
    \Log::info("[AbsenceController] Starting absencesForFormateur", ['formateurId' => $formateurId]);

    try {
        \Log::debug("[AbsenceController] Fetching group IDs for formateur");

        $groupIds = Affectation::where('formateur_id', $formateurId)
            ->pluck('group_id');

        \Log::debug("[AbsenceController] Retrieved group IDs", ['count' => $groupIds->count()]);

        if ($groupIds->isEmpty()) {
            \Log::warning("[AbsenceController] No groups found for formateur");
            return response()->json([
                'total_etudiants' => 0,
                'absences' => [],
            ]);
        }

        \Log::debug("[AbsenceController] Fetching stagiaires for groups");

        $totalEtudiants = Stagiaire::whereIn('groupe_id', $groupIds)->count();

        $absences = Stagiaire::whereIn('groupe_id', $groupIds)
            ->with(['groupe.filiere', 'absences' => function($query) {
                $query->whereDoesntHave('justification')
                      ->latest()
                      ->with(['seance.module']);
            }])
            ->get()
            ->map(function ($stagiaire) use ($totalEtudiants) {
                if ($stagiaire->absences->isEmpty()) {
                    return null;
                }

                $latestAbsence = $stagiaire->absences->first();

                return [
                    'id' => $latestAbsence->id,
                    'date' => $latestAbsence->seance->date ?? null,
                    'session' => $latestAbsence->seance->session ?? null,
                    'duree' => $latestAbsence->seance->duree ?? null,
                    'cours' => $latestAbsence->seance->module->libelle ?? 'Module inconnu',
                    'seance_id' => $latestAbsence->seance_id,
                    'stagiaire_matricule' => $latestAbsence->stagiaire_matricule,
                    'justifiee' => false,
                    'etudiant' => [
                        'nom' => $stagiaire->nom,
                        'prenom' => $stagiaire->prenom,
                        'matricule' => $stagiaire->matricule,
                        'avatar' => $stagiaire->photo ?? null,
                    ],
                    'groupe' => $stagiaire->groupe->libelle ?? 'Groupe inconnu',
                    'filiere' => $stagiaire->groupe->filiere->libelle ?? 'Filière inconnue',
                ];
            })
            ->filter()
            ->values()
            ->toArray();

        \Log::info("[AbsenceController] Successfully processed unexcused absences", [
            'formateurId' => $formateurId,
            'totalAbsences' => count($absences)
        ]);

        return response()->json([
            'total_etudiants' => $totalEtudiants,
            'absences' => $absences,
        ]);

    } catch (\Exception $e) {
        \Log::error("[AbsenceController] Critical error", [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}
public function adminAbsences(Request $request)
{
    // Base query with all necessary relationships
    $query = Absence::with([
        'stagiaire:nom,prenom,matricule,groupe_id,note_de_discipline',
        'seance:id,date,formateur_id',
        'seance.formateur:id,nom,prenom',
        'stagiaire.groupe:id,libelle,filiere_id',
        'stagiaire.groupe.filiere:id,libelle',
        'justification:id,absence_id,validation'
    ]);

    // Search functionality
    if ($request->filled('search')) {
        $search = $request->input('search');
        $query->where(function ($q) use ($search) {
            $q->whereHas('stagiaire', function ($q2) use ($search) {
                $q2->where('nom', 'like', "%$search%")
                   ->orWhere('prenom', 'like', "%$search%")
                   ->orWhere('matricule', 'like', "%$search%");
            })
            ->orWhereHas('stagiaire.groupe', function ($q2) use ($search) {
                $q2->where('libelle', 'like', "%$search%");
            })
            ->orWhereHas('stagiaire.groupe.filiere', function ($q2) use ($search) {
                $q2->where('libelle', 'like', "%$search%");
            })
            ->orWhereHas('seance.formateur', function ($q2) use ($search) {
                $q2->where('nom', 'like', "%$search%")
                   ->orWhere('prenom', 'like', "%$search%");
            })
            ->orWhereHas('seance', function ($q2) use ($search) {
                $q2->where('date', 'like', "%$search%")
                    ->orWhereRaw("DATE_FORMAT(date, '%d/%m/%Y') like ?", ["%$search%"])
                    ->orWhereRaw("DATE_FORMAT(date, '%Y-%m-%d') like ?", ["%$search%"]);
            });
        });
    }

    // Get paginated results
    $absences = $query->paginate(15);

    // Transform the data
    $transformedAbsences = $absences->map(function ($absence) {
        // Get discipline note from stagiaire (required field)
        $currentNote = $absence->stagiaire->note_de_discipline;
        
        // Determine status based on justification validation
        $status = 'unjustified';
        if ($absence->justification) {
            $status = $absence->justification->validation ? 'justified' : 'unjustified';
        }

        return [
            'id' => $absence->id,
            'student_id' => $absence->stagiaire->matricule,
            'student_name' => $absence->stagiaire->nom . ' ' . $absence->stagiaire->prenom,
            'date' => $absence->seance->date,
            'groupe' => $absence->stagiaire->groupe->libelle ?? 'N/A',
            'filiere' => $absence->stagiaire->groupe->filiere->libelle ?? 'N/A',
            'formateur' => $absence->seance->formateur->nom . ' ' . $absence->seance->formateur->prenom,
            'status' => $status,
            'base_note' => 20, // Fixed base note
            'current_note' => $currentNote, // From stagiaire.note_de_discipline
        ];
    });

    return response()->json([
        'absences' => $transformedAbsences,
        'pagination' => [
            'total' => $absences->total(),
            'current_page' => $absences->currentPage(),
            'per_page' => $absences->perPage(),
            'last_page' => $absences->lastPage(),
        ]
    ]);
}

}
