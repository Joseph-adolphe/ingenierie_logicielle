<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prestataires', function (Blueprint $table) {
            $table->id(); // id auto-incrémenté pour la table prestataires
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // FK vers users
            $table->text('description')->nullable();
            $table->string('disponibilite')->nullable();
            $table->decimal('tarif_horaire', 10, 2);
            $table->string('order')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('prestataires');
    }
};

