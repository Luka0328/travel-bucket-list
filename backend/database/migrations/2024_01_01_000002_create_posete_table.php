<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posete', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destinacija_id')->constrained('destinacije')->cascadeOnDelete();
            $table->string('status')->default('planiram');
            $table->date('datum_dodavanja');
            $table->date('datum_putovanja')->nullable();
            $table->unsignedTinyInteger('ocena')->nullable();
            $table->text('napomena')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'destinacija_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posete');
    }
};
