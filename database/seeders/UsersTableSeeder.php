<?php

namespace Database\Seeders;

#use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
#use MongoDB\Client as MongoClient;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            [
                'email' => 'superadmin@moe.gov.my',
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'state' => 'Johor',
                #'role' => 'super_admin',
                'role' => User::SUPER_ADMIN,
            ]
        );

        User::firstOrCreate(
            [
                'email' => 'stateadmin@moe.gov.my',
                'name' => 'State Admin',
                'password' => Hash::make('password123'),
                #'role' => 'state_admin',
                'state' => 'Johor',
                'role' => User::STATE_ADMIN,
            ]
        );

        User::firstOrCreate(
            [
                'email' => 'ppdadmin@moe.gov.my',
                'name' => 'PPD Admin',
                'password' => Hash::make('password123'),
                #'role' => 'ppd_admin',
                'state' => 'Johor',
                'role' => User::PPD_ADMIN,
            ]
        );

        User::firstOrCreate(
            [
                'email' => 'schooladmin@moe.gov.my',
                'name' => 'School Admin',
                'password' => Hash::make('password123'),
                #'role' => 'school_admin',n
                'state' => 'Johor',
                'role' => User::SCHOOL_ADMIN,
            ]
        );
    }
}
