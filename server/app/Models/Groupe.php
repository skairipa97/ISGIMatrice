<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'groupes';

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class);
    }
}
