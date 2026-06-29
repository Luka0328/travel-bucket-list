<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poseta extends Model
{
    protected $table = 'posete';

    protected $fillable = [
        'user_id',
        'destinacija_id',
        'status',
        'datum_dodavanja',
        'datum_putovanja',
        'ocena',
        'napomena',
    ];

    protected $casts = [
        'datum_dodavanja' => 'date',
        'datum_putovanja' => 'date',
        'ocena' => 'integer',
    ];

    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function destinacija(): BelongsTo
    {
        return $this->belongsTo(Destinacija::class, 'destinacija_id');
    }

    public function aktivnosti(): HasMany
    {
        return $this->hasMany(Aktivnost::class, 'poseta_id')->orderBy('redosled');
    }
}
