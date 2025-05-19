<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'seance_id',
        'stagiaire_matricule',
        'session'
    ];

    public function seance(): BelongsTo
    {
        return $this->belongsTo(Seance::class, 'seance_id', 'id');
    }

    public function stagiaire(): BelongsTo
    {
        return $this->belongsTo(Stagiaire::class, 'stagiaire_matricule', 'matricule');
    }

    public function justification()
    {
        return $this->hasOne(Justification::class);
    }

}