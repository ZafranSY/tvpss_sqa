<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
use App\Models\Donations;

class SchoolInfo extends Model
{
    use HasFactory;

    protected $table = 'schoolinfo';

    protected $fillable = [
        'schoolCode',
        'user_id',
        'schoolOfficer', 
        'schoolName',
        'schoolEmail',
        'schoolAddress1',
        'schoolAddress2',
        'district',
        'postcode',
        'state',
        'noPhone',
        'noFax',
        'schoolLogo',
        'linkYoutube',
        'user_id',
    ];

    /**
     * A school belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // point 2
    public function schoolVersion()
    {
        return $this->hasOne(TVPSSVersion::class, 'school_info_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'school_info_id');
    }

    public function updateLogo($file)
    {
        if ($file) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('logos', $filename, 'public');
            $this->update(['schoolLogo' => $filename]);
        }
    }

    public function donation()
    {
        return $this->hasMany(Donations::class, 'school_id');
    }

}
