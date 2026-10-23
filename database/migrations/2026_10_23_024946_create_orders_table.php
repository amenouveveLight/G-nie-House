<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('subtotal');
            $table->integer('discount')->default(0);
            $table->integer('shipping_fee')->default(0);
            $table->integer('total');
            $table->string('delivery_method')->default('pickup'); // delivery, pickup
            $table->json('shipping_address')->nullable();
            $table->string('order_status')->default('en_attente_paiement'); // en_attente_paiement, payee, en_preparation, expediee, terminee, annulee, remboursee
            $table->string('payment_status')->default('pending'); // pending, success, failed, refunded
            $table->string('payment_method')->nullable(); // card, mobile_money, cash
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
