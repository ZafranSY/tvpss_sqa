import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import SchoolAdminSideBar from "../SchoolAdminSideBar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";

const StudentList = () => {
    const { students } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredStudents, setFilteredStudents] = useState(students.data || []);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const results = (students.data || []).filter(
            (student) =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.ic_num.includes(searchQuery)
        );
        setFilteredStudents(results);
        setCurrentPage(1);
    }, [searchQuery, students]);

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleExport = () => {
        console.log("Exporting data...");
    };

    const handleTambahPelajar = () => {
        router.visit("/students/create");
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleting(true);
    };

    const cancelDelete = () => {
        setIsDeleting(false);
        setDeleteId(null);
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/students/${deleteId}`);
        }
        cancelDelete();
    };

    const paginatedData = filteredStudents.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Student Management" />
            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                <div className="w-1/6 bg-white shadow-lg">
                    <SchoolAdminSideBar />
                </div>

                <div className="w-full md:ml-[120px] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <nav className="mb-8">
                            <ol className="flex items-center space-x-2 text-gray-600">
                                <li>
                                    <a href="/listStudent" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                        Pengurusan Pelajar
                                    </a>
                                </li>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-900 font-medium">
                                    Semua Pelajar
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl">
                        <div className="flex items-center mb-4 justify-between">
                            <div className="flex items-center w-full max-w-xs relative">
                                <FaSearch className="absolute right-3 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Cari Pelajar..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleTambahPelajar}
                                    style={{ marginTop: '1.45rem' }}
                                    className="px-4 py-2 bg-[#455185] text-white rounded-lg shadow hover:bg-[#3b477a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#455185] transition-all"
                                >
                                    Tambah Pelajar
                                </button>

                                <button
                                    onClick={handleExport}
                                    style={{ marginTop: '1.45rem' }}
                                    className="px-4 py-2 bg-[#666969] text-white rounded-lg shadow hover:bg-[#5c5f5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                                >
                                    Eksport
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

                        <table className="w-full text-left rounded-lg border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="border-b px-4 py-6">Bil</th>
                                    <th className="border-b px-4 py-6">Nama Pelajar</th>
                                    <th className="border-b px-4 py-6">No Kad Pengenalan</th>
                                    <th className="border-b px-4 py-6">Email</th>
                                    <th className="border-b px-4 py-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            Tiada Data Ditemui
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="border-b px-4 py-6">
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </td>
                                            <td className="border-b px-4 py-6">{student.name}</td>
                                            <td className="border-b px-4 py-6">{student.ic_num}</td>
                                            <td className="border-b px-4 py-6">{student.email}</td>
                                            <td className="border-b px-6 py-4 text-center">
                                                <div className="flex justify-center items-center space-x-4">
                                                    <button
                                                        onClick={() => router.visit(`/students/${student.id}/edit`)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(student.id)}
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

                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handlePrevPage}
                                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-600 font-medium disabled:opacity-50 ${currentPage === 1 && "cursor-not-allowed"}`}
                                disabled={currentPage === 1}
                            >
                                Sebelum
                            </button>
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#455185] font-semibold shadow-sm text-sm">
                                Halaman {currentPage} daripada {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-600 font-medium disabled:opacity-50 ${currentPage === totalPages && "cursor-not-allowed"}`}
                                disabled={currentPage === totalPages}
                            >
                                Seterusnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Adakah anda pasti ingin memadamkan pelajar ini?
                        </h3>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Padam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default StudentList;
