<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinacije', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->string('drzava');
            $table->text('opis');
            $table->string('kategorija');
            $table->decimal('prosecna_ocena', 4, 2)->default(0);
            $table->unsignedInteger('broj_ocena')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinacije');
    }
};
