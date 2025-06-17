import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import SchoolAdminSideBar from '../SchoolAdminSideBar';
import { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button } from '@mui/material';
import { router } from '@inertiajs/react';

export default function AddEqLoc() {
    const [formData, setFormData] = useState({
        eqLocName: '',
        eqLocType: '',
        otherType: '' 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            eqLocType: formData.eqLocType === 'other' ? formData.otherType : formData.eqLocType 
        };

        router.post('/eqLoc', updatedFormData);
    };

    const handleCancel = () => {
        router.get('/listEquipment');
    };

    return (
        <AuthenticatedLayout

        >
            <Head title="TVPSS | Tambah Lokasi" />
            <div className="flex bg-white">
                {/* Sidebar */}
                <div className="w-1/6 p-8 text-white min-h-screen">
                    <SchoolAdminSideBar />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-white">
                    {/* Breadcrumb Section */}
                    <div className="w-full p-6">
                        <div className="flex items-center text-left">
                            <nav className="mb-8">
                                <ol className="flex items-center space-x-2 text-gray-600">
                                    <li>
                                        <a href="/listEquipment" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                            Pengurusan Peralatan
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-900 font-medium">
                                        Tambah Lokasi
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md border border-gray-200"
                    >
                        <Typography variant="h5" gutterBottom>
                            Tambah Lokasi
                        </Typography>

                        {/* Nama Lokasi */}
                        <TextField
                            fullWidth
                            margin="normal"
                            id="eqLocName"
                            name="eqLocName"
                            label="Nama Lokasi"
                            value={formData.eqLocName}
                            onChange={handleInputChange}
                        />

                        {/* Lokasi Type */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="eqLocType-label">Jenis Lokasi</InputLabel>
                            <Select
                                labelId="eqLocType-label"
                                id="eqLocType"
                                name="eqLocType"
                                value={formData.eqLocType}
                                onChange={handleInputChange}
                                label="Jenis Lokasi"
                            >
                                <MenuItem value="">Pilih Jenis Lokasi</MenuItem>
                                <MenuItem value="Computer Lab">Computer Lab</MenuItem>
                                <MenuItem value="Show Corner">Show Corner</MenuItem>
                                <MenuItem value="Mini Studio">Mini Studio</MenuItem>
                                <MenuItem value="Recording Corner">Recording Corner</MenuItem>
                                <MenuItem value="Broadcast Studio">Broadcast Studio</MenuItem>
                                <MenuItem value="Conference Room">Conference Room</MenuItem>
                                <MenuItem value="other">Lain-lain (Sila Nyatakan)</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Show the additional "Other" field if "Other" is selected */}
                        {formData.eqLocType === 'other' && (
                            <TextField
                                fullWidth
                                margin="normal"
                                id="otherType"
                                name="otherType"
                                label="Jenis Lokasi Lain"
                                value={formData.otherType}
                                onChange={handleInputChange}
                            />
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-6 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition"
                                onClick={handleCancel}
                            >
                                Batal
                            </button>
                            <button 
                                className="px-6 py-2 bg-[#455185] text-white rounded-md shadow-md hover:bg-[#3d4674] focus:outline-none focus:ring-2 focus:ring-[#455185] transition"
                                type="submit">
                                Hantar
                            </button>
                        </div>
                    </Box>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
