import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SuperAdminSideBar from "../SuperAdminSideBar";
export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Profile" />

    <div className="flex flex-col md:flex-row min-h-screen bg-white">
    <div className="w-1/6 bg-white shadow-lg">
    <SuperAdminSideBar />
        </div>

        <div className="w-full md:ml-[120px] p-6">
        <div className="flex items-center justify-between ">
          </div>
        <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/profileSuperAdmin" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Tetapan
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Kemaskini Pengguna
                            </li>
                        </ol>
                    </nav>
            
            <div className="p-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white border p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white border p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

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
