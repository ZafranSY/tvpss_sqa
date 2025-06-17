<?php
use App\Http\Controllers\DonationController;
use App\Http\Controllers\paymentController;
use Illuminate\Support\Facades\Route; 
use Inertia\Inertia;

Route::get('/donationHP', [DonationController::class, 'donationHP'])->name('donationHP');
Route::get('/schools', [DonationController::class, 'getSchools']);
Route::post('donate/donation', [DonationController::class, 'donation'])->name('donation');
//Route::post('donate/receiptDonate', [DonationController::class, 'receiptDonate'])->name('receiptDonate');

Route::post('/redirect-to-payment', [paymentController::class, 'redirectToPayment'])->name('redirect.to.payment');
Route::get('/payment/success', [paymentController::class, 'paymentCallbackSuccess'])->name('payment.callback.success');
Route::post('/payment/callback', [paymentController::class, 'paymentCallback'])->name('payment.callback');
