<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Stagiaire extends Authenticatable
{
    use HasFactory, HasApiTokens;
    use Notifiable;
    protected $guarded = [];

    protected $fillable = [
        'matricule',
        'nom',
        'prenom',
        'email',
        'genre',
        'date_naissance',
        'photo',
        'adresse',
        'groupe_id',
        'remember_token',
        'email_verified_at',
        'remember_token_expires_at',
    ];

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
