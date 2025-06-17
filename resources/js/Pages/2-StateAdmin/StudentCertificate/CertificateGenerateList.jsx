import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StateAdminSideBar from '../StateAdminSideBar';
import { Head } from '@inertiajs/react';
import { FaSearch, FaEye } from 'react-icons/fa';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from '@inertiajs/react';

export default function ListSchool({ schools }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter schools based on search term and status filter
  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? school.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastSchool = currentPage * rowsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - rowsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filteredSchools.length / rowsPerPage);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    if (status === 'Dijana') {
      return 'bg-green-200 text-green-500 border rounded-full';
    }
    if (status === 'Diproses') {
      return 'bg-yellow-200 text-yellow-500 border rounded-full';
    }
    return '';
  };

  return (
    <AuthenticatedLayout>
      <Head title="TVPSS | Jana Sijil" />
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="w-1/6 bg-white shadow-lg">
          <StateAdminSideBar />
        </div>
        <div className="w-full md:ml-[120px] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900 bg-clip-text mb-4">
              Jana Sijil Pengguna
            </h2>
          </div>
          <div className="flex items-center justify-between mb-6">
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-gray-600">
                <li>
                  <a href="/listSchoolCertificate" className="text-[#4158A6] hover:text-blue-800 font-medium">
                    Jana Sijil Pelajar
                  </a>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-900 font-medium">
                  Semua Sekolah
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
                  placeholder="Cari Sekolah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-4">
                <FormControl variant="outlined" sx={{ minWidth: 160, borderRadius: 4 }}>
                  <InputLabel id="statusFilter-label">Status</InputLabel>
                  <Select
                    labelId="statusFilter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      fontSize: '1rem',
                      height: '50px',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' },
                    }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="Diproses">Diproses</MenuItem>
                    <MenuItem value="Dijana">Dijana</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 120, borderRadius: 4 }}>
                  <InputLabel id="rowsPerPage-label">Bilangan Data</InputLabel>
                  <Select
                    labelId="rowsPerPage-label"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    label="Bilangan Data"
                    sx={{
                      fontSize: '1rem',
                      height: '50px',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' },
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <table className="w-full text-left rounded-lg border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-6">Bil</th>
                  <th className="border-b px-4 py-6">Nama Sekolah</th>
                  <th className="border-b px-4 py-6">Kod Sekolah</th>
                  <th className="border-b px-4 py-6">Nama Pengetua</th>
                  <th className="border-b px-4 py-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentSchools.length > 0 ? (
                  currentSchools.map((school, index) => (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-6">{indexOfFirstSchool + index + 1}</td>
                      <td className="border-b px-4 py-6">{school.schoolName}</td>
                      <td className="border-b px-4 py-6">{school.schoolCode}</td>
                      <td className="border-b px-4 py-6">{school.schoolOfficer}</td>
                      
                      <td className="border-b px-4 py-6 text-center">
                        <Link
                          href="/certificate-Template-List"
                          className="text-blue-600 flex justify-center items-center"
                        >
                          <FaEye className="text-xl color-[blue]" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Tiada Data Ditemui
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handlePrevPage}
                                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-600 font-medium disabled:opacity-50 ${
                                    currentPage === 1 && "cursor-not-allowed"
                                }`}
                                disabled={currentPage === 1}
                            >
                                Sebelum
                            </button>
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#455185] font-semibold shadow-sm text-sm">
                                Halaman {currentPage} daripada {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-600 font-medium disabled:opacity-50 ${
                                    currentPage === totalPages && "cursor-not-allowed"
                                }`}
                                disabled={currentPage === totalPages}
                            >
                                Seterusnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </AuthenticatedLayout>
  );
}
