<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentAchievement extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'id', 
        'type_of_achievement', 
        'type_of_application', 
        'date', 
        'details', 
        'supporting_file', 
        'students',
        'school_info_id',
        'student_id', 
        'ic_num', 
        'student_name',
        'status',
    ];

    protected $casts = [
        'students' => 'array', 
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
