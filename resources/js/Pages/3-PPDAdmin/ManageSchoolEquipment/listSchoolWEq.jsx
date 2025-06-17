import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import PPDAdminSideBar from "../PPDAdminSideBar";
import { Inertia } from "@inertiajs/inertia";
import { router } from '@inertiajs/react'

export default function ListEquipmentPPD({ equipment, school }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchEquipment, setSearchEquipment] = useState("");

    const filteredEquipment = equipment.data.filter((item) =>
        item.equipName.toLowerCase().includes(searchEquipment.toLowerCase())
    );

    const handleSearchEquipment = (e) => {
        setSearchEquipment(e.target.value);
    };

    const handleDeleteSelected = () => {
        const confirmed = window.confirm("Padam barang yang dipilih?");
        if (confirmed) {
            selectedItems.forEach((id) => {
                router.delete(`/eqManagementPPD/${id}/delete`, { 
                    onSuccess: () => {
                        console.log(`Item ${id} deleted successfully.`);
                    },
                });
            });
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`TVPSS | Peralatan di ${school.schoolName}`} />
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
                {/* Sidebar */}
                <div className="w-1/6 bg-white shadow-lg">
                    <PPDAdminSideBar />
                </div>

                {/* Main Content */}
                <div className="w-full md:ml-[120px] p-6">
                    {/* Breadcrumb Section */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-gray-600">
                            <li>
                                <a href="/eqManagementListPPDSchool" className="text-[#455185] hover:text-blue-800 font-medium">
                                    Pengurusan Peralatan
                                </a>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-gray-900 font-medium">{school.schoolName}</li>
                        </ol>
                    </nav>

                    {/* Equipment Section */}
                    <div className="max-w-8xl mx-auto p-6 text-gray-900 bg-white border border-gray-200 shadow rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Cari Nama Peralatan"
                                    value={searchEquipment}
                                    onChange={handleSearchEquipment}
                                    className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#455185] focus:border-[#455185] transition-all placeholder-gray-400"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleDeleteSelected}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-3 shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={selectedItems.length === 0}
                                >
                                    Padam Barang
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left rounded-lg border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border-b px-6 py-4">
                                            <input
                                                type="checkbox"
                                                onChange={(e) =>
                                                    setSelectedItems(
                                                        e.target.checked ? equipment.data.map((item) => item.id) : []
                                                    )
                                                }
                                                checked={selectedItems.length === equipment.data.length}
                                                className="rounded border-gray-300 text-[#455185] focus:ring-[#455185]"
                                            />
                                        </th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600">Bil</th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600">Nama Peralatan</th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600">Jenis</th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600">Lokasi</th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600">Tarikh Diperolehi</th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                        <th className="border-b px-6 py-4 text-sm font-semibold text-gray-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEquipment.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleSelectItem(item.id)}
                                                    checked={selectedItems.includes(item.id)}
                                                    className="rounded border-gray-300 text-[#455185] focus:ring-[#455185]"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {index + 1 + (equipment.current_page - 1) * equipment.per_page}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.equipName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.equipType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.acquired_date}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        item.status === "Berfungsi"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.status === "Penyelenggaraan"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-3">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => router.get(`/eqManagementPPD/edit/${item.id}`)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => {
                                                            const confirmed = window.confirm(`Padam barang ${item.equipName}?`);
                                                            if (confirmed) {
                                                                router.delete(`/eqManagementPPD/${item.id}/delete`, {
                                                                    onSuccess: () => {
                                                                        console.log(`Item ${item.equipName} deleted successfully.`);
                                                                    },
                                                                });
                                                            }
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Padam"
                                                    >
                                                        <FaTrashAlt size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
