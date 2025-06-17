import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SuperAdminSideBar from '../SuperAdminSideBar';
import { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, MapPin, Map, School, Landmark, Layers } from "lucide-react";
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';

export default function UpdateUser({ user, roles }) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        state: user.state || '',
        district: user.district || '', 
        password: user.password || '',
        password_confirmation: '',
    });

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const states = [
        'Johor', 'Melaka', 'Pahang', 'Wilayah Persekutuan Kuala Lumpur', 'Selangor', 
        'Negeri Sembilan', 'Perak', 'Kedah', 'Pulau Pinang', 'Perlis', 'Kelantan', 
        'Terengganu', 'Sabah', 'Sarawak'
    ];

    const districts = {
        Johor: [
            "Johor Bahru", 
            "Muar", 
            "Kluang", 
            "Segamat", 
            "Mersing", 
            "Kota Tinggi", 
            "Batu Pahat", 
            "Pontian", 
            "Pasir Gudang", 
            "Tangkak", 
            "Kulaijaya"
        ],
        Pahang: [
            "Kuantan", 
            "Temerloh", 
            "Bera", 
            "Pekan", 
            "Rompin", 
            "Maran", 
            "Jerantut", 
            "Bentong"
        ],
        "Wilayah Persekutuan Kuala Lumpur": ["Kuala Lumpur"],
        Selangor: [
            "Petaling", 
            "Hulu Langat", 
            "Sepang", 
            "Klang", 
            "Gombak", 
            "Kuala Selangor", 
            "Sabak Bernam", 
            "Selayang"
        ],
        "Negeri Sembilan": [
            "Seremban", 
            "Port Dickson", 
            "Rembau", 
            "Jelebu", 
            "Tampin", 
            "Gemenceh"
        ],
        Perak: [
            "Ipoh", 
            "Kuala Kangsar", 
            "Taiping", 
            "Teluk Intan", 
            "Sitiawan", 
            "Parit Buntar", 
            "Tanjung Malim", 
            "Kampar"
        ],
        Kedah: [
            "Alor Setar", 
            "Sungai Petani", 
            "Kuala Kedah", 
            "Kulim", 
            "Baling", 
            "Langkawi", 
            "Pokok Sena", 
            "Kubang Pasu"
        ],
        "Pulau Pinang": [
            "Georgetown", 
            "Bukit Mertajam", 
            "Nibong Tebal", 
            "Balik Pulau"
        ],
        Perlis: [
            "Kangar", 
            "Arau"
        ],
        Kelantan: [
            "Kota Bharu", 
            "Tumpat", 
            "Pasir Mas", 
            "Machang", 
            "Tanah Merah", 
            "Gua Musang",
             "Kuala Krai"
            ],
        Terengganu: [
            "Kuala Terengganu", 
            "Dungun", 
            "Kemaman", 
            "Besut", 
            "Hulu Terengganu", 
            "Marang"
        ],
        Sabah: [
            "Kota Kinabalu", 
            "Sandakan", 
            "Tawau", 
            "Keningau", 
            "Beaufort", 
            "Lahad Datu", 
            "Semporna", 
            "Ranau", 
            "Papar"
        ],
        Sarawak: [
            "Kuching", 
            "Sibu", 
            "Miri", 
            "Bintulu", 
            "Sri Aman", 
            "Mukah", 
            "Betong", 
            "Limbang"
        ],
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const newErrors = {};
        if (!formData.name) newErrors.name = 'Nama diperlukan!';
        if (!formData.email) newErrors.email = 'Email diperlukan!';
        if (!formData.password && formData.password_confirmation) {
            newErrors.password = 'Katalaluan diperlukan!';
        }
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Katalaluan tidak sepadan!';
        }
        if (!formData.role) newErrors.role = 'Peranan diperlukan!';
        if (!formData.state) newErrors.state = 'Negeri diperlukan!';
        if (!formData.district) newErrors.district = 'Daerah diperlukan!'; 
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Sila masukkan alamat emel yang sah.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            await router.put(`/users/${user.id}`, formData, {
                onSuccess: () => {
                    setIsLoading(false);
                    setMessage('Pengguna berjaya dikemaskini!');
                    
                    // Add delay before redirect
                    setTimeout(() => {
                        router.visit('/listUsers');
                    }, 2000); // 2 seconds delay to show message
                },
                onError: (errors) => {
                    setIsLoading(false);
                    setErrors(errors);
                    setMessage('Ralat berlaku, sila cuba lagi.');
                },
                preserveScroll: true,
                preserveState: true,
            });
        } catch (error) {
            setMessage('Ralat berlaku, sila cuba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        /*setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            state: user.state,
            district: user.district,  
            password: user.password,
            password_confirmation: '',
        });*/
        Inertia.get('/listUsers'); 
        //setMessage('');
    };

    return (
        <AuthenticatedLayout>
        <Head title="TVPSS | Pengurusan Pengguna" />
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            <div className="w-1/5 bg-white">
                <SuperAdminSideBar />
            </div>
            
            <div className="flex-1 p-6">
            <div className="flex items-center justify-between ">
            <h2 className="text-4xl font-bold text-gray-900 bg-clip-text mb-4">
              Kemaskini Pengguna
            </h2>
          </div>
            <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/listUsers" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Pengurusan Pengguna
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Kemaskini Pengguna
                            </li>
                        </ol>
                    </nav>

                <div className="max-w-4xl mx-auto bg-white p-8 shadow border rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-700">Kemaskini maklumat dibawah:</h2>

                    {message && (
                        <div 
                            className={`${
                                message.includes('berjaya') 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                            } text-white px-6 py-4 rounded-lg mb-6 transition-all duration-500 ease-in-out flex items-center justify-between`}
                        >
                            <span>{message}</span>
                            {message.includes('berjaya') && (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                
                        {/* Role Field */}
                        <div className="flex flex-col space-y-2">
    <label htmlFor="role" className="font-medium text-gray-600  flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Peranan
    </label>
    <div className="flex flex-wrap gap-4">
        {roles.map((role) => (
            <label
                key={role.id}
                className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition duration-200 ${
                    formData.role === String(role.id)
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
            >
                <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={formData.role === String(role.id)}
                    onChange={handleInputChange}
                    className="hidden"
                />
                <div className="flex items-center space-x-2">
                    {role.id === 0 && <Shield className="w-5 h-5 text-purple-500" />}
                    {role.id === 1 && <Layers className="w-5 h-5 text-[#5c63f6]" />}
                    {role.id === 2 && <Landmark className="w-5 h-5 text-[#17bae]" />}
                    {role.id === 3 && <School className="w-5 h-5 text-[#e99341]" />}
                    <span className="text-gray-700 font-medium">{role.name}</span>
                </div>
            </label>
        ))}
    </div>
    {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
</div>

                        {/* Name Field */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="name" className="font-medium text-gray-600 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Nama
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`border border-gray-300 bg-gray-100 shadow rounded-lg p-2 focus:ring focus:ring-blue-500 focus:outline-none ${
                                    errors.name && "border-red-500"
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="email" className="font-medium text-gray-600  flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`border border-gray-300 bg-gray-100 rounded-lg p-2 shadow focus:ring focus:ring-blue-500 focus:outline-none ${
                                    errors.email && "border-red-500"
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="password" className="font-medium text-gray-600  flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Kata Laluan
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password} 
                                onChange={handleInputChange}
                                className={`border border-gray-300 bg-gray-100 rounded-lg p-2 shadow focus:ring focus:ring-blue-500 focus:outline-none ${
                                    errors.password && "border-red-500"
                                }`}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Password Confirmation Field */}
                        <div className="flex flex-col space-y-1">
                            <label
                                htmlFor="password_confirmation"
                                className="font-medium text-gray-600  flex items-center gap-2"
                            >
                                <Lock className="w-5 h-5" />
                                Sahkan Kata Laluan
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                id="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                className={`border border-gray-300 bg-gray-100 rounded-lg p-2 shadow focus:ring focus:ring-blue-500 focus:outline-none ${
                                    errors.password_confirmation && "border-red-500"
                                }`}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
                            )}
                        </div>


                        {/* State Field */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="state" className="font-medium text-gray-600  flex items-center gap-2">
                                <Map className="w-5 h-5" />
                                Negeri
                            </label>
                            <select
                                name="state"
                                id="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className={`border border-gray-300 bg-gray-100 rounded-lg p-2 shadow focus:ring focus:ring-blue-500 focus:outline-none ${
                                    errors.state && "border-red-500"
                                }`}
                            >
                                <option value="">Pilih Negeri</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                        </div>

                        {/* District Field */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="district" className="font-medium text-gray-600  flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Daerah
                            </label>
                            <select
                                name="district"
                                id="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                className={`border border-gray-300 bg-gray-100 rounded-lg p-2 shadow focus:ring focus:ring-blue-500 focus:outline-none ${
                                    errors.district && "border-red-500"
                                }`}
                                disabled={!formData.state}
                            >
                                <option value="">Pilih Daerah</option>
                                {formData.state &&
                                    districts[formData.state]?.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                            </select>
                            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="flex justify-end space-x-4">
                        <a
                                href="/users"
                                className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 focus:ring focus:ring-blue-500"
                            >
                                Batal
                            </a>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#4158A6] font-bold text-white shadow rounded-lg hover:bg-[#3C4565] focus:ring focus:ring-blue-500"
                                    >
                                        {isLoading ? 'Mengemaskini...' : 'Kemaskini'}
                                    </button>
                                </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
    );
}
