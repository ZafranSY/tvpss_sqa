import React, { useState, useEffect } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { router, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PPDAdminSideBar from "../PPDAdminSideBar";

export default function ListSchoolEquipment({ schools: initialSchools }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(initialSchools);

    useEffect(() => {
        const searchResults = initialSchools.filter((school) =>
            school.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(searchResults);
        setCurrentPage(1);
    }, [searchQuery, initialSchools]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Pengurusan Peralatan Sekolah" />
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <div className="w-1/6 bg-white shadow-lg">
                    <PPDAdminSideBar />
                </div>
                <div className="w-full md:ml-[120px] p-6">
                    <div className="mb-6">
                        <nav className="mb-8">
                            <ol className="flex items-center space-x-2 text-gray-600">
                                <li className="text-gray-900 font-medium">Pengurusan Peralatan Sekolah</li>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-900 font-medium">
                                    <a href="/eqManagementListPPDSchool" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                        Senarai Sekolah
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div className="relative w-full md:w-96">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari Sekolah..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4158A6] focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bilangan Data</label>
                                    <select
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        className="block w-32 pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-[#4158A6] focus:border-[#4158A6] sm:text-sm rounded-xl bg-gray-50"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 rounded-tl-xl">Bil</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nama Sekolah</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nama Pegawai</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Bilangan Peralatan</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 rounded-tr-xl">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedData.map((school, index) => (
                                        <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{school.schoolName}</div>
                                                <div className="text-sm text-gray-500">{school.schoolCode}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{school.schoolOfficer}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                                    {school.equipment_count} Unit
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => router.visit(`/eqManagementPPD/list/${school.id}`)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                                                    title="Lihat Peralatan"
                                                >
                                                    <FaEye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
