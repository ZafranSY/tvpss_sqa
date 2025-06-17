import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import SchoolAdminSideBar from '../SchoolAdminSideBar';
import { 
    Package, 
    Tag, 
    MapPin, 
    Calendar, 
    Activity,
    AlertCircle,
    Upload,
    X
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function AddEquipment() {
    const [formData, setFormData] = useState({
        equipName: '',
        equipType: '',
        otherType: '',
        location: '',
        acquired_date: '',
        status: '',
        followUpUpdateSchool: '',
        uploadBrEq: [],
    });

    const [statusOptions, setStatusOptions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    useEffect(() => {
        const fetchStatusOptions = async () => {
            try {
                const response = await fetch('/status-options');
                const data = await response.json();
                setStatusOptions(data.status);
            } catch (error) {
                console.error('Error fetching status options:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await fetch('/locations');
                const data = await response.json();
                setLocations(data.locations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchStatusOptions();
        fetchLocations();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 2);
        setFormData((prevData) => ({
            ...prevData,
            uploadBrEq: files,
        }));

        const previews = files.map((file) => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'uploadBrEq') {
                value.forEach((file) => formDataToSubmit.append(key + '[]', file));
            } else {
                formDataToSubmit.append(key, value);
            }
        });
        router.post('/equipment', formDataToSubmit);
    };

    const handleCancel = () => {
        router.get('/listEquipment');
    };

    return (
        <AuthenticatedLayout
        >
            <Head title="TVPSS | Tambah Barang" />
            <div className="flex">
                <div className="w-1/6 p-8 text-white min-h-screen">
                    <SchoolAdminSideBar />
                </div>

                <div className="flex-1 p-6">
                    {/* Breadcrumb Section */}
                    <div className="w-full p-6">
                        <div className="flex items-center text-left">
                            <nav className="mb-8">
                                <ol className="flex items-center space-x-2 text-gray-600">
                                    <li>
                                        <a href="/listEquipment" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                            Pengurusan Peralatan
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-900 font-medium">
                                        Tambah Lokasi
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <Package className="text-[#455185]" size={24} />
                                <h2 className="text-2xl font-bold text-gray-800">Tambah Barang</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Barang */}
                                <div className="relative">
                                    <Package className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        id="equipName"
                                        name="equipName"
                                        value={formData.equipName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent"
                                        placeholder="Nama Barang"
                                    />
                                </div>

                                {/* Jenis */}
                                <div className="relative">
                                    <Tag className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <select
                                        id="equipType"
                                        name="equipType"
                                        value={formData.equipType}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="">Pilih Jenis</option>
                                        <option value="Phone">Phone</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="PC">PC</option>
                                        <option value="Microphone">Mic</option>
                                        <option value="Barang Sukan">Barang Sukan</option>
                                        <option value="Perabot">Perabot</option>
                                        <option value="Kenderaan">Kenderaan</option>
                                        <option value="other">Other (Please Specify)</option>
                                    </select>
                                </div>

                                {formData.equipType === 'other' && (
                                    <div className="relative">
                                        <Tag className="absolute top-3 left-3 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            id="otherType"
                                            name="otherType"
                                            value={formData.otherType}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent"
                                            placeholder="Jenis Peralatan Lain"
                                        />
                                    </div>
                                )}

                                {/* Lokasi */}
                                <div className="relative">
                                    <MapPin className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <select
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="">Pilih Lokasi</option>
                                        {locations.map((location) => (
                                            <option key={location.id} value={location.eqLocName}>
                                                {location.eqLocName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tarikh Diperolehi */}
                                <div className="relative">
                                    <Calendar className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        id="acquired_date"
                                        name="acquired_date"
                                        value={formData.acquired_date}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent"
                                    />
                                </div>

                                {/* Status */}
                                <div className="relative">
                                    <Activity className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="">Pilih Status</option>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Additional Fields for "Tidak Berfungsi" */}
                                {['Tidak Berfungsi', 'Penyelenggaraan'].includes(formData.status) && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <AlertCircle className="absolute top-3 left-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                id="followUpUpdateSchool"
                                                name="followUpUpdateSchool"
                                                value={formData.followUpUpdateSchool}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#455185] focus:border-transparent"
                                                placeholder="Maklumat Kerosakan Barang"
                                            />
                                        </div>
                                        
                                        <div className="relative">
                                            <div className="flex items-center space-x-2">
                                                <Upload className="text-gray-400" size={20} />
                                                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                                                    <span className="text-sm text-gray-600">Upload Images</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            
                                            <div className="mt-4 flex flex-wrap gap-4">
                                                {filePreviews.map((preview, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <X className="mr-2" size={20} />
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex items-center px-6 py-2 bg-[#455185] text-white rounded-md shadow-md hover:bg-[#3d4674] focus:outline-none focus:ring-2 focus:ring-[#455185] transition-colors duration-200"
                                    >
                                        <Upload className="mr-2" size={20} />
                                        Hantar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
