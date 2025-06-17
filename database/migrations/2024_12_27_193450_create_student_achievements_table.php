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
        Schema::create('student_achievements', function (Blueprint $table) {
            $table->id(); 
            $table->string('type_of_achievement'); 
            $table->string('type_of_application'); 
            $table->date('date'); 
            $table->text('details'); 
            $table->string('supporting_file')->nullable(); 
            $table->json('students');
            //$table->unsignedBigInteger('student_id')->nullable(); 
            //$table->string('ic_num'); 
            //$table->string('student_name'); 
            $table->unsignedBigInteger('school_info_id');
            $table->string('status');
            $table->timestamps(); 

            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_achievements');
    }
};
