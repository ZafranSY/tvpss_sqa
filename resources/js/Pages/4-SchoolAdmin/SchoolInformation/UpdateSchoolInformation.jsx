import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SchoolAdminSideBar from '../SchoolAdminSideBar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const states = [
    'Johor', 'Melaka', 'Pahang', 'Wilayah Persekutuan Kuala Lumpur', 'Selangor',
    'Negeri Sembilan', 'Perak', 'Kedah', 'Pulau Pinang', 'Perlis', 'Kelantan',
    'Terengganu', 'Sabah', 'Sarawak',
];

const districts = {
    Johor: ['Johor Bahru', 'Muar', 'Kluang', 'Segamat', 'Mersing', 'Kota Tinggi', 'Batu Pahat', 'Pontian', 'Pasir Gudang', 'Tangkak', 'Kulaijaya'],
    Pahang: ['Kuantan', 'Temerloh', 'Bera', 'Pekan', 'Rompin', 'Maran', 'Jerantut', 'Bentong'],
    'Wilayah Persekutuan Kuala Lumpur': ['Kuala Lumpur'],
    Selangor: ['Petaling', 'Hulu Langat', 'Sepang', 'Klang', 'Gombak', 'Kuala Selangor', 'Sabak Bernam', 'Selayang'],
    'Negeri Sembilan': ['Seremban', 'Port Dickson', 'Rembau', 'Jelebu', 'Tampin', 'Gemenceh'],
    Perak: ['Ipoh', 'Kuala Kangsar', 'Taiping', 'Teluk Intan', 'Sitiawan', 'Parit Buntar', 'Tanjung Malim', 'Kampar'],
    Kedah: ['Alor Setar', 'Sungai Petani', 'Kuala Kedah', 'Kulim', 'Baling', 'Langkawi', 'Pokok Sena', 'Kubang Pasu'],
    'Pulau Pinang': ['Georgetown', 'Bukit Mertajam', 'Nibong Tebal', 'Balik Pulau'],
    Perlis: ['Kangar', 'Arau'],
    Kelantan: ['Kota Bharu', 'Tumpat', 'Pasir Mas', 'Machang', 'Tanah Merah', 'Gua Musang', 'Kuala Krai'],
    Terengganu: ['Kuala Terengganu', 'Dungun', 'Kemaman', 'Besut', 'Hulu Terengganu', 'Marang'],
    Sabah: ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Keningau', 'Beaufort', 'Lahad Datu', 'Semporna', 'Ranau', 'Papar'],
    Sarawak: ['Kuching', 'Sibu', 'Miri', 'Bintulu', 'Sri Aman', 'Mukah', 'Betong', 'Limbang'],
};

