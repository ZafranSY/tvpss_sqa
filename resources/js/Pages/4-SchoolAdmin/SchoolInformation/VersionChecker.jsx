import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function VersionChecker() {
    const [criteria, setCriteria] = useState({});
    const [versionStatus, setVersionStatus] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch version checker data
        Inertia.get("/version-checker", {}, {
            onSuccess: ({ props }) => {
                setCriteria(props.criteria);
                setVersionStatus(props.version_status);
                setLoading(false);
            },
            onError: () => {
                console.error("Failed to fetch version checker data.");
                setLoading(false);
            },
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Version Checker</h2>}
        >
            <Head title="TVPSS | Version Checker" />
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md">
                    <h3 className="text-lg font-bold mb-4">Criteria</h3>
                    <ul className="mb-6">
                        <li className={criteria.hasName ? "text-green-600" : "text-red-600"}>
                            School Name: {criteria.hasName ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.hasLogo ? "text-green-600" : "text-red-600"}>
                            Logo: {criteria.hasLogo ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.hasStudioEquipment ? "text-green-600" : "text-red-600"}>
                            Corner/Mini Studio/TV Studio: {criteria.hasStudioEquipment ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.inSchoolRecording ? "text-green-600" : "text-red-600"}>
                            In-School Recording: {criteria.inSchoolRecording ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.uploadOnYouTube ? "text-green-600" : "text-red-600"}>
                            Upload on YouTube: {criteria.uploadOnYouTube ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.recordInsideOutsideSchool ? "text-green-600" : "text-red-600"}>
                            Recording Inside/Outside School: {criteria.recordInsideOutsideSchool ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.collaborateExternalAgencies ? "text-green-600" : "text-red-600"}>
                            Collaborate with External Agencies: {criteria.collaborateExternalAgencies ? "✔️" : "❌"}
                        </li>
                        <li className={criteria.usingGreenScreen ? "text-green-600" : "text-red-600"}>
                            Using Green Screen Technology: {criteria.usingGreenScreen ? "✔️" : "❌"}
                        </li>
                    </ul>

                    <h3 className="text-lg font-bold mb-4">Version Status</h3>
                    <ul>
                        <li className={versionStatus.version_1 ? "text-green-600" : "text-red-600"}>
                            Version 1: {versionStatus.version_1 ? "✔️ Achieved" : "❌ Not Achieved"}
                        </li>
                        <li className={versionStatus.version_2 ? "text-green-600" : "text-red-600"}>
                            Version 2: {versionStatus.version_2 ? "✔️ Achieved" : "❌ Not Achieved"}
                        </li>
                        <li className={versionStatus.version_3 ? "text-green-600" : "text-red-600"}>
                            Version 3: {versionStatus.version_3 ? "✔️ Achieved" : "❌ Not Achieved"}
                        </li>
                        <li className={versionStatus.version_4 ? "text-green-600" : "text-red-600"}>
                            Version 4: {versionStatus.version_4 ? "✔️ Achieved" : "❌ Not Achieved"}
                        </li>
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
