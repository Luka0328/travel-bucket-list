<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aktivnost extends Model
{
    protected $table = 'aktivnosti';

    protected $fillable = [
        'poseta_id',
        'naziv',
        'opis',
        'redosled',
    ];

    protected $casts = [
        'redosled' => 'integer',
    ];

    public function poseta(): BelongsTo
    {
        return $this->belongsTo(Poseta::class, 'poseta_id');
    }
}
