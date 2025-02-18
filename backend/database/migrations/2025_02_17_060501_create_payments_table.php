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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->enum('payment_method', ['credit_card', 'debit_card'])->default('credit_Card');
            $table->string('card_name');
            $table->string('card_number');
            $table->string('card_expiration');
            $table->string('card_cvv');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->integer('amount');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
