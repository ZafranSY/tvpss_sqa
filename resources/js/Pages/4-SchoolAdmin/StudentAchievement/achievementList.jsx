import React, { useState, useEffect } from "react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import SchoolAdminSideBar from "../SchoolAdminSideBar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";

const StudentAchievements = () => {
    const { achievements } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredAchievements, setFilteredAchievements] = useState(achievements || []);

    useEffect(() => {
        const results = (achievements || []).filter((achievement) => {
            if (!achievement || !achievement.type_of_achievement || !achievement.id) return false;

            return (
                achievement.type_of_achievement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                achievement.id.includes(searchQuery)
            );
        });
        setFilteredAchievements(results);
        setCurrentPage(1);
    }, [searchQuery, achievements]);

    const totalPages = Math.ceil(filteredAchievements.length / rowsPerPage);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleHantarBorang = () => {
        router.visit("/achievements/create");
    };

    const paginatedData = filteredAchievements.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Pencapaian Pelajar" />
            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                {/* Sidebar */}
                <div className="w-1/6 bg-white shadow-lg">
                    <SchoolAdminSideBar />
                </div>

                {/* Main Content */}
                <div className="w-full md:ml-[120px] p-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between mb-6">
                        <nav className="mb-8">
                            <ol className="flex items-center space-x-2 text-gray-600">
                                <li>
                                    <a href="#" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                        Pencapaian Pelajar
                                    </a>
                                </li>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-900 font-medium">Semua Pencapaian</li>
                            </ol>
                        </nav>
                    </div>

                    {/* Search and Actions */}
                    <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl">
                        <div className="flex items-center mb-4 justify-between">
                            <div className="flex items-center w-full max-w-xs relative">
                                <input
                                    type="text"
                                    placeholder="Cari Pencapaian..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleHantarBorang}
                                    style={{ marginTop: '1.45rem' }}
                                    className="px-4 py-2 bg-[#455185] text-white rounded-lg shadow bg-[#455185] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#455185] transition-all"
                                >
                                    Hantar Borang Pencapaian
                                </button>

                                <div>
                                    <label
                                        htmlFor="rowsPerPage"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Bilangan Data
                                    </label>
                                    <select
                                        id="rowsPerPage"
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#455185] focus:border-[#455185] sm:text-sm rounded-md"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-left rounded-lg border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="border-b px-4 py-6">Bil</th>
                                    <th className="border-b px-4 py-6">Jenis Pencapaian</th>
                                    <th className="border-b px-4 py-6">Kod</th>
                                    <th className="border-b px-4 py-6">Jenis Permohonan</th>
                                    <th className="border-b px-4 py-6">Status</th>
                                    <th className="border-b px-4 py-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            Tiada Data Ditemui
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((achievement, index) => (
                                        <tr key={achievement.id} className="hover:bg-gray-50">
                                            <td className="border-b px-4 py-6">
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </td>
                                            <td className="border-b px-4 py-6">
                                                {achievement.type_of_achievement}
                                            </td>
                                            <td className="border-b px-4 py-6">{achievement.id}</td>
                                            <td className="border-b px-4 py-6">
                                                {achievement.type_of_application}
                                            </td>
                                            <td className="border-b px-4 py-6">
                                                <span
                                                    className={`px-2 py-1 rounded-full ${
                                                        achievement.status === "Pending"
                                                            ? "bg-yellow-200 text-yellow-700"
                                                            : achievement.status === "Approved"
                                                            ? "bg-green-200 text-green-700"
                                                            : "bg-red-200 text-red-700"
                                                    }`}
                                                >
                                                    {achievement.status}
                                                </span>
                                            </td>
                                            <td className="border-b px-6 py-4 text-center">
                                                <div className="flex justify-center items-center space-x-4">
                                                    <button
                                                        onClick={() =>
                                                            router.visit(`/achievements/${achievement.id}`)
                                                        }
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    "Are you sure you want to delete this achievement?"
                                                                )
                                                            ) {
                                                                router.delete(`/achievements/${achievement.id}`);
                                                            }
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTrashAlt size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-4 py-2 bg-gray-200 rounded-lg ${
                                    currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-300"
                                }`}
                            >
                                Sebelum
                            </button>
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#455185] font-semibold shadow-sm text-sm">
                                Halaman {currentPage} daripada {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-4 py-2 bg-gray-200 rounded-lg ${
                                    currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-300"
                                }`}
                            >
                                Seterusnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StudentAchievements;
