<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Stagiaire extends Model
{
    use HasFactory, HasApiTokens;

    protected $guarded = [];

    protected $primaryKey = 'matricule';
    protected $keyType = 'string';
    public $incrementing = false;

    public function getAuthPassword()
    {
        return $this->mdp;
    }

    protected $hidden = [
        'mdp',
    ];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }
    public function absences()
    {
        return $this->hasMany(Absence::class, 'stagiaire_matricule', 'matricule');
    }
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
