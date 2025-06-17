import { ArrowLeft } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

export default function PaymentReceipt({ paymentData, schools }) {
    // Format date for receipt
    const currentDate = new Date().toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Generate receipt number
    const receiptNumber = `TVPSS-${Date.now().toString().slice(-8)}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex flex-col">
            <Head title="TVPSS | Resit Sumbangan" />
            {/* Header */}
            <header className="bg-bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <img src="/assets/KPM_Logo.png" alt="KPM Logo" className="h-16 w-auto" />
                        <div className="h-8 w-px bg-gray-200" />
                        <img src="/assets/TVPSSLogo3.jpg" alt="TVPSS Logo" className="h-16 w-auto" />
                    </div>
                    <Link 
                        href="/" 
                        className="group flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                        Kembali ke Halaman Utama
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Receipt Header */}
                        <div className="bg-blue-600 text-white px-6 py-4">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold mb-2">Resit Pembayaran</h1>
                                <p className="text-blue-100">Terima kasih atas sumbangan anda</p>
                            </div>
                        </div>

                        {/* Receipt Content */}
                        <div className="p-6 space-y-6">
                            {/* Receipt Details */}
                            <div className="flex justify-between border-b pb-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">No. Resit</p>
                                    <p className="font-medium">{receiptNumber}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-sm text-gray-600">Tarikh</p>
                                    <p className="font-medium">{currentDate}</p>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800">Maklumat Peribadi</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">Nama</p>
                                        <p className="font-medium">{paymentData.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">No. Kad Pengenalan</p>
                                        <p className="font-medium">{paymentData.ic_num}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{paymentData.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">No. Telefon</p>
                                        <p className="font-medium">{paymentData.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800">Maklumat Lokasi</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">Negeri</p>
                                        <p className="font-medium">{paymentData.negeri}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">Daerah</p>
                                        <p className="font-medium">{paymentData.daerah}</p>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-sm text-gray-600">Sekolah</p>
                                        <p className="font-medium">{paymentData.sekolah}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800">Maklumat Pembayaran</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">Kaedah Pembayaran</p>
                                            <p className="font-medium">{paymentData.paymentMethod}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Jumlah</p>
                                            <p className="text-xl font-bold text-blue-600">RM {parseFloat(paymentData.amaun).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Print Button */}
                            <button
                                onClick={() => window.print()}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <span className="font-medium">Cetak Resit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-blue-900 text-white py-6">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-blue-200">
                        © 2024 TV Pusat Sumber Sekolah. Hak Cipta Terpelihara.
                    </p>
                </div>
            </footer>
        </div>
    );
}
