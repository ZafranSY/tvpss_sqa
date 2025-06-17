import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import SchoolAdminSideBar from '../SchoolAdminSideBar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';

const ApproveStudCrew = () => {
    const { crew, errors } = usePage().props;

    const handleBack = () => {
        router.get(route('studcrew.list'));
    };

    const handleApproval = (status) => {
        const url = status === 'Approved' 
            ? route('studcrew.approve', { id: crew.id }) 
            : route('studcrew.reject', { id: crew.id });

        router.post(url, {}, {
            onSuccess: () => {
                router.get(route('studcrew.list'));
            }
        });
    };

    if (!crew) {
        return <div>Loading...</div>;
    }

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Approve StudCrew" />
            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                <div className="w-1/6 bg-white shadow-lg">
                    <SchoolAdminSideBar />
                </div>

                <div className="w-full md:ml-[120px] p-7">
                    <div className="flex items-center justify-between mb-7">
                        <nav className="mb-9">
                            <ol className="flex items-center space-x-2 text-gray-600">
                                <li>
                                    <a
                                        href="/studCrewList"
                                        className="text-[#4158A6] hover:text-blue-800 font-medium"
                                    >
                                        Permohonan Krew
                                    </a>
                                </li>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-900 font-medium">Lihat Krew</li>
                            </ol>
                        </nav>
                    </div>

                    {errors && (
                        <div className="text-red-500 text-sm mt-2">
                            {Object.values(errors).map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </div>
                    )}

                    <div className="max-w-8xl mx-auto p-7 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-semibold text-[#4158A6]">Maklumat Krew</h2>
                            <button
                                onClick={handleBack}
                                className="flex items-center space-x-2 text-[#4158A6] hover:text-blue-800"
                            >
                                <FaArrowLeft size={20} />
                                <span>Kembali</span>
                            </button>
                        </div>

                        <div className="bg-white border p-7 rounded-lg shadow-md">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Pelajar
                                    </label>
                                    <input
                                        type="text"
                                        value={crew.student.name}
                                        readOnly
                                        aria-label="Nama Pelajar"
                                        className="mt-1 block w-full py-2.5 px-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        No Kad Pengenalan
                                    </label>
                                    <input
                                        type="text"
                                        value={crew.student.ic_num}
                                        readOnly
                                        aria-label="No Kad Pengenalan"
                                        className="mt-1 block w-full py-2.5 px-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        E-mel
                                    </label>
                                    <input
                                        type="email"
                                        value={crew.student.email}
                                        readOnly
                                        className="mt-1 block w-full py-2.5 px-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tarikh Permohonan
                                    </label>
                                    <input
                                        type="text"
                                        value={new Date(crew.created_at).toLocaleDateString()}
                                        readOnly
                                        className="mt-1 block w-full py-2.5 px-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Jawatan
                                    </label>
                                    <input
                                        type="text"
                                        value={crew.jawatan}
                                        readOnly
                                        className="mt-1 block w-full py-2.5 px-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-7">
                            <button
                                onClick={() => handleApproval('Approved')}
                                className="px-7 py-4 bg-[#445184] text-white rounded-2xl hover:bg-[#3c4f88] transition-all"
                            >
                                Terima
                            </button>
                            <button
                                onClick={() => handleApproval('Rejected')}
                                className="ml-4 px-7 py-4 bg-[#F44336] text-white rounded-2xl hover:bg-[#E53935] transition-all"
                            >
                                Tolak
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ApproveStudCrew;
