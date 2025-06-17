import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SchoolAdminSideBar from "../SchoolAdminSideBar";

export default function AddAchievement({ students = [] }) {
    const [formData, setFormData] = useState({
        type_of_achievement: "",
        type_of_application: "",
        date: "",
        details: "",
        supporting_file: null,
        ic_num: [""],
    });

    const [errors, setErrors] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "type_of_application") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                ic_num: value === "Individu" ? [""] : [""],
            }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleICChange = (index, value) => {
        const updatedICs = [...formData.ic_num];
        updatedICs[index] = value;

        setFormData((prevData) => ({ ...prevData, ic_num: updatedICs }));

        if (Array.isArray(students) && value.trim() !== "") {
            const filteredSuggestions = students.filter((student) =>
                student.ic_num.startsWith(value)
            );
            setSuggestions(filteredSuggestions);
            setActiveSuggestionIndex(index); // Track which input field the suggestions are for
        } else {
            setSuggestions([]);
            setActiveSuggestionIndex(null);
        }
    };

    const handleSuggestionClick = (index, suggestion) => {
        const updatedICs = [...formData.ic_num];
        updatedICs[index] = suggestion.ic_num;

        setFormData((prevData) => ({ ...prevData, ic_num: updatedICs }));
        setSuggestions([]); // Clear suggestions
        setActiveSuggestionIndex(null); // Reset active field
    };

    const addICField = () => {
        setFormData((prevData) => ({
            ...prevData,
            ic_num: [...prevData.ic_num, ""],
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, supporting_file: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "ic_num") {
                formData[key].forEach((ic, index) => data.append(`ic_num[${index}]`, ic));
            } else {
                data.append(key, formData[key]);
            }
        });
    
        router.post("/achievements", data, {
            onSuccess: () => {
                console.log("Achievement submitted successfully");
                router.get("/listAchievement"); // Redirect to the list after successful submission
            },
            onError: (err) => {
                console.error("Submission Error:", err); // Log the error
                setErrors(err);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Hantar Borang Pencapaian Pelajar" />
            <div className="flex">
                <div className="w-1/6 p-4 bg-gray-800 text-white min-h-screen">
                    <SchoolAdminSideBar />
                </div>
                <div className="flex-1 p-8 bg-white min-h-screen">
                    {/* Breadcrumb section */}
                    <div className="w-full p-6">
                        <div className="flex items-center text-left">
                            <nav className="mb-8">
                                <ol className="flex items-center space-x-2 text-gray-600">
                                    <li>
                                        <a href="/listAchievement" className="text-[#4158A6] hover:text-blue-800 font-medium">
                                            Pencapaian Pelajar
                                        </a>
                                    </li>
                                    <li className="text-gray-500">/</li>
                                    <li className="text-gray-900 font-medium">
                                        Hantar Borang Pencapaian Pelajar
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow"
                    >
                        <h2 className="text-lg font-semibold mb-4">Maklumat Pelajar</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Jenis Permohonan
                            </label>
                            <select
                                name="type_of_application"
                                value={formData.type_of_application}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">--Pilih Jenis Permohonan--</option>
                                <option value="Individu">Individu</option>
                                <option value="Berkumpulan">Berkumpulan</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Jenis Pencapaian
                            </label>
                            <select
                                name="type_of_achievement"
                                value={formData.type_of_achievement}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">--Pilih Jenis Pencapaian--</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Sukan">Sukan</option>
                                <option value="Kokurikulum">Kokurikulum</option>
                            </select>
                        </div>

                        {formData.ic_num.map((ic, index) => (
                            <div key={index} className="mb-4 relative">
                                <label className="block text-sm font-medium text-gray-700">
                                    Kad Pengenalan Pelajar {index + 1}
                                </label>
                                <input
                                    type="text"
                                    value={ic}
                                    onChange={(e) => handleICChange(index, e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {activeSuggestionIndex === index &&
                                    suggestions.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full">
                                            {suggestions.map((suggestion) => (
                                                <li
                                                    key={suggestion.ic_num}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSuggestionClick(index, suggestion)
                                                    }
                                                >
                                                    {suggestion.ic_num} - {suggestion.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        ))}

                        {formData.type_of_application === "Berkumpulan" && (
                            <button
                                type="button"
                                onClick={addICField}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md mb-4"
                            >
                                Tambah Nombor IC
                            </button>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Tarikh
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Maklumat Pencapaian
                            </label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Muat Naik Fail Sokongan
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#455185] text-white rounded-xl hover:bg-blue-700"
                            >
                                Hantar Borang Permohonan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
