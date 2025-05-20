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
        Schema::table('stagiaires', function (Blueprint $table) {
            $table->string('email')->after('prenom')->unique()->nullable();
            $table->string('remember_token')->nullable();
            $table->timestamp('remember_token_expires_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            $table->dropColumn('email');
            $table->dropColumn('remember_token');
            $table->dropColumn('email_verified_at');
        });
    }
};
