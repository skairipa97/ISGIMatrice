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
        Schema::create('stagiaires', function (Blueprint $table) {
            $table->string('matricule')->primary();
            $table->string('nom');
            $table->string('prenom');
            $table->string('password');
            $table->enum('genre', ['Homme', 'Femme']);
            $table->date('date_naissance');
            $table->string('photo')->nullable();
            $table->text('adresse')->nullable();
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stagiaires');
    }
};
