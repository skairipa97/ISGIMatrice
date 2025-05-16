<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    // Liste tous les groupes
    public function index()
    {
        return response()->json(Group::all());
    }

    // Affiche un groupe spécifique
    public function show($id)
    {
        $group = Group::findOrFail($id);
        return response()->json($group);
    }

    // Récupère les stagiaires d'un groupe
    public function stagiaires($groupId)
    {
        $group = Group::with('stagiaires')->findOrFail($groupId);
        return response()->json($group->stagiaires);
    }

    
    public function groups($formateurId)
        {
            $affectations = Affectation::with(['group', 'module'])
                ->where('formateur_id', $formateurId)
                ->get()
                ->map(function ($affectation) {
                    return [
                        'id' => $affectation->group->id,
                        'code' => $affectation->group->code,
                        'name' => $affectation->group->name,
                        'module' => $affectation->module->name,
                        'module_id' => $affectation->module->id
                    ];
                });

            return response()->json($affectations);
        }
}