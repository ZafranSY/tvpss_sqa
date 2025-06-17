import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {
    Done,
    Clear,
} from "@mui/icons-material";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import StateAdminSideBar from "../StateAdminSideBar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from '@inertiajs/react'

const ApproveStateTvpss = () => {
    const { tvpssData = {} } = usePage().props;

    const {
        schoolName = "N/A",
        officer = "N/A",
        info = {},
        schoolCode = "",
    } = tvpssData;

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const normalizeValue = (value) => (value || "").trim().toUpperCase();

    const descriptiveFields = [
        { label: "Logo TVPSS", value: info.isTvpssLogo },
        { label: "Corner/ Mini/ TV Studio", value: info.studio },
        { label: "Upload di YouTube", value: info.youtube },
        { label: "Rakaman dalam Sekolah", value: info.inSchoolRecording },
        { label: "Rakaman dalam dan luar Sekolah", value: info.outSchoolRecording },
        { label: "Berkolaborat dengan agensi luar", value: info.collaboration },
        { label: "Penggunaan Teknologi 'Green Screen'", value: info.greenScreen },
    ];

    const handleApprove = () => {
        if (!schoolCode) {
            alert("School Code is missing. Unable to proceed.");
            return;
        }
        router.post(`/tvpssInfoState/${schoolCode}/approve`, {}, {
            onSuccess: () => {
                alert("TVPSS Version successfully approved!");
            },
            onError: (error) => {
                console.error("Approval error:", error);
                alert("Failed to approve TVPSS Version.");
            },
        });
    };

    const handleReject = () => {
        if (!schoolCode) {
            alert("School Code is missing. Unable to proceed.");
            return;
        }
        router.post(`/tvpssInfoState/${schoolCode}/reject`, {}, {
            onSuccess: () => {
                alert("TVPSS Version has been rejected!");
            },
            onError: (error) => {
                console.error("Rejection error:", error);
                alert("Failed to reject TVPSS Version.");
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
                        color: "#445184",
                        fontSize: "2rem",
                        marginBottom: "0.1rem",
                        ml: 5,
                    }}
                >
                    Info Status TVPSS
                </Typography>
            }
        >
            <Head title="TVPSS | Kemaskini TVPSS Sekolah" />
            <Box display="flex" height="100vh">
                <Box
                    width="20%"
                    bgcolor="#F4F6F9"
                    color="white"
                    minHeight="100vh"
                    p={3}
                    boxShadow="2px 0 15px rgba(0, 0, 0, 0.1)"
                >
                    <StateAdminSideBar />
                </Box>

                {/* Main Content */}
                <Box
                    width="80%"
                    p={4}
                    sx={{
                        backgroundColor: "#F4F6F9",
                        borderRadius: "0 12px 12px 0",
                        height: "100vh",
                    }}
                >
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
                            <a
                                href="/tvpssInfo"
                                className="text-[#445184] hover:underline"
                            >
                                Informasi TVPSS Sekolah
                            </a>
                        </Typography>
                        <Typography sx={{ mx: 1, color: "#757575" }}>›</Typography>
                        <Typography variant="body2" sx={{ color: "#757575" }}>
                            <a
                                href="/tvpssInfo"
                                className="text-[#445184] hover:underline"
                            >
                                Info Status TVPSS
                            </a>
                        </Typography>
                        <Typography sx={{ mx: 1, color: "#757575" }}>›</Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "#445184" }}
                        >
                            {schoolName}
                        </Typography>
                    </Box>

                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: "bold",
                            color: "#455185",
                        }}
                    >
                        Maklumat Sekolah
                    </Typography>

                    <Card
                        sx={{
                            mb: 4,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            borderRadius: "16px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    bgcolor: "#455185",
                                    p: 2,
                                    borderRadius: "16px",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "white",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {schoolName}
                                </Typography>
                            </Box>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: "bold",
                                    mb: 1,
                                }}
                            >
                                A. Info Sekolah
                            </Typography>
                            <Box
                                sx={{
                                    mb: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="body1">
                                    Pegawai TVPSS Sekolah:
                                </Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        bgcolor: "#E8EAF6",
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                    }}
                                >
                                    {officer}
                                </Box>
                            </Box>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: "bold",
                                    mb: 2,
                                }}
                            >
                                B. Info TVPSS Sekolah
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {descriptiveFields.map((field, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottom:
                                                index !==
                                                descriptiveFields.length - 1
                                                    ? "1px solid #eee"
                                                    : "none",
                                            pb: 1,
                                        }}
                                    >
                                        <Typography sx={{ color: "#666" }}>
                                            {field.label} :
                                        </Typography>
                                        <Chip
                                            label={normalizeValue(field.value)}
                                            sx={{
                                                bgcolor: field.value === "Ada" ? "#E8F5E9" : "#FFEBEE",
                                                color: field.value === "Ada" ? "#388E3C" : "#D32F2F",
                                                fontSize: "0.9rem",
                                                height: "30px",
                                                fontWeight: "normal",
                                            }}
                                            size="small"
                                        />
                                    </Box>
                                ))}
                            </Box>

                            {/* Buttons */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={2}
                                mt={4}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<Done />}
                                    fullWidth
                                    onClick={() => setIsApproveModalOpen(true)}
                                    sx={{
                                        bgcolor: "#445184",
                                        "&:hover": {
                                            bgcolor: "#3c4f88",
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
                                    onClick={() => setIsRejectModalOpen(true)}
                                    sx={{
                                        bgcolor: "#F44336",
                                        "&:hover": {
                                            bgcolor: "#E53935",
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
            </Box>

            {/* Approve Modal */}
            <Dialog
                open={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
            >
                <DialogTitle>Pengesahan Pelulusan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Adakah anda pasti untuk meluluskan maklumat ini?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsApproveModalOpen(false)}
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
            <Dialog
                open={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
            >
                <DialogTitle>Pengesahan Pembatalan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Adakah anda pasti untuk menolak maklumat ini?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsRejectModalOpen(false)}
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
        </AuthenticatedLayout>
    );
};

export default ApproveStateTvpss;
