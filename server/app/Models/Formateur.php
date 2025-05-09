<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

use Laravel\Sanctum\HasApiTokens;

class Formateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use HasFactory;

    protected $fillable = [
        'matricule',
        'mdp',
        'nom',
        'prenom',
        'photo',
        'date_embauche',
    ];

    protected $hidden = [
        'mdp',
    ];
}
