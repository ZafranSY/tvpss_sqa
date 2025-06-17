import React, { useState } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaCaretDown } from 'react-icons/fa';
import StateAdminSideBar from '../StateAdminSideBar'; // Ensure this is correctly imported
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from '@inertiajs/react';
export default function ListSchool() {

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-1/6 bg-[#2C3E50] text-white">
        <StateAdminSideBar />
      </div>

      <div className="flex-1 p-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-[#3498DB] text-white p-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold">Maklumat Pelajar</h3>
          </div>

          <div className="p-6 bg-gray-100 border-b">
            <div className="flex justify-between items-center space-x-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Cari Nama Pelajar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  {['Bil', 'IC Number', 'Nama Penuh', 'Tingkatan Pendidikan', 'Jenis Pencapaian', 'Maklumat Pencapaian'].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Tiada Data Ditemui
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student, index) => (
                    <tr key={student.id} className="border-b hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4">{indexOfFirstStudent + index + 1}</td>
                      <td className="px-6 py-4">{student.icNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{student.fullName}</td>
                      <td className="px-6 py-4 text-gray-600">{student.educationLevel}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.achievementType}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAchievementClick(student.achievementDetails)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Lihat Butiran Pencapaian
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-6 py-4 flex justify-between items-center border-t">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="text-gray-600 hover:text-blue-600 disabled:opacity-50 flex items-center"
              >
                <FaChevronLeft className="mr-2" /> Prev
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="text-gray-600 hover:text-blue-600 disabled:opacity-50 flex items-center"
              >
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
            <div className="text-gray-500 text-sm">
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      {achievementDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Maklumat Pencapaian</h3>
            <p>{achievementDetails}</p>
            <button
              onClick={() => setAchievementDetails(null)}
              className="mt-4 text-white bg-blue-500 px-4 py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
