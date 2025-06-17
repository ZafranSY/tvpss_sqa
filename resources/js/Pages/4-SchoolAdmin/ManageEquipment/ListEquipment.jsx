import { useState } from "react";
import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SchoolAdminSideBar from "../SchoolAdminSideBar";
import { Inertia } from "@inertiajs/inertia";
import { router } from '@inertiajs/react';

export default function ListEquipment({ equipment, eqLocation }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchEquipment, setSearchEquipment] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const equipmentRowsPerPage = equipment.per_page;
    const equipmentCurrentPage = equipment.current_page;
    const totalEquipmentItems = equipment.total;
    const equipmentData = equipment.data;

    const locationRowsPerPage = 5;
    const [locationCurrentPage, setLocationCurrentPage] = useState(1);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
        router.get(`/equipment`, { sortField: field, sortOrder: order, search: searchEquipment });
    };

    const handleSearchEquipment = (e) => {
        const value = e.target.value;
        setSearchEquipment(value);
        router.get(`/equipment`, { search: value, sortField, sortOrder });
    };

    const handleSearchLocation = (e) => {
        setSearchLocation(e.target.value);
    };

    const handleDeleteSelected = () => {
        const confirmed = window.confirm("Padam barang yang dipilih?");
        if (confirmed) {
            router.delete(route("equipment.deleteSelected"), {
                ids: selectedItems,
            });
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const sortedLocations = eqLocation
        .filter((location) =>
            location.eqLocName.toLowerCase().includes(searchLocation.toLowerCase())
        )
        .slice(
            (locationCurrentPage - 1) * locationRowsPerPage,
            locationCurrentPage * locationRowsPerPage
        );

    const totalLocationItems = eqLocation.length;

    const nextLocationPage = () => {
        if (locationCurrentPage < Math.ceil(totalLocationItems / locationRowsPerPage)) {
            setLocationCurrentPage(locationCurrentPage + 1);
        }
    };

    const prevLocationPage = () => {
        if (locationCurrentPage > 1) {
            setLocationCurrentPage(locationCurrentPage - 1);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Pengurusan Bilangan Barang" />
            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                {/* Sidebar */}
                <div className="w-1/6 bg-white shadow-lg">
                    <SchoolAdminSideBar />
                </div>

                {/* Main Content */}
                <div className="w-full md:ml-[120px] p-6">
                    {/* Breadcrumb Section */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/listEquipment" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                    Pengurusan Peralatan
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">
                                Semua Peralatan
                            </li>
                        </ol>
                    </nav>

                    {/* Equipment Section */}
                    <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                placeholder="Cari Nama Peralatan"
                                value={searchEquipment}
                                onChange={handleSearchEquipment}
                                className="w-full max-w-xs pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                            />
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => (window.location.href = "/equipment/create")}
                                    className="bg-[#455185] hover:bg-[#3C4565] text-white rounded-md px-4 py-2 shadow-md"
                                >
                                    Tambah Barang
                                </button>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 shadow-md"
                                    disabled={selectedItems.length === 0}
                                >
                                    Padam Barang
                                </button>
                            </div>
                        </div>

                        <table className="w-full text-left rounded-lg border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="border-b px-4 py-6">
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                                setSelectedItems(
                                                    e.target.checked ? equipmentData.map((item) => item.id) : []
                                                )
                                            }
                                            checked={selectedItems.length === equipmentData.length}
                                        />
                                    </th>
                                    <th className="border-b px-4 py-6">Bil</th>
                                    <th
                                        className="border-b px-4 py-6 cursor-pointer"
                                        onClick={() => handleSort("name")}
                                    >
                                        Nama Peralatan
                                        {sortField === "name" && (sortOrder === "asc" ? " ▲" : " ▼")}
                                    </th>
                                    <th className="border-b px-4 py-6">Jenis</th>
                                    <th
                                        className="border-b px-4 py-6 cursor-pointer"
                                        onClick={() => handleSort("location")}
                                    >
                                        Lokasi
                                        {sortField === "location" && (sortOrder === "asc" ? " ▲" : " ▼")}
                                    </th>
                                    <th className="border-b px-4 py-6">Tarikh Diperolehi</th>
                                    <th className="border-b px-4 py-6">Status</th>
                                    <th className="border-b px-4 py-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipmentData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="border-b px-4 py-6">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectItem(item.id)}
                                                checked={selectedItems.includes(item.id)}
                                            />
                                        </td>
                                        <td className="border-b px-4 py-6">
                                            {index + 1 + (equipmentCurrentPage - 1) * equipmentRowsPerPage}
                                        </td>
                                        <td className="border-b px-4 py-6">{item.equipName}</td>
                                        <td className="border-b px-4 py-6">{item.equipType}</td>
                                        <td className="border-b px-4 py-6">{item.location}</td>
                                        <td className="border-b px-4 py-6">{item.acquired_date}</td>
                                        <td className="border-b px-4 py-6">
                                            <span
                                                className={`px-2 py-1 rounded-full ${
                                                    item.status === "Berfungsi"
                                                        ? "bg-green-200 text-green-700"
                                                        : item.status === "Penyelenggaraan"
                                                        ? "bg-yellow-200 text-yellow-700"
                                                        : "bg-red-200 text-red-700"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="border-b px-4 py-6 flex space-x-4 items-center">
                                            <button
                                                onClick={() => router.get(`/equipment/${item.id}/edit`)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const confirmed = window.confirm("Padam barang?");
                                                    if (confirmed) {
                                                        router.delete(`/equipment/${item.id}`);
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Location Section */}
                    <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                placeholder="Cari Lokasi"
                                value={searchLocation}
                                onChange={handleSearchLocation}
                                className="w-full max-w-xs pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                            />
                            <button
                                onClick={() => (window.location.href = "/eqLoc/create")}
                                className="bg-[#455185] hover:bg-[#3C4565] text-white rounded-md px-4 py-2 shadow-md"
                            >
                                Tambah Lokasi
                            </button>
                        </div>

                        <table className="w-full text-left rounded-lg border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="border-b px-4 py-6">Bil</th>
                                    <th
                                        className="border-b px-4 py-6 cursor-pointer"
                                        onClick={() => handleSort("eqLocName")}
                                    >
                                        Nama Lokasi
                                    </th>
                                    <th className="border-b px-4 py-6">Jenis Lokasi</th>
                                    <th className="border-b px-4 py-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLocations.map((location, index) => (
                                    <tr key={location.id} className="hover:bg-gray-50">
                                        <td className="border-b px-4 py-6">
                                            {index + 1 + (locationCurrentPage - 1) * locationRowsPerPage}
                                        </td>
                                        <td className="border-b px-4 py-6">{location.eqLocName}</td>
                                        <td className="border-b px-4 py-6">{location.eqLocType}</td>
                                        <td className="border-b px-4 py-6 flex space-x-4 items-center">
                                            <button
                                                onClick={() => router.get(`/eqLoc/${location.id}/edit`)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const confirmed = window.confirm("Padam lokasi?");
                                                    if (confirmed) {
                                                        router.delete(`/eqLoc/${location.id}`);
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
