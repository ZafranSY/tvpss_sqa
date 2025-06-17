import React, { useState } from "react";
import { FaSearch, FaFileAlt } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StateAdminSideBar from "../StateAdminSideBar";

const GenerateCertificate = ({ school, students, achievements }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const totalPages = Math.ceil(students.length / rowsPerPage);

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

  // Filter students with achievements
  const studentsWithAchievements = students.filter((student) =>
    achievements.some((achievement) =>
      achievement.students.some((studentAchievement) => studentAchievement.student_id === student.id)
    )
  );

  // Filter achievements that are related to a student
  const achievementsForStudent = (student) => {
    return achievements.filter((achievement) =>
      achievement.students.some((studentAchievement) => studentAchievement.student_id === student.id)
    );
  };

  // Flatten all the students with their corresponding achievements
  const studentsWithMultipleAchievements = studentsWithAchievements.flatMap((student) => {
    const studentAchievements = achievementsForStudent(student);
    return studentAchievements.map((achievement) => ({
      student,
      achievement,
    }));
  });

  // Paginate the data
  const paginatedData = studentsWithMultipleAchievements.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleCheckboxChange = (studentId) => {
    setSelectedParticipants((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId); // Deselect
      } else {
        return [...prevSelected, studentId]; // Select
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Sidebar */}
        <div className="w-1/6 bg-white shadow-lg">
          <StateAdminSideBar />
        </div>

        {/* Main Content */}
        <div className="w-full md:ml-[120px] p-6">
          {/* Breadcrumb and Header Section */}
          <div className="flex justify-between items-center mb-6">
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-gray-600">
                <li>
                  <Link
                    href="/listSchoolCertificate"
                    className="text-[#4158A6] hover:text-blue-800 font-medium"
                  >
                    Jana Sijil Pelajar
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-900 font-medium">Semua Pelajar</li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-900 font-medium">
                {school.schoolCode}
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-900 font-medium">{school.schoolName}</li>
              </ol>
            </nav>

            <Link
              href="/certificate-Template-List"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold shadow-md ${
                selectedParticipants.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#4158A6] text-white hover:bg-[#3C4565]"
              }`}
              disabled={selectedParticipants.length === 0}
            >
              <FaFileAlt className="mr-2" />
              Jana Sijil
            </Link>
          </div>

          {/* Search and Table Section */}
          <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl">
            <div className="flex items-center mb-4 justify-between">
              <div className="flex items-center w-full max-w-xs relative">
                <FaSearch className="absolute right-3 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Cari Pelajar..."
                  className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <table className="w-full text-left rounded-lg border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-6">Pilih</th>
                  <th className="border-b px-4 py-6">Bil</th>
                  <th className="border-b px-4 py-6">Nama Penuh</th>
                  <th className="border-b px-4 py-6">Kad Pengenalan</th>
                  <th className="border-b px-4 py-6">Jenis Pencapaian</th>
                  <th className="border-b px-4 py-6">Jenis Permohonan</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry, index) => {
                  const { student, achievement } = entry;
                  return (
                    <tr key={student.id}>
                      <td className="border-b px-4 py-6">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(student.id)}
                          onChange={() => handleCheckboxChange(student.id)}
                          className="h-5 w-5"
                        />
                      </td>
                      <td className="border-b px-4 py-6">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="border-b px-4 py-6">{student.name}</td>
                      <td className="border-b px-4 py-6">{student.ic_num}</td>
                      <td className="border-b px-4 py-6">
                        {achievement?.type_of_achievement || "N/A"}
                      </td>
                      <td className="border-b px-4 py-6">
                        {achievement?.type_of_application || "N/A"}
                      </td>
                    </tr>
                  );
                })}
                {studentsWithMultipleAchievements.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      Tiada pelajar dijumpai
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Section */}
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
};

export default GenerateCertificate;
