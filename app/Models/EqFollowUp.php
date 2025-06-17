<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EqFollowUp extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipment_id',
        'user_id',
        'uploadBrEq',
        'content',
        'date',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForEquipment($query, $equipmentId)
    {
        return $query->where('equipment_id', $equipmentId)->orderBy('created_at', 'asc');
    }
}
