import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SchoolAdminSideBar from "../SchoolAdminSideBar";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Profile" />

            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                {/* Sidebar */}
                <div className="w-1/6 bg-white shadow-lg">
                    <SchoolAdminSideBar />
                </div>

                {/* Main Content */}
                <div className="w-full md:ml-[120px] p-6">
                    {/* Page Title */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-bold text-gray-900 bg-clip-text mb-4"></h2>
                    </div>

                    {/* Breadcrumb Navigation */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/profileSchoolAdmin" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Tetapan
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Kemaskini Pengguna
                            </li>
                        </ol>
                    </nav>

                    {/* Forms Section */}
                    <div className="p-12">
                        <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                            {/* Update Profile Information Form */}
                            <div className="bg-white border p-4 shadow sm:rounded-lg sm:p-8">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>

                            {/* Update Password Form */}
                            <div className="bg-white border p-4 shadow sm:rounded-lg sm:p-8">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>

                            {/* Delete User Form */}
                            <div className="bg-white border p-4 shadow sm:rounded-lg sm:p-8">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
