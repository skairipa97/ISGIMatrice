<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $table = 'modules';
    protected $fillable = [
        
    ];

  

    /**
     * Relation avec les affectations
     */
    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class);
    }

    /**
     * Relation avec les groupes (via affectations)
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'affectations')
                   ->withTimestamps();
    }

    /**
     * Relation avec les formateurs (via affectations)
     */
    public function formateurs()
    {
        return $this->belongsToMany(Formateur::class, 'affectations')
                   ->withTimestamps();
    }

    /**
     * Accesseur pour la durée formatée
     */
    public function getFormattedDurationAttribute(): string
    {
        return "{$this->duration} heures";
    }
}