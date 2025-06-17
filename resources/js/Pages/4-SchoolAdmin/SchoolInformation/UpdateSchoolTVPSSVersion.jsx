import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SchoolAdminSideBar from '../SchoolAdminSideBar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const states = [
    'Sila Pilih', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
    'Pulau Pinang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor',
    'Terengganu', 'Wilayah Persekutuan Kuala Lumpur', 'Wilayah Persekutuan Labuan', 
    'Wilayah Persekutuan Putrajaya',
];

const districts = {
    'Sila Pilih': ['Sila Pilih'],
    Johor: ['Johor Bahru', 'Muar', 'Kluang', 'Segamat', 'Mersing', 'Kota Tinggi', 'Batu Pahat', 'Pontian', 'Pasir Gudang', 'Tangkak', 'Kulaijaya'],
    Kedah: ['Alor Setar', 'Sungai Petani', 'Kulim', 'Langkawi', 'Baling', 'Kubang Pasu'],
    Kelantan: ['Kota Bharu', 'Tumpat', 'Pasir Mas', 'Machang', 'Tanah Merah', 'Gua Musang', 'Kuala Krai'],
    Melaka: ['Melaka Tengah', 'Alor Gajah', 'Jasin'],
    'Negeri Sembilan': ['Seremban', 'Port Dickson', 'Rembau', 'Jelebu', 'Tampin', 'Kuala Pilah'],
    Pahang: ['Kuantan', 'Temerloh', 'Bera', 'Pekan', 'Rompin', 'Maran', 'Jerantut', 'Bentong'],
    'Pulau Pinang': ['George Town', 'Bukit Mertajam', 'Balik Pulau'],
    Perak: ['Ipoh', 'Taiping', 'Teluk Intan', 'Kuala Kangsar', 'Sitiawan', 'Kampar'],
    Perlis: ['Kangar', 'Arau'],
    Sabah: ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Keningau'],
    Sarawak: ['Kuching', 'Miri', 'Sibu', 'Bintulu'],
    Selangor: ['Shah Alam', 'Petaling Jaya', 'Subang Jaya', 'Klang', 'Kajang', 'Ampang'],
    Terengganu: ['Kuala Terengganu', 'Dungun', 'Kemaman', 'Besut', 'Hulu Terengganu'],
    'Wilayah Persekutuan Kuala Lumpur': ['Kuala Lumpur'],
    'Wilayah Persekutuan Labuan': ['Labuan'],
    'Wilayah Persekutuan Putrajaya': ['Putrajaya'],
};

export default function UpdateSchoolTVPSSVersion({ schoolInfo }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        schoolCode: schoolInfo?.schoolCode || '',
        schoolName: schoolInfo?.schoolName || '',
        schoolAddress1: schoolInfo?.schoolAddress1 || '',
        schoolAddress2: schoolInfo?.schoolAddress2 || '',
        postcode: schoolInfo?.postcode || '',
        state: schoolInfo?.state || 'Sila Pilih',
        district: schoolInfo?.district || 'Sila Pilih',
        noPhone: schoolInfo?.noPhone || '',
        schoolEmail: schoolInfo?.schoolEmail || '',
        noFax: schoolInfo?.noFax || '',
        schoolLogo: null,
        linkYoutube: schoolInfo?.linkYoutube || '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [currentDistricts, setCurrentDistricts] = useState(['Sila Pilih']);

    useEffect(() => {
        if (schoolInfo?.schoolLogo) {
            setImagePreview(`/${schoolInfo.schoolLogo}`);
        }

        setCurrentDistricts(districts[data.state] || ['Sila Pilih']);
    }, [data.state, schoolInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'state') {
            setCurrentDistricts(districts[value] || ['Sila Pilih']);
            setData(prevData => ({
                ...prevData,
                district: 'Sila Pilih',
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
        post(route('tvpss1Edit'), {
            onSuccess: () => {
                console.log('School version information updated!');
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleCancel = () => {
        reset();
        setImagePreview(schoolInfo?.schoolLogo ? `/images/${schoolInfo.schoolLogo}` : null);
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="TVPSS | Kemaskini Maklumat Sekolah" />
            <div className="flex min-h-screen bg-white">
                <SchoolAdminSideBar />
                <div className="flex-1 p-8 ml-[350px]">
                    {/* Breadcrumb Section*/}
                    <div className="mb-4">
                        <nav className="text-sm font-medium text-gray-500">
                            <ol className="list-reset flex">
                                <li>
                                    <a href="/updateSchoolTVPSSVersion" className="text-[#4158A6] hover:text-blue-800">Submit Versi TVPSS</a>
                                </li>
                                <li className="mx-2">/</li>
                                <li className="text-gray-500">Kemaskini Versi Sekolah</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md border border-gray-200 p-8">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Maklumat Versi Sekolah</h3>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                            Klik untuk Muat Naik Logo
                                        </div>
                                    )}
                                </div>
                                {errors.schoolLogo && (
                                    <div className="text-red-500 mt-2">{errors.schoolLogo}</div>
                                )}
                            </div>
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
                                        label="No Telefon"
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
                                        label="Email"
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
                                        label="No Fax"
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
                            <div className="mb-6">
                                <TextField
                                    label="Link Video (YouTube)"
                                    variant="outlined"
                                    fullWidth
                                    name="linkYoutube"
                                    value={data.linkYoutube}
                                    onChange={handleInputChange}
                                    error={!!errors.linkYoutube}
                                    helperText={errors.linkYoutube}
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-6 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition"
                                    onClick={handleCancel}
                                >
                                    Batal
                                </button>
                                <button
                                    className="px-6 py-2 bg-[#455185] text-white rounded-md shadow-md hover:bg-[#3d4674] transition"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Memproses...' : 'Kemaskini'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
