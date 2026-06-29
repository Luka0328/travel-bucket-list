<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destinacija extends Model
{
    protected $table = 'destinacije';

    protected $fillable = [
        'naziv',
        'drzava',
        'opis',
        'kategorija',
        'prosecna_ocena',
        'broj_ocena',
    ];

    protected $casts = [
        'prosecna_ocena' => 'float',
        'broj_ocena' => 'integer',
    ];

    public function posete(): HasMany
    {
        return $this->hasMany(Poseta::class, 'destinacija_id');
    }
}
