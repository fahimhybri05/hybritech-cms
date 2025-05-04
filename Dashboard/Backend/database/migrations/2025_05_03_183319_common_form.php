<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('common_forms', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(false);
            $table->string('full_name');
            $table->string('project_name');
            $table->string('email')->unique();
            $table->string('project_type');
            $table->decimal('project_budget', 10, 2);
            $table->LONGTEXT('description');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('common_forms');
    }
};
