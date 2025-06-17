<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    const SUPER_ADMIN = 0;
    const STATE_ADMIN = 1;
    const PPD_ADMIN = 2;
    const SCHOOL_ADMIN = 3;

    protected $fillable = [
        'name',
        'email',
        'password',
        'state',
        'district',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => 'integer',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getRoleName(): string
    {
        switch ($this->role) {
            case self::SUPER_ADMIN:
                return 'super_admin';
            case self::STATE_ADMIN:
                return 'state_admin';
            case self::PPD_ADMIN:
                return 'ppd_admin';
            case self::SCHOOL_ADMIN:
                return 'school_admin';
            default:
                return 'unknown';
        }
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole($role): bool
    {
        return $this->role === $role;
    }

    /**
     * Get all schools created by the user (for school_admin role).
     */
    public function school()
    {
        return $this->hasMany(SchoolInfo::class, 'user_id');
    }
}
