import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FiClipboard, FiLayers, FiMapPin, FiCalendar, FiSettings } from 'react-icons/fi';
import SchoolAdminSideBar from '../SchoolAdminSideBar';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';

export default function UpdateEqLoc({ eqLocation }) {
    // Initialize the form data with the eqLocation data
    const [formData, setFormData] = useState({
        eqLocName: eqLocation?.eqLocName || '',
        eqLocType: eqLocation?.eqLocType || '',
        otherType: eqLocation?.eqLocType === 'other' ? eqLocation?.eqLocName : '',  // Preload the custom type if available
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData({
            eqLocName: eqLocation?.eqLocName || '',
            eqLocType: eqLocation?.eqLocType || '',
            otherType: eqLocation?.eqLocType === 'other' ? eqLocation?.eqLocName : '',  // Set custom other type
        });
    }, [eqLocation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});  // Clear any previous errors

        const newErrors = {};
        if (!formData.eqLocName) newErrors.eqLocName = 'Nama Lokasi diperlukan!';
        if (!formData.eqLocType) newErrors.eqLocType = 'Jenis Lokasi diperlukan!';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setMessage('');  // Reset message

        try {
            // If "other" is selected, assign the custom type
            if (formData.eqLocType === 'other' && formData.otherType) {
                formData.eqLocType = formData.otherType;
            }

            await router.put(`/eqLoc/${eqLocation.id}`, formData);  // Update the location with Inertia
            setMessage('Lokasi berjaya dikemaskini!');
        } catch (error) {
            setMessage('Ralat berlaku, sila cuba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
        header={
            <nav className="ml-12 text-gray-800" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <a href="/listEquipment" className="text-md font-medium hover:text-gray-700">
                            <span className="text-[#4158A6]">Pengurusan Peralatan</span>
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <text x="5" y="15" fontSize="14px" fill="currentColor">/</text>
                            </svg>
                            <span className="ml-1 text-md font-medium text-gray-800 md:ml-2">
                                Kemaskini Lokasi
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
        }
        >
            <Head title="TVPSS | Kemaskini Lokasi" />
            <div className="flex">
                <div className="w-1/6 p-8 text-white min-h-screen">
                    <SchoolAdminSideBar />
                </div>

                <div className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Kemaskini Lokasi</h3>

                        {/* Feedback message */}
                        {message && (
                            <div className={`text-${message.includes('berjaya') ? 'green' : 'red'}-500 mb-4`}>
                                {message}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Lokasi Name */}
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-blue-500">
                                    <FiClipboard className="text-gray-500 ml-3" size={20} />
                                    <input
                                        type="text"
                                        id="eqLocName"
                                        name="eqLocName"
                                        value={formData.eqLocName}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border-0 focus:ring-0 rounded-lg"
                                        placeholder="Masukkan Nama Lokasi"
                                    />
                                </div>
                                {errors.eqLocName && <div className="text-red-500 text-sm">{errors.eqLocName}</div>}

                                {/* Jenis Lokasi */}
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-blue-500">
                                    <FiLayers className="text-gray-500 ml-3" size={20} />
                                    <select
                                        id="eqLocType"
                                        name="eqLocType"
                                        value={formData.eqLocType}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 text-gray-700 bg-white border-0 focus:ring-0 rounded-lg"
                                    >
                                        <option value="">Pilih Jenis Lokasi</option>
                                        <option value="Computer Lab">Computer Lab</option>
                                        <option value="Show Corner">Show Corner</option>
                                        <option value="Mini Studio">Mini Studio</option>
                                        <option value="Recording Corner">Recording Corner</option>
                                        <option value="Broadcast Studio">Broadcast Studio</option>
                                        <option value="Conference Room">Conference Room</option>
                                        <option value="other">Lain-lain (Sila Nyatakan)</option>
                                    </select>
                                </div>
                                {errors.eqLocType && <div className="text-red-500 text-sm">{errors.eqLocType}</div>}

                                {/* Show the additional "Other" field if "Other" is selected */}
                                {formData.eqLocType === 'other' && (
                                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-blue-500">
                                        <FiLayers className="text-gray-500 ml-3" size={20} />
                                        <input
                                            type="text"
                                            id="otherType"
                                            name="otherType"
                                            value={formData.otherType}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border-0 focus:ring-0 rounded-lg"
                                            placeholder="Sila masukkan jenis lokasi lain"
                                        />
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => router.get('/listEquipment')}
                                        className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={() => router.get('/listEquipment')}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    >
                                        {isLoading ? 'Mengemaskini...' : 'Kemaskini'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
