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
        Schema::create('eq_locations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_info_id');
            $table->string('eqLocName');
            $table->string('eqLocType');
            $table->timestamps();
            $table->foreign('school_info_id')->references('id')->on('schoolinfo')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eq_locations');
    }
};
