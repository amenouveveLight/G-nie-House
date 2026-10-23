<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalonSetting extends Model
{
    protected $guarded = [];

    protected $casts = [
        'value' => 'array',
    ];
}
