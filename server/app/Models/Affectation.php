<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    protected $fillable = ['formateur_id', 'group_id', 'module_id'];

    public function formateur()
    {
        return $this->belongsTo(Formateur::class);
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}