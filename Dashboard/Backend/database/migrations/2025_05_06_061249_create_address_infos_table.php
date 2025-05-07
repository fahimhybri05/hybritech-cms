<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('address_infos', function (Blueprint $table) {
            $table->id();
            $table->text('address');
            $table->string('email');
            $table->string('phone');
            $table->timestamps();
        });
        DB::table('address_infos')->insert([
            'address' => 'House No 32, Road No 05, Block C, Banasree,Rampura,Dhaka-1219',
            'email' => 'contact@example.com',
            'phone' => '+1 (123) 456-7890',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('address_infos');
    }
};
