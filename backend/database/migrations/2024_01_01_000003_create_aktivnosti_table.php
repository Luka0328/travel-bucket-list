<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aktivnosti', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poseta_id')->constrained('posete')->cascadeOnDelete();
            $table->string('naziv');
            $table->text('opis')->nullable();
            $table->unsignedInteger('redosled')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aktivnosti');
    }
};
