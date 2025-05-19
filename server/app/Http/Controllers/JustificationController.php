<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Justification;
use App\Models\Absence;
use App\Models\Stagiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class JustificationController extends Controller
{

    public function index(Request $request)
    {
        $matricule = $request->stagiaire ?? $request->stagiaire_matricule;
        
        if (!$matricule) {
            return response()->json(['error' => 'Matricule parameter required'], 400);
        }

        $justifications = Justification::with(['absence.seance.module'])
            ->where('stagiaire_matricule', $matricule)
            ->get()
            ->map(function ($justification) {
                return [
                    'id' => $justification->id,
                    'absence_id' => $justification->absence_id,
                    'raison' => $justification->raison,
                    'preuve_path' => $justification->preuve_path,
                    'created_at' => $justification->created_at,
                    'module_libelle' => $justification->absence->seance->module->libelle ?? 'Module inconnu',
                    'date' => $justification->absence->seance->date ?? null,
                    'session' => $justification->absence->seance->session ?? null
                ];
            });

        return response()->json($justifications);
    }

    public function store(Request $request)
{
    \Log::info('Requête de justification reçue:', $request->all());
    \Log::info('Fichier reçu:', ['file' => $request->file('preuve') ? $request->file('preuve')->getClientOriginalName() : 'aucun fichier']);

    $request->validate([
        'absence_id' => 'required|exists:absences,id',
        'stagiaire_matricule' => 'required|exists:stagiaires,matricule',
        'raison' => 'required|string|max:255',
        'preuve' => 'required|file|max:2048'
    ]);

    // Check if justification already exists
    $existing = Justification::where('absence_id', $request->absence_id)->first();
    if ($existing) {
        \Log::warning('Tentative de double justification pour absence_id: ' . $request->absence_id);
        return response()->json(['error' => 'Cette absence a déjà été justifiée'], 400);
    }

    // Store the file
    $path = $request->file('preuve')->store('justifications', 'public');
    \Log::info('Fichier stocké à:', ['path' => $path]);

    $justification = Justification::create([
        'absence_id' => $request->absence_id,
        'stagiaire_matricule' => $request->stagiaire_matricule,
        'raison' => $request->raison,
        'preuve_path' => $path
    ]);

    \Log::info('Justification créée:', $justification->toArray());

    return response()->json($justification, 201);
}

    // Récupère toutes les justifications en attente
    public function pending()
    {
        return Justification::with([
                'absence.stagiaire.groupe', // Correct relationship path
                'absence.seance.module'
            ])
            ->where('validation', false)
            ->get()
            ->map(function ($justification) {
                $stagiaire = $justification->absence->stagiaire ?? null;
                $groupe = $stagiaire->groupe ?? null;
                
                return [
                    'id' => $justification->id,
                    'student' => $stagiaire ? [
                        'id' => $stagiaire->matricule,
                        'name' => trim($stagiaire->nom . ' ' . $stagiaire->prenom),
                        'groupe' => $groupe->libelle ?? 'Non assigné',
                        'avatar' => $stagiaire->photo ?? null
                    ] : null,
                    'date' => $justification->absence->seance->date ?? null,
                    'duration' => $justification->absence->seance->duree ?? 0 . ' heures',
                    'details' => $justification->raison,
                    'proof' => $justification->preuve_path 
                        ? Storage::url($justification->preuve_path)
                        : null,
                    'absence_id' => $justification->absence_id
                ];
            });
    }

    // Met à jour le statut d'une justification
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:accepted,rejected'
    ]);

    try {
        return DB::transaction(function () use ($request, $id) {
            $justification = Justification::with(['absence.seance', 'absence.stagiaire'])
                ->findOrFail($id);

            if ($request->status === 'accepted') {
                $justification->validation = true;
                $justification->save();

                $absence = $justification->absence;
                

                if ($absence->seance && $absence->stagiaire) {
                    $duree = $absence->seance->duree ?? 0;
                    $increment = 0;

                    if ($duree == 5) {
                        $increment = 0.5;
                    } elseif ($duree == 2.5) {
                        $increment = 0.25;
                    }

                    if ($increment > 0) {
                        $absence->stagiaire->increment('note_de_discipline', $increment);
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Justification acceptée avec succès',
                    'note_increment' => $increment ?? 0
                ]);
            } else {
                $justification->validation = false;
                $justification->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Justification refusée'
                ]);
            }
        });
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors du traitement: ' . $e->getMessage()
        ], 500);
    }
}
}