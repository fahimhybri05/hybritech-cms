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
        Schema::create('email_list', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('application_id');
            $table->string('name');
            $table->string('email');
            $table->string('designation');
            $table->text('address');
            $table->boolean('is_email_sent')->default(false);
            $table->datetime('interview_date');
            $table->timestamps();

             $table->foreign('application_id')
              ->references('id')
              ->on('job_applications')
              ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_list');
    }
};
