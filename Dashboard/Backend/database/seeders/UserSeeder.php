<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hybri.tech',
            'position' => 'Admin',
            'image_url' => 'https://github.com/fahimhybri05/hybritech-cms/blob/master/Dashboard/Frontend/src/assets/img/Admin.jpg?raw=true',
            'password' => Hash::make('ht_admin@123'),
        ]);
    }
}
