import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    FiClipboard,
    FiLayers,
    FiMapPin,
    FiCalendar,
    FiSettings,
    FiAlertCircle,
    FiUpload,
    FiUser,
    FiX,
} from "react-icons/fi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PPDAdminSideBar from "../PPDAdminSideBar";
import { Inertia } from "@inertiajs/inertia";
import { formatDistanceToNow } from "date-fns";
import { router } from '@inertiajs/react';

export default function UpdateEquipmentPPD({
    equipment,
    eqLocation,
    followUps,
    schoolId,
}) {
    const [formData, setFormData] = useState({
        equipName: equipment?.equipName ?? "",
        equipType: equipment?.equipType ?? "",
        otherType:
            equipment?.equipType === "other" ? equipment?.otherType ?? "" : "",
        location: equipment?.location ?? "",
        acquired_date: equipment?.acquired_date ?? "",
        status: equipment?.status ?? "",
        followUpUpdatePPD: "",
        uploadBrEq: [],
    });

    const [statusOptions, setStatusOptions] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    /*const [showFollowUpSection, setShowFollowUpSection] = useState(
        formData.status === "Tidak Berfungsi"
    );*/
    const [wasTidakBerfungsi, setWasTidakBerfungsi] = useState(
        ["Tidak Berfungsi", "Penyelenggaraan"].includes(formData.status)
    );

    useEffect(() => {
        const fetchStatusOptions = async () => {
            try {
                const response = await fetch("/status-options");
                const data = await response.json();
                setStatusOptions(data.status);
            } catch (error) {
                console.error("Error fetching status options:", error);
            }
        };

        fetchStatusOptions();
    }, []);

    useEffect(() => {
        if (["Tidak Berfungsi", "Penyelenggaraan"].includes(formData.status)) {
            setWasTidakBerfungsi(true);
        }
    }, [formData.status]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (
            name === "status" &&
            ["Tidak Berfungsi", "Penyelenggaraan"].includes(value)
        ) {
            setWasTidakBerfungsi(true);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            uploadBrEq: files,
        }));

        const previews = files.map((file) => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const handleFollowUpSubmit = (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        formDataToSubmit.append(
            "followUpUpdatePPD",
            formData.followUpUpdatePPD || ""
        );

        if (formData.uploadBrEq?.length > 0) {
            formData.uploadBrEq.forEach((file) =>
                formDataToSubmit.append("uploadBrEq[]", file)
            );
        }

        console.log([...formDataToSubmit.entries()]);

        router.post(
            `/equipmentPPD/${equipment.id}/follow-up`,
            formDataToSubmit,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage("Follow-up successfully saved!");
                    setFormData((prev) => ({
                        ...prev,
                        followUpUpdatePPD: "",
                        uploadBrEq: [],
                    }));
                    setFilePreviews([]);
                },
                onError: (errors) => {
                    console.error("Validation Errors:", errors);
                    setErrors(errors);
                },
            }
        );
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true); // Set loading state to true
    
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("status", formData.status);
    
        try {
            await router.post(`/equipmentPPD/${equipment.id}/update`, formDataToSubmit);
            // If successful, redirect or show a success message
            router.get(`/eqManagementPPD/list/${schoolId}`);
        } catch (errors) {
            console.error("Validation Errors:", errors);
            setErrors(errors); // Handle errors
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const InputField = ({ icon: Icon, label, ...props }) => (
        <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl transition-all duration-300 group-hover:border-blue-400 bg-white shadow-sm">
                <Icon
                    className="text-gray-400 ml-4 group-hover:text-blue-500 transition-colors duration-300"
                    size={20}
                />
                <input
                    {...props}
                    className="block w-full px-4 py-3 text-gray-700 placeholder-gray-400 bg-transparent border-0 focus:ring-0 rounded-xl focus:outline-none"
                />
            </div>
            {errors[props.name] && (
                <p className="text-red-500 text-sm mt-1">
                    {errors[props.name]}
                </p>
            )}
        </div>
    );

    const SelectField = ({ icon: Icon, label, children, ...props }) => (
        <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl transition-all duration-300 group-hover:border-blue-400 bg-white shadow-sm">
                <Icon
                    className="text-gray-400 ml-4 group-hover:text-blue-500 transition-colors duration-300"
                    size={20}
                />
                <select
                    {...props}
                    className="block w-full px-4 py-3 text-gray-700 bg-transparent border-0 focus:ring-0 rounded-xl focus:outline-none appearance-none"
                >
                    {children}
                </select>
            </div>
            {errors[props.name] && (
                <p className="text-red-500 text-sm mt-1">
                    {errors[props.name]}
                </p>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Status Barang" />
            <div className="flex min-h-screen bg-gray-50">
                <div className="w-1/6 p-8 text-white">
                    <PPDAdminSideBar />
                </div>

                <div className="flex flex-1 gap-8 p-8">
                    {/* Form Section */}
                    <div className="flex-1">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                            <div className="p-8">
                                <h3 className="text-3xl font-bold text-gray-800 mb-8">
                                    Status Barang
                                </h3>

                                {message && (
                                    <div
                                        className={`p-4 mb-6 rounded-xl ${
                                            message.includes("berjaya")
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-red-50 text-red-700 border border-red-200"
                                        }`}
                                    >
                                        {message}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleStatusUpdate}
                                    className="space-y-6"
                                >
                                    <InputField
                                        icon={FiClipboard}
                                        label="Nama Barang"
                                        type="text"
                                        name="equipName"
                                        value={formData.equipName}
                                        readOnly
                                    />

                                    <SelectField
                                        icon={FiLayers}
                                        label="Jenis Barang"
                                        name="equipType"
                                        value={formData.equipType}
                                        disabled
                                    >
                                        <option value={formData.equipType}>
                                            {formData.equipType}
                                        </option>
                                    </SelectField>

                                    {formData.equipType === "other" && (
                                        <InputField
                                            icon={FiLayers}
                                            label="Jenis Lain"
                                            type="text"
                                            name="otherType"
                                            value={formData.otherType}
                                            onChange={handleInputChange}
                                            placeholder="Sila masukkan jenis peralatan lain"
                                        />
                                    )}

                                    <SelectField
                                        icon={FiMapPin}
                                        label="Lokasi"
                                        name="location"
                                        value={formData.location}
                                        disabled
                                    >
                                        <option value={formData.location}>
                                            {formData.location}
                                        </option>
                                    </SelectField>

                                    <InputField
                                        icon={FiCalendar}
                                        label="Tarikh Perolehan"
                                        type="date"
                                        name="acquired_date"
                                        value={formData.acquired_date}
                                        readOnly
                                    />

                                    <SelectField
                                        icon={FiSettings}
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Pilih Status</option>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </SelectField>

                                    <div className="flex justify-end space-x-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.get(`/eqManagementPPD/list/${schoolId}`)
                                        }
                                        className="px-6 py-3 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition-colors duration-300"
                                    >
                                        Batal
                                    </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                    Mengemaskini...
                                                </span>
                                            ) : (
                                                "Kemaskini"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Follow-ups Section */}
                    {/*{(formData.status === "Tidak Berfungsi" || wasTidakBerfungsi) && (*/}
                    {["Tidak Berfungsi", "Penyelenggaraan"].includes(
                        formData.status
                    ) || wasTidakBerfungsi ? (
                        <div className="w-2/5">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl sticky top-8">
                                <div className="p-6">
                                    <h4 className="text-2xl font-bold text-blue-700 bg-gray-50 p-4 rounded-xl mb-4">
                                        Follow-Up Updates
                                    </h4>

                                    {/* Add New Follow-Up Section */}

                                    <form onSubmit={handleFollowUpSubmit}>
                                        <div className="space-y-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                            <InputField
                                                icon={FiAlertCircle}
                                                label="Maklumat Kerosakan"
                                                type="text"
                                                name="followUpUpdatePPD"
                                                value={
                                                    formData.followUpUpdatePPD ||
                                                    ""
                                                }
                                                onChange={handleInputChange}
                                                placeholder="Maklumat Kerosakan Barang"
                                            />

                                            <div className="space-y-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Upload Images
                                                </label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <FiUpload className="w-12 h-12 mb-4 text-gray-400" />
                                                            <p className="mb-2 text-sm text-gray-500">
                                                                <span className="font-semibold">
                                                                    Click to
                                                                    upload
                                                                </span>{" "}
                                                                or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Maximum 2 images
                                                            </p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    {filePreviews.map(
                                                        (preview, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative group"
                                                            >
                                                                <img
                                                                    src={
                                                                        preview
                                                                    } // Use the correct variable
                                                                    alt={`Preview ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="w-full h-32 object-cover rounded-xl shadow-md"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        console.error(
                                                                            "Image failed to load:",
                                                                            preview
                                                                        );
                                                                        e.target.src =
                                                                            "/path-to-placeholder.jpg"; // Placeholder for missing images
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newPreviews =
                                                                                filePreviews.filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
                                                                                        i !==
                                                                                        index
                                                                                );
                                                                            setFilePreviews(
                                                                                newPreviews
                                                                            );
                                                                            const newFiles =
                                                                                Array.from(
                                                                                    formData.uploadBrEq
                                                                                ).filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
                                                                                        i !==
                                                                                        index
                                                                                );
                                                                            setFormData(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    uploadBrEq:
                                                                                        newFiles,
                                                                                })
                                                                            );
                                                                        }}
                                                                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors duration-300"
                                                                    >
                                                                        <FiX
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300"
                                                >
                                                    Save Follow-Up
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    <br />
                                    <hr />
                                    <br />

                                    {/* Existing Follow-Ups */}
                                    <div className="space-y-4">
                                        {followUps.map((update, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 rounded-xl p-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden">
                                                            <div className="w-full h-full bg-white flex items-center justify-center">
                                                                <FiUser
                                                                    className="text-gray-600"
                                                                    size={24}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-800 text-lg">
                                                                {
                                                                    update.user
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        update.created_at
                                                                    )
                                                                )}{" "}
                                                                ago
                                                            </span>
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-gray-700">
                                                                {update.content}
                                                            </p>
                                                        </div>
                                                        {update.uploadBrEq && (
                                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                                {JSON.parse(
                                                                    update.uploadBrEq
                                                                ).map(
                                                                    (
                                                                        image,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="relative group aspect-square"
                                                                        >
                                                                            <img
                                                                                src={`/storage/${image}`}
                                                                                alt={`Upload ${
                                                                                    idx +
                                                                                    1
                                                                                }`}
                                                                                className="w-full h-full object-cover rounded-lg shadow-sm"
                                                                                onError={(
                                                                                    e
                                                                                ) => {
                                                                                    console.error(
                                                                                        "Image failed to load:",
                                                                                        `/storage/${image}`
                                                                                    );
                                                                                    e.target.src =
                                                                                        "/path-to-placeholder.jpg";
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
