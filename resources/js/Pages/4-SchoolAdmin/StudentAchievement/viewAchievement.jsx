import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SchoolAdminSideBar from "../SchoolAdminSideBar";
import { Head, usePage } from "@inertiajs/react";

const ViewAchievement = () => {
    const { achievement } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Lihat Pencapaian" />
            <div className="flex">
                <div className="w-1/6 p-4 bg-gray-800 text-white min-h-screen">
                    <SchoolAdminSideBar />
                </div>
                <div className="flex-1 p-6 bg-white min-h-screen">
                    {/* Breadcrumb Section */}
                    <div className="w-full p-6">
                        <div className="flex items-center text-left">
                            <nav className="mb-8">
                                <ol className="flex items-center space-x-2 text-gray-600">
                                    <li>
                                        <a href="/listAchievement" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                            Pencapaian Pelajar
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-500">Permohonan Sijil</li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-900 font-medium">
                                        {achievement.id}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>


                    {achievement.type_of_application === "Individu" ? (
                        // Individual Achievement View
                        <div className="bg-white p-6 rounded-md shadow-md max-w-7xl mx-auto">
                            <h2 className="text-lg font-semibold mb-4">Permohonan Sijil Pelajar</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kad Pengenalan
                                    </label>
                                    <input
                                        type="text"
                                        value={achievement.students[0]?.ic_num}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Penuh Pelajar
                                    </label>
                                    <input
                                        type="text"
                                        value={achievement.students[0]?.name}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Jenis Pencapaian
                                    </label>
                                    <input
                                        type="text"
                                        value={achievement.type_of_achievement}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Maklumat Pencapaian
                                    </label>
                                    <textarea
                                        value={achievement.details}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Group Achievement View
                        <div className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto">
                            <h2 className="text-lg font-semibold mb-4">Pencapaian Pelajar</h2>
                            <table className="w-full bg-white shadow-md rounded-md overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-4">IC Number</th>
                                        <th className="text-left p-4">Nama Penuh</th>
                                        <th className="text-left p-4">Jenis Pencapaian</th>
                                        <th className="text-left p-4">Maklumat Pencapaian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievement.students.map((student, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 border-b last:border-none"
                                        >
                                            <td className="p-4">{student.ic_num}</td>
                                            <td className="p-4">{student.name}</td>
                                            <td className="p-4">
                                                {achievement.type_of_achievement}
                                            </td>
                                            <td className="p-4">{achievement.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewAchievement;
