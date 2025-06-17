import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import SuperAdminSideBar from '../SuperAdminSideBar';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { router } from '@inertiajs/react'

export default function ListUser({ auth, users, pagination, selectedRole }) {
    const [rowsPerPage, setRowsPerPage] = useState(pagination.per_page);
    const [currentPage, setCurrentPage] = useState(pagination.current_page);
    const [selectedRoleState, setSelectedRole] = useState(selectedRole);
    const [searchQuery, setSearchQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const usersData = users.data;

    const filteredUsers = usersData.filter((user) => {
        const searchFields = [
            user.name.toLowerCase(),
            user.email.toLowerCase(),
            user.state?.toLowerCase(),
            getRoleLabel(user.role).toLowerCase()
        ];
        return searchFields.some(field => field.includes(searchQuery.toLowerCase()));
    });

    const roleFilteredUsers = selectedRoleState
        ? filteredUsers.filter(user => user.role === Number(selectedRoleState))
        : filteredUsers;

    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = roleFilteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const nextPage = () => {
        if (currentPage < Math.ceil(roleFilteredUsers.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        setCurrentPage(1);
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (userToDelete && !isDeleting) {
            setIsDeleting(true);
            router.delete(`/users/${userToDelete}`, {
                onSuccess: () => {
                    handleCloseModal();
                    setIsDeleting(false);
                    alert('Pengguna berjaya dipadam!');
                },
                onError: (errors) => {
                    handleCloseModal();
                    setIsDeleting(false);
                    alert('Gagal memadam pengguna: ' + errors.message);
                },
            });
        }
    };

    const handleOpenModal = (userId) => {
        setUserToDelete(userId);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setUserToDelete(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Pengurusan Pengguna" />

            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                <div className="w-1/6 bg-white shadow-lg">
                    <SuperAdminSideBar />
                </div>

                <div className="w-full md:ml-[120px] p-6">
                    <div className="flex items-center justify-between ">
                        <h2 className="text-4xl font-bold text-gray-900 bg-clip-text mb-4">
                            Pengurusan Pengguna
                        </h2>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        {/* Breadcrumbs Section */}
                        <nav className="mb-8">
                            <ol className="flex items-center space-x-2 text-gray-600">
                                <li>
                                    <a href="/listUsers" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                        Pengurusan Pengguna
                                    </a>
                                </li>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-900 font-medium">
                                        Semua Pengguna
                                </li>
                            </ol>
                        </nav>

                        <a href="/addUser">
                            <Button
                                variant="contained"
                                sx={{
                                    background: "#4158A6",
                                    color: "white",
                                    padding: "10px 20px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    height: "40px",
                                    "&:hover": {
                                        background: "#3C4565",
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                                    },
                                }}
                            >
                                <FaUserPlus />
                                Tambah Pengguna Baharu
                            </Button>
                        </a>
                    </div>

                    <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl ">
                        <div className="flex items-center mb-4 justify-between">
                            <div className="flex items-center w-full max-w-xs relative">
                                <FaSearch className="absolute right-3 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Cari Pengguna..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <FormControl variant="outlined" sx={{ minWidth: 160, borderRadius: 4 }}>
                                    <InputLabel id="roleFilter-label" sx={{ fontSize: '0.875rem' }}>
                                        Jenis Pengguna
                                    </InputLabel>
                                    <Select
                                        labelId="roleFilter-label"
                                        id="roleFilter"
                                        value={selectedRoleState}
                                        onChange={handleRoleChange}
                                        label="Jenis Pengguna"
                                        sx={{
                                            fontSize: '1rem',
                                            height: '50px',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Semua</em>
                                        </MenuItem>
                                        <MenuItem value={0}>Super Admin</MenuItem>
                                        <MenuItem value={1}>State Admin</MenuItem>
                                        <MenuItem value={2}>PPD Admin</MenuItem>
                                        <MenuItem value={3}>School Admin</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl variant="outlined" sx={{ minWidth: 120, borderRadius: 4 }}>
                                    <InputLabel id="rowsPerPage-label" sx={{ fontSize: '0.875rem' }}>
                                        Bilangan Data
                                    </InputLabel>
                                    <Select
                                        labelId="rowsPerPage-label"
                                        id="rowsPerPage"
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        label="Bilangan Data"
                                        sx={{
                                            fontSize: '1rem',
                                            height: '50px',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderRadius: '12px',
                                            },
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
                                <tr className="bg-white">
                                    <th className="border-b px-4 py-6">Bil</th>
                                    <th className="border-b px-4 py-6">Nama Penuh</th>
                                    <th className="border-b px-4 py-6">Alamat Email</th>
                                    <th className="border-b px-4 py-6 text-center">Negeri</th>
                                    <th className="border-b px-4 py-6 text-center">Jenis Pengguna</th>
                                    <th className="border-b px-4 py-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            Tiada Data Ditemui
                                        </td>
                                    </tr>
                                ) : (
                                    currentUsers.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="border-b px-4 py-6">{index + 1}</td>
                                            <td className="border-b px-4 py-6">{user.name}</td>
                                            <td className="border-b px-4 py-6">{user.email}</td>
                                            <td className="border-b px-4 py-6 text-center">{user.state}</td>
                                            <td className="border-b px-4 py-6 text-center">
                                                <span
                                                    className={`px-2 py-1.5 rounded-full ${getRoleColor(user.role)}`}
                                                    style={{ color: getRoleTextColor(user.role) }}
                                                >
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="border-b px-6 py-4 text-center">
                                                <div className="flex justify-center items-center space-x-4">
                                                    <button
                                                        onClick={() => router.visit(`/users/${user.id}/edit`)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(user.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTrash size={18} />
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
                                onClick={prevPage}
                                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-600 font-medium disabled:opacity-50 ${currentPage === 1 && 'cursor-not-allowed'}`}
                                disabled={currentPage === 1}
                            >
                                Sebelum
                            </button>

                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#455185] font-semibold shadow-sm text-sm">
                                <span className="text-gray-600 mr-2">Halaman</span>
                                <span className="bg-white px-3 py-1 rounded-lg text-[#455185] shadow-md border border-gray-200 mx-1">
                                    {currentPage}
                                </span>
                                <span className="text-gray-600 ml-2">daripada</span>
                                <span className="bg-white px-3 py-1 rounded-lg text-[#455185] shadow-md border border-gray-200 mx-1">
                                    {Math.ceil(roleFilteredUsers.length / rowsPerPage)}
                                </span>
                            </span>

                            <button
                                onClick={nextPage}
                                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-gray-600 font-medium disabled:opacity-50 ${currentPage === Math.ceil(roleFilteredUsers.length / rowsPerPage) && 'cursor-not-allowed'}`}
                                disabled={currentPage === Math.ceil(roleFilteredUsers.length / rowsPerPage)}
                            >
                                Seterusnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Padam Pengguna</DialogTitle>
                <DialogContent>
                    <p>Adakah anda pasti ingin memadam pengguna ini?</p>
                </DialogContent>
                <DialogActions>
                        <Button 
                            onClick={handleCloseModal} 
                            color="primary"
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button 
                            onClick={handleDelete} 
                            color="primary"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Memproses...' : 'Ya, Padam'}
                        </Button>
                    </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}

function getRoleLabel(role) {
    switch (role) {
        case 0:
            return 'Super Admin';
        case 1:
            return 'State Admin';
        case 2:
            return 'PPD Admin';
        case 3:
            return 'School Admin';
        default:
            return 'Unknown';
    }
}

function getRoleColor(role) {
    switch (role) {
        case 0:
            return 'bg-blue-100 text-blue-700';
        case 1:
            return 'bg-green-100 text-green-700';
        case 2:
            return 'bg-yellow-100 text-yellow-700';
        case 3:
            return 'bg-purple-100 text-purple-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}

function getRoleTextColor(role) {
    switch (role) {
        case 0:
            return '#1D4ED8';
        case 1:
            return '#059669';
        case 2:
            return '#F59E0B';
        case 3:
            return '#7C3AED';
        default:
            return '#6B7280';
    }
}
