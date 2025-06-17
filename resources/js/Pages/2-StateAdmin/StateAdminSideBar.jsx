import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react'; // Inertia Link
import { Menu, X, LogOut, PieChart, PrinterCheck, Settings, Info } from 'lucide-react';

function StateAdminSideBar() {
    const { url } = usePage(); // Get the current URL
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Toggle Sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 bg-[#455185] text-white p-2 rounded-lg shadow-lg"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 bg-[#f8f9fa] text-gray-800 h-screen p-6 flex flex-col z-40 border-r border-gray-200 transition-transform duration-300 ease-in-out 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 md:w-[340px]`}
            >
                {/* Logo Section */}
                <div className="mb-5 flex justify-left">
                    <img
                        src="/assets/TVPSSLogo.jpg"
                        alt="TVPSS Logo"
                        className="w-40 h-30 transition-transform duration-300 ease-in-out transform hover:scale-105"
                    />
                </div>

                {/* Menu Items */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                        Menu
                    </h3>
                    <nav className="space-y-4">
                        <SidebarLink
                            href="/dashboardState"
                            icon={<PieChart size={20} />}
                            label="Dashboard"
                            active={url.startsWith("/dashboardState")}
                        />
                        <SidebarLink
                            href="/certificate-Template-List"
                            icon={<PrinterCheck size={20} />}
                            label="Jana Sijil Pelajar"
                            active={url.startsWith("/certificate-Template-List")}
                        />
                        <SidebarLink
                            href="/tvpssInfo"
                            icon={<Info size={20} />}
                            label="Informasi TVPSS Sekolah"
                           // active={url.startsWith("/")}
                        />
                    </nav>
                </div>

                {/* Umum Section */}
                <div className="mt-auto">
                    <hr className="my-5 border-t border-gray-300" />
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                        Umum
                    </h3>
                    <nav className="space-y-4">
                        <SidebarLink
                            href="/profileStateAdmin"
                            icon={<Settings size={20} />}
                            label="Tetapan"
                            active={url.startsWith("/profileStateAdmin")}
                        />
                        {/* Log Out */}
                        <Link
                            href={route("logout")} // Ensure this route is defined
                            method="post"
                            className="flex items-center space-x-4 py-3 px-5 text-gray-400 hover:text-red-500 transition-all duration-200"
                        >
                            <LogOut size={20} />
                            <span className="text-lg font-medium">Log Keluar</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center space-x-5 py-2 px-5 rounded-2xl text-lg font-medium transition-all duration-200 ${
                active
                    ? "bg-[#f8f9fa] text-[#4158A6]" // Highlighted style
                    : "hover:bg-gray-100 text-gray-500"
            }`}
        >
            <div className="text-xl">{icon}</div>
            <span>{label}</span>
        </Link>
    );
}

export default StateAdminSideBar;
