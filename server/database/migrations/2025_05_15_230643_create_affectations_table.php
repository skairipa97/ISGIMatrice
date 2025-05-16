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
        Schema::create('affectations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('formateur_id')->constrained('formateurs');
        $table->foreignId('group_id')->constrained('groupes');
        $table->foreignId('module_id')->constrained('modules');
        $table->timestamps();
        
        $table->unique(['formateur_id', 'group_id', 'module_id']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