export default function UpdateSchoolInformation({ schoolInfo }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        schoolCode: schoolInfo?.schoolCode || '',
        schoolName: schoolInfo?.schoolName || '',
        schoolAddress1: schoolInfo?.schoolAddress1 || '',
        schoolAddress2: schoolInfo?.schoolAddress2 || '',
        postcode: schoolInfo?.postcode || '',
        state: schoolInfo?.state || '',
        district: schoolInfo?.district || '',
        noPhone: schoolInfo?.noPhone || '',
        schoolEmail: schoolInfo?.schoolEmail || '',
        noFax: schoolInfo?.noFax || '',
        schoolLogo: null,
        linkYoutube: schoolInfo?.linkYoutube || '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [currentDistricts, setCurrentDistricts] = useState([]);

    useEffect(() => {
        if (schoolInfo?.schoolLogo) {
            setImagePreview(`${schoolInfo.schoolLogo}`);
        }

        if (data.state) {
            setCurrentDistricts(districts[data.state] || []);
        }
    }, [data.state, schoolInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    
        if (name === 'state') {
            setCurrentDistricts(districts[value] || []);
            setData(prevData => ({
                ...prevData,
                district: ''
            }));
        }
    };    

    const handleFileChange = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            setData('schoolLogo', files[0]);

            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(files[0]);
        } else {
            setData('schoolLogo', null);
            setImagePreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('school.update'), {
            onSuccess: () => {
                console.log('School information updated successfully!');
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleCancel = () => {
        reset();
        setImagePreview(schoolInfo?.schoolLogo ? `${schoolInfo.schoolLogo}` : null);
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="TVPSS | Kemaskini Maklumat Sekolah" />
            <div className="flex min-h-screen bg-white">
                <SchoolAdminSideBar />
                <div className="flex-1 p-8 ml-[350px]"> 
                    {/* Breadcrumb Section */}
                    <div className="w-full p-6">
                        <div className="flex items-center text-left">
                            <nav className="mb-8">
                                <ol className="flex items-center space-x-2 text-gray-600">
                                    <li>
                                        <a href="/updateSchool" className="text-[#4158A6] hover:text-blue-800 font-5xl">
                                        Informasi Sekolah
                                            
                                        </a>
                                        </li>
                                        <li className="text-gray-500">/</li>
                                        <li className="text-gray-900 font-medium">
                                        Kemaskini Maklumat Sekolah
                                    </li>
                                    
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md border border-gray-200 p-8">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Maklumat Sekolah</h3>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Logo Upload Section */}
                            <div className="mb-8 text-center">
                                <input
                                    type="file"
                                    name="schoolLogo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="schoolLogoUpload"
                                />
                                <div
                                    className="relative w-48 h-48 mx-auto bg-gray-100 border-4 border-solid border-blue-900 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => document.getElementById('schoolLogoUpload').click()}
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Logo Sekolah Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                                            Tiada logo tersedia
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Klik untuk memuat naik logo baharu (tidak wajib).
                                </div>
                            </div>
                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <Box className="col-span-2">
                                    <TextField
                                        label="Kod Sekolah"
                                        variant="outlined"
                                        fullWidth
                                        name="schoolCode"
                                        value={data.schoolCode}
                                        onChange={handleInputChange}
                                        error={!!errors.schoolCode}
                                        helperText={errors.schoolCode}
                                    />
                                </Box>
                                <Box className="col-span-2">
                                    <TextField
                                        label="Nama Sekolah"
                                        variant="outlined"
                                        fullWidth
                                        name="schoolName"
                                        value={data.schoolName}
                                        onChange={handleInputChange}
                                        error={!!errors.schoolName}
                                        helperText={errors.schoolName}
                                    />
                                </Box>
                                <Box className="col-span-1">
                                    <TextField
                                        label="Alamat Sekolah 1"
                                        variant="outlined"
                                        fullWidth
                                        name="schoolAddress1"
                                        value={data.schoolAddress1}
                                        onChange={handleInputChange}
                                        error={!!errors.schoolAddress1}
                                        helperText={errors.schoolAddress1}
                                    />
                                </Box>
                                <Box className="col-span-1">
                                    <TextField
                                        label="Alamat Sekolah 2"
                                        variant="outlined"
                                        fullWidth
                                        name="schoolAddress2"
                                        value={data.schoolAddress2}
                                        onChange={handleInputChange}
                                        error={!!errors.schoolAddress2}
                                        helperText={errors.schoolAddress2}
                                    />
                                </Box>
                                <Box className="col-span-1">
                                    <TextField
                                        label="Poskod"
                                        variant="outlined"
                                        fullWidth
                                        name="postcode"
                                        value={data.postcode}
                                        onChange={handleInputChange}
                                        error={!!errors.postcode}
                                        helperText={errors.postcode}
                                    />
                                </Box>
                                <Box className="col-span-1">
                                    <TextField
                                        select
                                        label="Negeri"
                                        variant="outlined"
                                        fullWidth
                                        name="state"
                                        value={data.state}
                                        onChange={handleInputChange}
                                        error={!!errors.state}
                                        helperText={errors.state}
                                    >
                                        {states.map((state) => (
                                            <MenuItem key={state} value={state}>
                                                {state}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box className="col-span-2">
                                    <TextField
                                        select
                                        label="Daerah"
                                        variant="outlined"
                                        fullWidth
                                        name="district"
                                        value={data.district}
                                        onChange={handleInputChange}
                                        error={!!errors.district}
                                        helperText={errors.district}
                                        disabled={!currentDistricts.length}
                                    >
                                        {currentDistricts.map((district) => (
                                            <MenuItem key={district} value={district}>
                                                {district}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </div>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <Box>
                                    <TextField
                                        label="No. Telefon"
                                        variant="outlined"
                                        fullWidth
                                        name="noPhone"
                                        value={data.noPhone}
                                        onChange={handleInputChange}
                                        error={!!errors.noPhone}
                                        helperText={errors.noPhone}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        label="Emel Sekolah"
                                        variant="outlined"
                                        fullWidth
                                        name="schoolEmail"
                                        value={data.schoolEmail}
                                        onChange={handleInputChange}
                                        error={!!errors.schoolEmail}
                                        helperText={errors.schoolEmail}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        label="No. Faks"
                                        variant="outlined"
                                        fullWidth
                                        name="noFax"
                                        value={data.noFax}
                                        onChange={handleInputChange}
                                        error={!!errors.noFax}
                                        helperText={errors.noFax}
                                    />
                                </Box>
                            </div>
                            {/* Button Group */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="py-2 px-6 bg-gray-500 text-white rounded-md"
                                    onClick={handleCancel}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-6 bg-[#455185] text-white rounded-md"
                                    disabled={processing}
                                >
                                    {processing ? 'Mengemaskini...' : 'Kemaskini'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
