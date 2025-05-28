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
        Schema::table('job_applications', function (Blueprint $table) {
            $table->boolean('is_selected')->default(false)->after('is_active');
            $table->boolean('is_email_sent')->default(false)->after('is_selected');
            $table->timestamp('selected_at')->nullable()->after('attachment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
           $table->dropColumn(['is_selected', 'is_email_sent', 'selected_at']);
        });
    }
};
