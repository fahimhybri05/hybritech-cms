<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_page_details', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(false);
            $table->string('title');
            $table->text('description');
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('service_page_details');
    }
};
