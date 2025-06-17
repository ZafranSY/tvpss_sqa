import Dropdown from '@/Components/Dropdown';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children, noMaxWidth }) {
    const user = usePage().props.auth.user;

    const roleMap = {
        0: 'Super Admin',
        1: 'State Admin',
        2: 'PPD Admin',
        3: 'School Admin'
    };

    const role = roleMap[user.role] || 'Unknown Role';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-2">
                    <div className="flex h-30 justify-end items-center px-2 py-2 space-x-2">
                        {/* Notification Button
                        <button
                            type="button"
                            className="bg-white text-[#4158A6] hover:bg-gray-200 focus:outline-none rounded-xl p-2"
                            aria-label="Notifications"
                        >
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </button> */}

                        {/* Divider Line */}
                        <div className="w-px h-10 bg-gray-300 transform translate-x-2"></div>

                        {/* Profile Dropdown */}
                        <div className="relative ms-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex items-center rounded-md">
                                        <button
                                            type="button"
                                            className="flex items-center space-x-2 rounded-md border border-transparent bg-white px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {/* Initials Square */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4158A6] text-white font-bold">
                                                {user.initials || user.name.charAt(0) + user.name.charAt(1)}
                                            </div>

                                            {/* Name and Role */}
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-gray-800">{user.name}</span>
                                                <span className="text-xs text-gray-500">{role}</span>
                                            </div>

                                            {/* Arrow Icon */}
                                            <svg
                                                className="ml-1 h-5 w-5 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-2">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="mx-auto">
                {children}
            </main>
        </div>
    );
}