<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hybri.tech',
            'position' => 'Admin',
            'image_url' => 'https://media.discordapp.net/attachments/1363795833493000239/1363795928107974778/Admin.jpg?ex=6807556f&is=680603ef&hm=df4298ddebcd20b510e33aa18cf641dc30d6834059575166abfed3ec53d094a8&=&format=webp&width=624&height=653',
            'password' => Hash::make('ht_admin@123'),
        ]);
    }
}
