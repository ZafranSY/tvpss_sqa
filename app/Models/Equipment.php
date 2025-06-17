<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model as Model;
use App\Enums\StatusEnum;

class Equipment extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
    ];

    protected $fillable = [
        'equipName',
        'equipType',
        'location',
        'acquired_date',
        'status',
        'school_info_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'status' => StatusEnum::class,  
    ];

    /**
     * A helper function to get the human-readable name of the status.
     */
    public function getStatusNameAttribute()
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    public function school()
    {
        return $this->belongsTo(SchoolInfo::class, 'school_info_id');
    }
}
