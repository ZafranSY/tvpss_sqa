<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EqLocation extends Model
{
    use Hasfactory;

    protected $table = 'eq_locations';

    protected $guarded = [
        'id',
    ];

    protected $fillable = [
        'eqLocName',
        'eqLocType',
        'school_info_id',
    ];

    public function eqLocation(){
        return $this->hasMany(EqLocation::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function school()
    {
        return $this->belongsTo(SchoolInfo::class, 'school_info_id');
    }
}
