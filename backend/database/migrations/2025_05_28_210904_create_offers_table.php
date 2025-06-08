<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();                          
            $table->unsignedBigInteger('recruiter_id')->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('recruiter_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};