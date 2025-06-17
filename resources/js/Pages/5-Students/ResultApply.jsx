import React, { useState, useEffect } from 'react';
import { Head } from "@inertiajs/react";
import { Eye, Search, Filter } from 'lucide-react';
import StudentNavBar from './StudentNavBar';

function ResultApply({ applications = [], students }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredApplications, setFilteredApplications] = useState(applications);
    const [selectedApplication, setSelectedApplication] = useState(null); // To track the selected application
    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility

    // useEffect to filter applications based on searchTerm
    useEffect(() => {
        const results = applications.filter(app =>
            Object.values(app).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        // Only update state if results have changed
        if (JSON.stringify(results) !== JSON.stringify(filteredApplications)) {
            setFilteredApplications(results);
        }
    }, [searchTerm, applications]);

    // Function to open the modal and set the selected application
    const openModal = (app) => {
        setSelectedApplication(app);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApplication(null);
    };

    const pageStyle = {
        backgroundColor: '#f0f7ff',
        minHeight: '100vh',
        padding: '20px',
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px',
    };

    const titleStyle = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const searchContainerStyle = {
        position: 'relative',
        width: '300px',
    };

    const searchInputStyle = {
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '15px',
        backgroundColor: '#f8fafc',
        transition: 'all 0.2s ease',
    };

    const tableContainerStyle = {
        overflow: 'auto',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        minWidth: '800px',
    };

    const thStyle = {
        backgroundColor: '#f8fafc',
        color: '#4a5568',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'left',
        borderBottom: '2px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        userSelect: 'none',
        whiteSpace: 'nowrap',
    };

    const tdStyle = (index) => ({
        padding: '16px',
        fontSize: '14px',
        color: '#4a5568',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff',
    });

    const statusBadgeStyle = (status) => ({
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        backgroundColor: status === 'Approved' ? '#dcfce7' : status === 'Permohonan Belum Diproses' ? '#fef08a' : '#fee2e2',
        color: status === 'Approved' ? '#166534' : status === 'Permohonan Belum Diproses' ? '#92400e' : '#991b1b',
        display: 'inline-block',
    });

    return (
        <div style={pageStyle}>
            <Head title="TVPSS | Keputusan Permohonan" />
            <StudentNavBar />
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>
                        <Filter size={24} color="#4158A6" /> Keputusan Permohonan
                    </h1>
                    <div style={searchContainerStyle}>
                        <input
                            type="text"
                            placeholder="Cari permohonan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={searchInputStyle}
                        />
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                </div>
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Jawatan</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((application, index) => (
                                    <tr key={application.id}>
                                        <td style={tdStyle(index)}>{index + 1}</td>
                                        <td style={tdStyle(index)}>{application.jawatan}</td>
                                        <td style={tdStyle(index)}>
                                            <span style={statusBadgeStyle(application.status)}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td style={tdStyle(index)}>
                                            <button
                                                style={{
                                                    backgroundColor: '#4158A6',
                                                    color: '#fff',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                }}
                                                onClick={() => openModal(application)}
                                            >
                                                <Eye size={16} /> Lihat
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                                        Tiada Sebarang Permohonan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedApplication && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            width: '400px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            textAlign: 'center',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ color: '#1a202c', marginBottom: '20px' }}>
                            {selectedApplication.status === 'Diluluskan'
                                ? 'Tahniah!'
                                : selectedApplication.status === 'Dalam Proses'
                                ? 'Masih Dalam Proses'
                                : 'Gagal'}
                        </h2>
                        <div
                            style={{
                                marginBottom: '20px',
                                color: '#1a202c',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                textAlign: 'left',
                            }}
                        >
                            <p><strong>Nama:</strong> {selectedApplication.name}</p>
                            <p><strong>Nombor ID:</strong> {selectedApplication.ic_num}</p>
                            <p><strong>Email:</strong> {selectedApplication.email}</p>
                            <p><strong>Jawatan:</strong> {selectedApplication.jawatan}</p>
                            <p><strong>Status:</strong> <span style={statusBadgeStyle(selectedApplication.status)}>{selectedApplication.status}</span></p>
                        </div>
                        {selectedApplication.status === 'Diluluskan' && (
                            <button
                                style={{
                                    backgroundColor: '#38a169',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cetak Slip
                            </button>
                        )}
                        <button
                            onClick={closeModal}
                            style={{
                                backgroundColor: '#718096',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResultApply;
