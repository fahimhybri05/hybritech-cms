<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('footers', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(false);
            $table->string('icon')->nullable();
            $table->string('name');
            $table->string('link')->nullable();
            $table->timestamps();
        });

        // Inserting static data into the footers table
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footers');
    }
};
