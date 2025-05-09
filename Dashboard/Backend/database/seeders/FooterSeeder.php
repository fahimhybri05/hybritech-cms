<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FooterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('footers')->insert([
            ['name' => 'Facebook', 'icon' => '<i class="fa-brands fa-square-facebook"></i>'],
            ['name' => 'WhatsApp','icon' => '<i class="fa-brands fa-square-whatsapp"></i>'],
            ['name' => 'LinkedIn','icon' => '<i class="fa-brands fa-linkedin"></i>'],
            ['name' => 'X','icon' => '<i class="fa-brands fa-square-x-twitter"></i>'],
            ['name' => 'Instagram','icon' => '<i class="fa-brands fa-square-instagram"></i>'],
            ['name' => 'Reddit','icon' => '<i class="fa-brands fa-square-reddit"></i>'],
            ['name' => 'Discord','icon' => '<i class="fa-brands fa-discord"></i>'],
            ['name' => 'GitHub','icon' => '<i class="fa-brands fa-github"></i>'],
        ]);
    }
}
