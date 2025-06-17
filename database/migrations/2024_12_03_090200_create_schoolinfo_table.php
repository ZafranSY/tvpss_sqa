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
        Schema::create('schoolinfo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); 
            $table->string('schoolOfficer')->nullable();
            $table->string('schoolCode');
            $table->string('schoolName');
            $table->string('schoolEmail');
            $table->string('schoolAddress1');
            $table->string('schoolAddress2')->nullable();
            $table->string('district');
            $table->string('postcode');
            $table->string('state');
            $table->string('noPhone');
            $table->string('noFax')->nullable();
            $table->string('schoolLogo')->nullable();
            //$table->string('schoolLogo')->nullable()->default('images/');
            $table->string('linkYoutube')->nullable();
            $table->timestamps(); 
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schoolinfo');
    }
};
