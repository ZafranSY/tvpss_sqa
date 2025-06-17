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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_info_id');
            $table->string('equipName'); 
            $table->string('equipType');
            $table->string('location'); 
            $table->date('acquired_date');
            $table->enum('status', ['Berfungsi', 'Tidak Berfungsi', 'Penyelenggaraan']); 
            $table->unsignedTinyInteger('level')->nullable();
            $table->timestamps();

            $table->foreign('school_info_id')->references('id')->on('schoolinfo')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
