import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Checkbox,
    Chip,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { ArrowForward, Done, Clear } from "@mui/icons-material";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import PPDAdminSideBar from "../PPDAdminSideBar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from '@inertiajs/react';

const ApprovePPDTvpss = () => {
    const { props } = usePage();
    const tvpssData = props?.tvpssData || {};

    const {
        schoolName = "N/A",
        officer = "N/A",
        info = {},
        currentVersion = 0,
        nextVersion = 0,
        schoolCode = "",
    } = tvpssData;

    const normalizeValue = (value) => (value || "").trim().toUpperCase();

    const descriptiveFields = [
        { label: "Logo TVPSS", value: info.isTvpssLogo },
        { label: "Corner/ Mini/ TV Studio", value: info.studio },
        { label: "Upload di YouTube", value: info.youtube },
        { label: "Rakaman dalam Sekolah", value: info.inSchoolRecording },
        {
            label: "Rakaman dalam dan luar Sekolah",
            value: info.outSchoolRecording,
        },
        { label: "Berkolaborat dengan agensi luar", value: info.collaboration },
        {
            label: "Penggunaan Teknologi 'Green Screen'",
            value: info.greenScreen,
        },
    ];

    const checkboxStates = descriptiveFields.reduce(
        (acc, field) => ({
            ...acc,
            [field.label]: normalizeValue(field.value) === "ADA",
        }),
        {}
    );
    
    const [openApproveModal, setOpenApproveModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);

    const openApproveDialog = () => setOpenApproveModal(true);
    const closeApproveDialog = () => setOpenApproveModal(false);

    const handleApprove = () => {
        router.post(`/tvpssInfoPPD/${schoolCode}/approve`, {}, {
            onSuccess: () => {
                alert("TVPSS has been approved!");
                closeApproveDialog(); 
            },
            onError: (error) => {
                console.error("Approval error:", error);
                alert("Failed to approve TVPSS.");
            },
        });
    };

    const openRejectDialog = () => setOpenRejectModal(true);
    const closeRejectDialog = () => setOpenRejectModal(false);

    const handleReject = () => {
        router.post(`/tvpssInfoPPD/${schoolCode}/reject`, {}, {
            onSuccess: () => {
                alert("TVPSS has been rejected!");
                closeRejectDialog(); // Close the modal on success
            },
            onError: (error) => {
                console.error("Rejection error:", error);
                alert("Failed to reject TVPSS.");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "#445184", // Updated blue color
                        fontSize: "2rem",
                        marginBottom: "0.1rem", // Reduced margin
                        ml: 5,
                    }}
                >
                    Info Status TVPSS
                </Typography>
            }
        >
            <Head title="TVPSS | Kemaskini TVPSS Sekolah" />
            <Box display="flex" height="100vh">
                {/* Sidebar */}
                <Box
                    width="20%"
                    bgcolor="#F4F6F9"
                    color="white"
                    minHeight="105vh"
                    p={3}
                    boxShadow="2px 0 15px rgba(0, 0, 0, 0.1)"
                >
                    <PPDAdminSideBar />
                </Box>

                {/* Main Content */}
                <Box width="80%" p={4} sx={{ backgroundColor: "#F4F6F9", borderRadius: "0 12px 12px 0", height: "105vh" }}>
                    {/* Breadcrumb */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#757575",
                            mb: 3,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "#445184" }}>
                            <a href="/tvpssInfoPPDList" className="text-[#445184] hover:underline">
                                Informasi TVPSS Sekolah
                            </a>
                        </Typography>
                        <Typography sx={{ mx: 1, color: "#757575" }}>›</Typography>
                        <Typography variant="body2" sx={{ color: "#757575" }}>
                            <a href="/tvpssInfoPPDList" className="text-[#445184] hover:underline">
                                Info Status TVPSS
                            </a>
                        </Typography>
                        <Typography sx={{ mx: 1, color: "#757575" }}>›</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#445184" }}>
                            {schoolName}
                        </Typography>
                    </Box>

                    {/* School Info Section */}
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#445184" }}>
                        Maklumat Sekolah
                    </Typography>

                    <Box display="flex" gap={4} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                        {/* Left Section */}
                        <Card
                            sx={{
                                flex: 1,
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                                borderRadius: "16px",
                                padding: "20px",
                                minHeight: "400px", // Ensures minimum height
                                height: "100%", // Ensures equal height
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                                },
                                mb: 4, // Added bottom margin
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        bgcolor: "#445184", // Updated blue color
                                        p: 3,
                                        borderRadius: "16px 16px 0 0",
                                        mb: 4,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "white",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        {schoolName}
                                    </Typography>
                                </Box>

                                {/* School Info */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 2,
                                        color: "#455A64",
                                    }}
                                >
                                    A. Info Sekolah
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Pegawai TVPSS Sekolah:{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            bgcolor: "#E3F2FD",
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            display: "inline-block",
                                        }}
                                    >
                                        {officer}
                                    </Box>
                                </Typography>

                                {/* TVPSS Info */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 2,
                                        color: "#455A64",
                                    }}
                                >
                                    B. Info TVPSS Sekolah
                                </Typography>
                                <Box mt={2}>
                                    {descriptiveFields.map((field, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            mb={2}
                                            sx={{
                                                "&:not(:last-child)": {
                                                    borderBottom: "1px solid #eee",
                                                    pb: 2,
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    flex: 1,
                                                    color: "#445184", // Updated blue color
                                                }}
                                            >
                                                {field.label} :
                                            </Typography>
                                            <Chip
                                                label={normalizeValue(field.value)}
                                                sx={{
                                                bgcolor: field.value === "Ada" ? "#E8F5E9" : "#FFEBEE", // Green background for "ADA", red for "TIADA"
                                                color: field.value === "Ada" ? "#388E3C" : "#D32F2F",   // Green text for "ADA", red for "TIADA"
                                                fontSize: "0.9rem",
                                                height: "30px",
                                                fontWeight: "normal",
                                                }}
                                                 size="small"
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Right Section */}
                        <Card
                            sx={{
                                flex: 1,
                                backgroundColor: "white",
                                textAlign: "center",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                                borderRadius: "16px",
                                padding: "20px",
                                minHeight: "400px", // Ensures minimum height
                                height: "100%", // Ensures equal height
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#445184", // Updated blue color
                                        mb: 2,
                                        fontSize: "1.2rem",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    PENUHI KEPERLUAN
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#607D8B",
                                        mb: 4,
                                        textDecoration: "underline",
                                    }}
                                >
                                    Naik Taraf Status Versi
                                </Typography>

                                <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={4}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "#445184", // Updated blue color
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {currentVersion}
                                    </Typography>
                                    <ArrowForward sx={{ color: "#445184", fontSize: "3rem" }} />
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            color: "#D32F2F", // Red for next version
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {nextVersion}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    {descriptiveFields.map((field, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checked={checkboxStates[field.label]}
                                                    disabled
                                                    sx={{
                                                        color: "#445184", // Updated blue color
                                                        "&.Mui-checked": {
                                                            color: "#445184", // Consistent blue on check
                                                        },
                                                    }}
                                                />
                                            }
                                            label={field.label}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "left",
                                                color: "#445184", // Updated blue color
                                                mb: 2,
                                                ml: 0,
                                                width: "100%",
                                                ".MuiFormControlLabel-label": {
                                                    fontSize: "1rem",
                                                    fontWeight: "normal",
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Box display="flex" justifyContent="space-between" gap={2} mt={4}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Done />}
                                        fullWidth
                                        onClick={openApproveDialog}
                                        sx={{
                                            bgcolor: "#445184",  // Updated blue color
                                            "&:hover": {
                                                bgcolor: "#3c4f88",  // Darker blue for hover effect
                                            },
                                            fontWeight: "bold",
                                            borderRadius: "12px",
                                            textTransform: "capitalize",
                                            padding: "10px 20px",
                                        }}
                                    >
                                        Diterima
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Clear />}
                                        fullWidth
                                        onClick={openRejectDialog}
                                        sx={{
                                            bgcolor: "#F44336",  // Red color
                                            "&:hover": {
                                                bgcolor: "#E53935", // Darker red for hover
                                            },
                                            fontWeight: "bold",
                                            borderRadius: "12px",
                                            textTransform: "capitalize",
                                            padding: "10px 20px",
                                        }}
                                    >
                                        Ditolak
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    
                     {/* Approve Modal */}
                    <Dialog open={openApproveModal} onClose={closeApproveDialog}>
                        <DialogTitle>Pengesahan Pelulusan</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Adakah anda pasti untuk meluluskan maklumat ini bagi {schoolName}?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={closeApproveDialog}
                                sx={{
                                    borderRadius: "8px",
                                    padding: "10px 20px",
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                    backgroundColor: "#E0E0E0",
                                    color: "#000",
                                    "&:hover": {
                                        backgroundColor: "#BDBDBD",
                                        color: "#FFF",
                                    },
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleApprove}
                                sx={{
                                    borderRadius: "8px",
                                    padding: "10px 20px",
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                    backgroundColor: "#445184",
                                    color: "#FFF",
                                    "&:hover": {
                                        backgroundColor: "#3c4f88",
                                        color: "#FFF",
                                    },
                                }}
                            >
                                Ya, Terima
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Reject Modal */}
                    <Dialog open={openRejectModal} onClose={closeRejectDialog}>
                        <DialogTitle>Pengesahan Pembatalan</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Adakah anda pasti untuk menolak maklumat ini bagi {schoolName}?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={closeRejectDialog}
                                sx={{
                                    borderRadius: "8px",
                                    padding: "10px 20px",
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                    backgroundColor: "#E0E0E0",
                                    color: "#000",
                                    "&:hover": {
                                        backgroundColor: "#BDBDBD",
                                        color: "#FFF",
                                    },
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleReject}
                                sx={{
                                    borderRadius: "8px",
                                    padding: "10px 20px",
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                    backgroundColor: "#F44336",
                                    color: "#FFF",
                                    "&:hover": {
                                        backgroundColor: "#D32F2F",
                                        color: "#FFF",
                                    },
                                }}
                            >
                                Ya, Tolak
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
};

export default ApprovePPDTvpss;
