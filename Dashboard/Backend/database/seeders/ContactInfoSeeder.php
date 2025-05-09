<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContactInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('address_infos')->insert([
            'address' => 'House No 32, Road No 05, Block C, Banasree,Rampura,Dhaka-1219',
            'email' => 'contact@example.com',
            'phone' => '+1 (123) 456-7890',
        ]);
    }
}
