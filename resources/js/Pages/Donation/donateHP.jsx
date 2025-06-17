import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, CreditCard, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'

export default function Donation() {
    const states = [
        "Johor", "Melaka", "Pahang", "Wilayah Persekutuan Kuala Lumpur", "Selangor", "Negeri Sembilan",
        "Perak", "Kedah", "Pulau Pinang", "Perlis", "Kelantan", "Terengganu", "Sabah", "Sarawak"
    ];

    const districts = {
        Johor: ["Johor Bahru", "Muar", "Kluang", "Segamat", "Mersing", "Kota Tinggi", "Batu Pahat", "Pontian", "Pasir Gudang", "Tangkak", "Kulaijaya"],
        Pahang: ["Kuantan", "Temerloh", "Bera", "Pekan", "Rompin", "Maran", "Jerantut", "Bentong"],
        "Wilayah Persekutuan Kuala Lumpur": ["Kuala Lumpur"],
        Selangor: ["Petaling", "Hulu Langat", "Sepang", "Klang", "Gombak", "Kuala Selangor", "Sabak Bernam", "Selayang"],
        "Negeri Sembilan": ["Seremban", "Port Dickson", "Rembau", "Jelebu", "Tampin", "Gemenceh"],
        Perak: ["Ipoh", "Kuala Kangsar", "Taiping", "Teluk Intan", "Sitiawan", "Parit Buntar", "Tanjung Malim", "Kampar"],
        Kedah: ["Alor Setar", "Sungai Petani", "Kuala Kedah", "Kulim", "Baling", "Langkawi", "Pokok Sena", "Kubang Pasu"],
        "Pulau Pinang": ["Georgetown", "Bukit Mertajam", "Nibong Tebal", "Balik Pulau"],
        Perlis: ["Kangar", "Arau"],
        Kelantan: ["Kota Bharu", "Tumpat", "Pasir Mas", "Machang", "Tanah Merah", "Gua Musang", "Kuala Krai"],
        Terengganu: ["Kuala Terengganu", "Dungun", "Kemaman", "Besut", "Hulu Terengganu", "Marang"],
        Sabah: ["Kota Kinabalu", "Sandakan", "Tawau", "Keningau", "Beaufort", "Lahad Datu", "Semporna", "Ranau", "Papar"],
        Sarawak: ["Kuching", "Sibu", "Miri", "Bintulu", "Sri Aman", "Mukah", "Betong", "Limbang"]
    };

    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableSchools, setAvailableSchools] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        ic_num: "",
        email: "",
        phone: "",
        state: "",
        district: "",
        schoolName: "",
        amaun: "",
        paymentMethod: "Online Banking"
    });

    const handleStateChange = (e) => {
        const state = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            state,
            district: "", 
            schoolName: "",
        }));
        setAvailableDistricts(districts[state] || []);
    };

    const handleDistrictChange = async (e) => {
        const district = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            district
        }));
        fetchSchools(formData.state, district); 
    };

    const fetchSchools = async (state, district) => {
        if (!state || !district) return;
    
        try {
            const response = await fetch(`/schools?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
            if (response.ok) {
                const data = await response.json();
                setAvailableSchools(Array.isArray(data) ? data : []); // Ensure we're handling array data
            } else {
                console.error("Error fetching schools:", response.statusText);
                setAvailableSchools([]); // Reset schools on error
                alert("There was an issue fetching the schools. Please try again later.");
            }
        } catch (err) {
            console.error("Error fetching schools:", err);
            setAvailableSchools([]); // Reset schools on error
            alert("There was an issue fetching the schools. Please try again later.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Send data and get payment URL
            const response = await router.post('/redirect-to-payment', formData, {
                onSuccess: (response) => {
                    // Check if the response contains a payment URL
                    if (response.props.paymentUrl) {
                        // Redirect to ToyyibPay
                        window.location.href = response.props.paymentUrl; // This should be the correct payment URL
                    } else {
                        alert('Payment URL not found. Please try again.');
                    }
                },
                onError: (errors) => {
                    console.error('Error:', errors);
                    alert('There was an error processing your request. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your request. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex flex-col">
            <Head title="TVPSS | Sumbangan" />
            {/* Header */}
            <header className="bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <img src="/assets/KPM_Logo.png" alt="KPM Logo" className="h-16 w-auto" />
                        <div className="h-8 w-px bg-gray-200" />
                        <img src="/assets/TVPSSLogo3.jpg" alt="TVPSS Logo" className="h-16 w-auto" />
                    </div>
                    <Link href="/studentPage" className="group flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                        Kembali
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Form Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-blue-900 mb-3">Form Sumbangan</h1>
                        <p className="text-gray-600">Sila lengkapkan maklumat di bawah untuk membuat sumbangan</p>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8">
                            {/* Personal Information */}
                            <div className="space-y-8">
                                <div className="border-b pb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-600" />
                                        Maklumat Peribadi
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Personal Input Fields */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Nama Penuh
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Masukkan nama penuh"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                No. Kad Pengenalan
                                                <input
                                                    type="text"
                                                    name="ic_num"
                                                    placeholder="000000-00-0000"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    value={formData.ic_num}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Email
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="email@contoh.com"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                No. Telefon
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="0123456789"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Address and Donation Details */}
                                <div className="border-b pb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                        Maklumat Alamat dan Sumbangan
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Negeri
                                                <select
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleStateChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Sila pilih negeri</option>
                                                    {states.map(state => (
                                                        <option key={state} value={state}>
                                                            {state}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Daerah
                                                <select
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleDistrictChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Sila pilih daerah</option>
                                                    {availableDistricts.map(district => (
                                                        <option key={district} value={district}>
                                                            {district}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Nama Sekolah
                                                <select
                                                    name="schoolName"
                                                    value={formData.schoolName}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Sila pilih sekolah</option>
                                                    {availableSchools.map(school => (
                                                        <option key={school} value={school}>
                                                            {school}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amaun (RM)</label>
                <div className="relative">
                    <input
                        type="number"
                        name="amaun"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                        value={formData.amaun}
                        onChange={handleInputChange}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">RM</span>
                </div>
            </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Kaedah Pembayaran
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                                        <span className="font-medium">Online Banking</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">Kaedah Pembayaran Tunggal</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button type="submit" className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300">
                                        Hantar Sumbangan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
