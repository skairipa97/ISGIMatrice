<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\stagiaire;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function show($id)
    {
        try {
            $group = Groupe::find($id);
            
            if (!$group) {
                return response()->json(['message' => 'Groupe non trouvé'], 404);
            }

            return response()->json($group);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function stagiaires($groupId)
    {
        try {
            $group = Groupe::with('stagiaires')->find($groupId);

            if (!$group) {
                return response()->json(['message' => 'Groupe non trouvé'], 404);
            }

            return response()->json($group->stagiaires);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}