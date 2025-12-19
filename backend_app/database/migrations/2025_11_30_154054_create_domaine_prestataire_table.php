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
        Schema::create('domaine_prestataire', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestataire_id')->constrained('prestataires')->onDelete('cascade');
            $table->foreignId('domaine_id')->constrained('domaines')->onDelete('cascade');
            $table->string('niveau_expertise')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domaine_prestataire');
    }
};
