import { Head, useForm } from "@inertiajs/react";
import { Briefcase, CheckCircle, Mail, MapPin, School, Send, User } from "lucide-react";
import { useState } from "react";
import StudentNavBar from "./StudentNavBar";

function ApplyCrew({ student }) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Initialize form data with student information
    const { data, setData, post, errors } = useForm({
        ic_num: student.ic_num || '',
        name: student.name || '',
        email: student.email || '',
        state: student.state || '',
        district: student.district || '',
        schoolName: student.schoolName || '',
        jawatan: '', 
    });

    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("student.applyCrewSubmit"), {
            onSuccess: () => {
                setIsModalVisible(true);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    // CSS styles
    const styles = {
        page: { 
            backgroundColor: "#f0f7ff", 
            minHeight: "100vh", 
            padding: "20px" 
        },
        formContainer: {
            maxWidth: "600px",
            margin: "20px auto",
            padding: "30px",
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        },
        formHeader: { textAlign: "center", marginBottom: "35px" },
        formTitle: { fontSize: "28px", fontWeight: "bold", color: "#2d3748" },
        formSubtitle: { color: "#718096", fontSize: "16px", lineHeight: "1.5" },
        formGroup: { position: "relative", marginBottom: "20px" },
        iconContainer: {
            position: "absolute",
            left: "12px",
            color: "#4158A6",
            height: "100%",
            display: "flex",
            alignItems: "center",
        },
        input: {
            width: "100%",
            padding: "12px 12px 12px 45px",
            fontSize: "16px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            backgroundColor: "#f8fafc",
            color: "#2d3748",
        },
        sectionTitle: {
            fontSize: "18px",
            fontWeight: "600",
            color: "#2d3748",
            marginTop: "30px",
            marginBottom: "20px",
            paddingBottom: "8px",
            borderBottom: "2px solid #e2e8f0",
        },
        button: {
            backgroundColor: "#4158A6",
            color: "#fff",
            padding: "14px 28px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "30px",
        },
        modal: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: isModalVisible ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
        },
        modalContent: {
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
        },
        checkIcon: { color: "#28a745", fontSize: "50px", marginBottom: "20px" },
        okButton: {
            backgroundColor: "#4158A6",
            color: "#fff",
            padding: "12px 24px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px",
        },
    };

    return (
        <div style={styles.page}>
            <Head title="TVPSS | Permohonan Krew TVPSS" />
            <StudentNavBar />

            <div style={styles.formContainer}>
                <div style={styles.formHeader}>
                    <h1 style={styles.formTitle}>Permohonan Krew TVPSS</h1>
                    <p style={styles.formSubtitle}>Sila isi maklumat anda dengan lengkap dan tepat</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.sectionTitle}>Maklumat Peribadi</div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            name="ic_num"
                            placeholder="Nombor Kad Pengenalan (000000-00-0000)"
                            style={styles.input}
                            value={data.ic_num}
                            readOnly
                            autoComplete="off"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama Pelajar"
                            style={styles.input}
                            value={data.name}
                            readOnly
                            autoComplete="off"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Pelajar"
                            style={styles.input}
                            value={data.email}
                            readOnly
                            autoComplete="email" 
                        />
                    </div>

                    <div style={styles.sectionTitle}>Maklumat Sekolah</div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            name="state"
                            placeholder="Negeri"
                            style={styles.input}
                            value={data.state}
                            readOnly
                            autoComplete="off"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            name="district"
                            placeholder="Daerah"
                            style={styles.input}
                            value={data.district}
                            readOnly
                            autoComplete="off"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <School size={18} />
                        </div>
                        <input
                            type="text"
                            name="schoolName"
                            placeholder="Nama Sekolah"
                            style={styles.input}
                            value={data.schoolName}
                            readOnly
                            autoComplete="off"
                        />
                    </div>

                    <div style={styles.sectionTitle}>Maklumat Jawatan</div>
                    <div style={styles.formGroup}>
                        <div style={styles.iconContainer}>
                            <Briefcase size={18} />
                        </div>
                        <select
                            id="jawatan"
                            name="jawatan"
                            style={styles.input}
                            value={data.jawatan}
                            onChange={handleInputChange}
                        >
                            <option value="">Pilih Jawatan Krew</option>
                            <option value="Jurukamera">Jurukamera</option>
                            <option value="Gaffer">Gaffer</option>
                            <option value="Penemuduga">Penemuduga</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>
                        <Send size={20} />
                        Hantar Permohonan
                    </button>
                </form>
            </div>

            <div style={styles.modal}>
                <div style={styles.modalContent}>
                    <CheckCircle size={50} style={styles.checkIcon} />
                    <h2>Pendaftaran Berjaya!</h2>
                    <p>Permohonan Krew TVPSS anda telah berjaya dihantar.</p>
                    <button onClick={handleCloseModal} style={styles.okButton}>
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplyCrew;
