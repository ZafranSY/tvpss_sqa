import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import StateAdminSideBar from '../StateAdminSideBar';
import { Upload } from 'lucide-react';
import { Link } from '@inertiajs/react';
export default function CertificateTemplateForm(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        file: null,
    });

    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleFileChange = (e) => {
        setData('file', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('uploadTemplate'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Muat Naik Template" />
            
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                <div className="w-1/5 bg-white shadow-lg">
                    <StateAdminSideBar />
                </div>

                <div className="flex-1 p-8">
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/generateCertificate" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Jana Sijil
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Muat Naik Template
                            </li>
                        </ol>
                    </nav>

                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Template
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Masukkan nama template"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fail Sijil Template
                                </label>
                                <div className="mt-1 flex justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-4 flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                <span>Muat Naik Fail</span>
                                                <input
                                                    type="file"
                                                    name="file"
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                    required
                                                />
                                            </label>
                                            <p className="pl-1">atau seret dan lepas</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG sehingga 10MB</p>
                                    </div>
                                </div>
                                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                            <button
    type="button"
    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
>
    <Link href={route('certList')}>Batal</Link>
</button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 text-sm font-medium text-white bg-[#4158A6] rounded-lg hover:bg-[#3C4565] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Sedang Dimuat Naik...' : 'Muat Naik Template'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
