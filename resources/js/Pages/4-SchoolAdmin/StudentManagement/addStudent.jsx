import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SchoolAdminSideBar from "../SchoolAdminSideBar";
import { FiUser, FiMail, FiMapPin, FiBook, FiHome, FiMap, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from '@inertiajs/react';

export default function AddStudent({ schoolInfo }) {
    const [formData, setFormData] = useState({
        name: "",
        ic_num: "",
        email: "",
        crew: "",
        state: schoolInfo.state || "",
        district: schoolInfo.district || "",
        schoolName: schoolInfo.schoolName || "",
        school_info_id: schoolInfo.id || "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        router.post("/students", formData, {
            onSuccess: () => {
                toast.success("Student added successfully!");
                setFormData(prev => ({
                    ...prev,
                    name: "",
                    ic_num: "",
                    email: "",
                    crew: "",
                }));
            },
            onError: (validationErrors) => {
                setErrors(validationErrors);
                toast.error("Failed to add student. Please check your input.");
            },
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPPSS | Tambah Pelajar" />

            <div className="flex min-h-screen bg-white">
                <div className="w-64 bg-white shadow-lg">
                    <SchoolAdminSideBar />
                </div>

                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="w-full p-6">
                            <nav className="mb-8">
                                <ol className="flex items-center space-x-2 text-gray-600">
                                    <li>
                                        <a href="/listStudent" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                            Pengurusan Pelajar
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-900 font-medium">Tambah Pelajar</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="bg-white rounded-t-md p-6 shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tambah Pelajar</h2>
                            <p className="text-sm text-gray-500">Sila isi maklumat pelajar di bawah</p>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-b-md shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Input */}
                                    <div className="relative">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Penuh
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-md focus:outline-none focus:border-blue-400"
                                                placeholder="Enter nama penuh"
                                            />
                                            {errors.name && <FiAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                                        </div>
                                        {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name[0]}</p>}
                                    </div>

                                    {/* IC Number Input */}
                                    <div className="relative">
                                        <label htmlFor="ic_num" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombor Kad Pengenalan
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="ic_num"
                                                type="text"
                                                name="ic_num"
                                                value={formData.ic_num}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-md focus:outline-none focus:border-blue-400"
                                                placeholder="Enter nombor kad pengenalan"
                                            />
                                            {errors.ic_num && <FiAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                                        </div>
                                        {errors.ic_num && <p className="mt-1.5 text-sm text-red-500">{errors.ic_num[0]}</p>}
                                    </div>

                                    {/* Email Input */}
                                    <div className="relative">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Alamat Email
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-md focus:outline-none focus:border-blue-400"
                                                placeholder="Enter alamat email"
                                            />
                                            {errors.email && <FiAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                                        </div>
                                        {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email[0]}</p>}
                                    </div>

                                    {/* Crew Input */}
                                    <div className="relative">
                                        <label htmlFor="crew" className="block text-sm font-medium text-gray-700 mb-1">
                                            Krew
                                        </label>
                                        <div className="relative">
                                            <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="crew"
                                                type="text"
                                                name="crew"
                                                value={formData.crew}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-md focus:outline-none focus:border-blue-400"
                                                placeholder="Enter krew"
                                            />
                                            {errors.crew && <FiAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                                        </div>
                                        {errors.crew && <p className="mt-1.5 text-sm text-red-500">{errors.crew[0]}</p>}
                                    </div>

                                    {/* Disabled Fields */}
                                    <div className="relative">
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State
                                        </label>
                                        <div className="relative">
                                            <FiMap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="state"
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-md cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                            District
                                        </label>
                                        <div className="relative">
                                            <FiMap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="district"
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-md cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                                            School Name
                                        </label>
                                        <div className="relative">
                                            <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                id="schoolName"
                                                type="text"
                                                name="schoolName"
                                                value={formData.schoolName}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-md cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                                    <a
                                        href="/listStudent"
                                        className="px-6 py-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition duration-200"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-[#455185] text-white rounded-md hover:bg-[#455185] transition duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            "Tambah Pelajar"
                                        )}
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