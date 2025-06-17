import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2, FileText, Search, Filter } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StateAdminSideBar from '../StateAdminSideBar';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react'

export default function CertificateTemplateList({ templates }) {
    
    const handleDelete = (id) => {
        if (confirm("Adakah anda pasti untuk membuang templat ini?")) {
            router.delete(route('certificate-templates.destroy', id), {
                onSuccess: () => {
                    router.get(route('/certList'));
                },
                onError: (errors) => {
                    // Handle errors if needed
                    console.error('Error deleting template:', errors);
                }
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Template List" />
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <div className="w-1/5">
                    <StateAdminSideBar />
                </div>

                <div className="flex-1 p-8">
                <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/generateCertificate" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Jana Sijil Pelajar
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Senarai Templat
                            </li>
                        </ol>
                    </nav>
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Senarai Templat</h1>
                                <p className="mt-1 text-sm text-gray-600">Urus dan kemaskini templat sijil anda</p>
                            </div>
                            <Link
                                href="/certificateTemplateUploadForm"
                                className="inline-flex items-center px-4 py-2 bg-[#4158A6] text-white rounded-lg hover:bg-[#3C4565] transition-colors shadow-sm"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Tambah Templat Baharu
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Cari templat..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                                        <Filter className="w-5 h-5 mr-2" />
                                        Tapis
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Nama Templat
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {templates.map(template => (
                                            <tr
                                                key={template.id}
                                                className="group hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-green-500 mr-3">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {template.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        <Link
                                                            href={route('certificate-templates.edit', template.id)}
                                                            className="p-2 text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(template.id)}
                                                            className="p-2 text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {templates.length === 0 && (
                                    <div className="py-16 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            Tiada Templat Dijumpai
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Mulakan dengan menambah templat baharu
                                        </p>
                                        <Link
                                            href="/certificateTemplateUploadForm"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <PlusCircle className="w-5 h-5 mr-2" />
                                            Tambah Templat
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
