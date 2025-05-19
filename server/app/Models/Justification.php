<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Justification extends Model
{
    protected $fillable = ['absence_id', 'raison', 'preuve', 'validation'];

    public function absence()
    {
        return $this->belongsTo(Absence::class, 'absence_id');
    }

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class, 'stagiaire_matricule');
    }
}