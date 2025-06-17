<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Donations;
use App\Models\SchoolInfo;
use Illuminate\Support\Facades\Session;

class paymentController extends Controller
{
    private $billCode = 'SCHOOL-DONATION';
    private $userSecretKey = '5m6wnep8-1d1g-9gi1-i8pt-t3698m3yqedg';
    private $categoryCode = '53g5l8x0';

    public function redirectToPayment(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'amaun' => 'required|numeric',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'ic_num' => 'required|string',
            'state' => 'required|string',
            'district' => 'required|string',
            'schoolName' => 'required|string',
        ]);

        // Prepare the payload for creating the bill
        $payload = [
            'userSecretKey' => trim($this->userSecretKey),
            'categoryCode' => trim($this->categoryCode),
            'billName' => 'School Donation',
            'billDescription' => 'School Donation',
            'billPriceSetting' => 1,
            'billPayorInfo' => 1,
            'billAmount' => $request->amaun * 100, // Convert to the correct amount
            'billReturnUrl' => route('payment.callback.success'),
            'billCallbackUrl' => route('payment.callback'),
            'billExternalReferenceNo' => 'DONATION_' . time(),
            'billTo' => $request->name,
            'billEmail' => $request->email,
            'billPhone' => $request->phone,
            'billSplitPayment' => 0,
            'billSplitPaymentArgs' => '',
            'billPaymentChannel' => '0',
            'billContentEmail' => 'Thank you for your donation!',
            'billChargeToCustomer' => 1
        ];

        try {
            // Send the request to ToyyibPay API
            $response = Http::asForm()->post('https://dev.toyyibpay.com/index.php/api/createBill', $payload);

            if ($response->successful()) {
                $responseData = $response->json();

                if (!empty($responseData) && isset($responseData[0]['BillCode'])) {
                    $billCode = $responseData[0]['BillCode'];
                    $paymentUrl = "https://dev.toyyibpay.com/{$billCode}";

                    // Save donation data to the database
                    $donation = Donations::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'ic_num' => $request->ic_num,
                        'amaun' => $request->amaun,
                        'school_id' => $this->getSchoolId($request->state, $request->district, $request->schoolName)
                    ]);

                    // Save to session
                    session(['donation_data' => [
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'ic_num' => $request->ic_num,
                        'amaun' => $request->amaun,
                        'negeri' => $request->state,
                        'daerah' => $request->district,
                        'sekolah' => $request->schoolName,
                        'paymentMethod' => 'Online Banking'
                    ]]);

                    // Redirect to the payment URL
                    return Inertia::location($paymentUrl);
                }
            }

            // Handle errors
            return back()->with('error', 'Failed to create payment bill. Please try again.');

        } catch (\Exception $e) {
            Log::error('ToyyibPay API exception:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'An error occurred while processing your payment');
        }
    }

    public function paymentCallback(Request $request)
    {
        \Log::info('Payment callback received:', $request->all());
        
        $status = $request->status_id;
        $billCode = $request->billcode;
        $orderId = $request->order_id;
        
        // Update donation status in database
        if ($status == '1') { // Payment successful
            // Update donation record with payment status
            $donation = Donations::where('id', $orderId)->first();
            if ($donation) {
                $donation->payment_status = 'completed'; // Set payment status to completed
                $donation->transaction_id = $billCode; // Store the transaction ID
                $donation->save();
            }
            
            return response()->json(['message' => 'Payment successful']);
        } else {
            return response()->json(['message' => 'Payment failed']);
        }
    }

    public function paymentCallbackSuccess(Request $request)
    {
        // Get donation data from session
        $paymentData = session('donation_data');
        
        if (!$paymentData) {
            return redirect('/')->with('error', 'Payment data not found');
        }

        // Clear the session data
        session()->forget('donation_data');

        return Inertia::render('Donation/receiptPage', [
            'paymentData' => $paymentData
        ]);
    }

    private function getSchoolId($state, $district, $schoolName)
    {
        $school = SchoolInfo::where('state', $state)
            ->where('district', $district)
            ->where('schoolName', $schoolName)
            ->first();
        
        return $school ? $school->id : null;
    }
}
