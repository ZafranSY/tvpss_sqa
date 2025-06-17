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
        Schema::create('schoolversion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_info_id');
            $table->integer('version')->nullable();
            $table->string('agency1_name')->nullable();
            $table->string('agency2_name')->nullable();
            $table->string('agencyManager1_name')->nullable();
            $table->string('agencyManager2_name')->nullable();
            $table->enum('recordEquipment', ['Ada', 'Tiada']);
            $table->enum('tvpssStudio', ['Ada', 'Tiada']);
            $table->enum('recInSchool', ['Ada', 'Tiada']);
            $table->enum('recInOutSchool', ['Ada', 'Tiada']);
            $table->enum('greenScreen', ['Ada', 'Tiada']);
            $table->enum('isFillSchoolName', ['Ada', 'Tiada'])->nullable();
            $table->enum('isTvpssLogo', ['Ada', 'Tiada'])->nullable();
            $table->enum('isUploadYoutube', ['Ada', 'Tiada'])->nullable();
            $table->enum('isCollabAgency', ['Ada', 'Tiada'])->nullable();
            $table->string('tvpssLogo')->nullable();
            $table->timestamps();

            //point 1
            $table->foreign('school_info_id')->references('id')->on('schoolinfo')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schoolversion');
    }
};
