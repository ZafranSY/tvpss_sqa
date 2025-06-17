import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import PPDAdminSideBar from './PPDAdminSideBar';
import { Box, Button, ToggleButtonGroup, ToggleButton } from '@mui/material'; // Import missing Material UI components
import DatePicker from "react-datepicker"; // Add DatePicker import
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { Download, Calendar, ChevronDown, FileBadge, Award, MapPinHouse, BookCheck, MonitorCheck, MonitorCheckIcon, Hourglass, UserPlus, FileText, Settings, Mail, Upload, CheckCircle, AlertCircle  } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend, PointElement, LineElement);

export default function PPDAdminDashboard() {
  const [timeRange, setTimeRange] = useState("Weekly");
  const [date, setDate] = useState(new Date());
  const [approvedCount, setApprovedCount] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);
  const [schoolsCount, setSchoolCount] = useState(null);
  const [rejectedCount, setRejectedCount] = useState(null);

  // Calculate total count
const totalCount = approvedCount + pendingCount + rejectedCount;

// Calculate percentages
const approvedPercentage = (approvedCount / totalCount) * 100;
const pendingPercentage = (pendingCount / totalCount) * 100;
const rejectedPercentage = (rejectedCount / totalCount) * 100;
  
  useEffect(() => {
    fetch("/ppd-admin-stats")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Add this line to inspect the response
        setApprovedCount(data.approved_tvpss_count ?? 0);
        setPendingCount(data.pending_tvpss_count ?? 0);
        setRejectedCount(data.rejected_tvpss_count ?? 0);
        setSchoolCount(data.schools_count ?? 0);
      })
      .catch((error) => {
        console.error("Error fetching school stats:", error);
      });
  }, []);

  const [selectedRegion, setSelectedRegion] = useState("Semua Negeri");

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange) setTimeRange(newTimeRange);
  };

  const CustomDateInput = ({ value, onClick }) => (
    <div className="relative" onClick={onClick}>
      <input
        type="text"
        value={value}
        className="px-4 py-2.5 pl-10 pr-10 bg-[#f8f9fa] border border-[#ddd] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        readOnly
      />

       <Calendar
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          color: "#374151",
          fontSize: "10px", // Icon size
        }}
      />
      <ChevronDown
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          color: "#374151",
          fontSize: "14px", // Arrow size
        }}
      />
    </div>
  );

    const barData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
            {
                label: 'Bilangan',
                data:  [approvedPercentage, pendingPercentage, rejectedPercentage],
                backgroundColor: ["#218838", "#ffc107", "#c82333"],
                borderColor: ["#218838", "#ffc107", "#c82333"],
                borderWidth: 1,
                borderRadius: 20,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return Number.isInteger(value) ? value : null; // Only show whole numbers
              },
            },
          },
        },
      };

    const doughnutData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
            {
                label: 'Jumlah (%)',
                data: [approvedPercentage, pendingPercentage, rejectedPercentage],
                backgroundColor: ["#218838", "#ffc107", "#c82333"],
                borderColor: ["#218838", "#ffc107", "#c82333"],
                borderWidth: 2,
                hoverOffset: 4,
            },
        ],
    };

    return (
        <AuthenticatedLayout>
            <Head title="TVPSS | Dashboard" />
            <div className="flex flex-col md:flex-row min-h-screen bg-white">
                <div className="w-1/6 bg-white shadow-lg">
                    <PPDAdminSideBar />
                </div>

                <div className="w-full md:ml-[120px] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-bold text-gray-900 bg-clip-text">Dashboard</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
            <p className="text-lg text-gray-700 mt-2">
              Selamat Datang ke Dashboard PPD Admin!
            </p>

                    <Box component="form" className="flex items-center space-x-4">
                        <ToggleButtonGroup
                            value={timeRange}
                            exclusive
                            onChange={handleTimeRangeChange}
                            aria-label="Time Range"
                            sx={{
                                backgroundColor: "#f2f5f7",
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                overflow: "hidden",
                                "& .MuiToggleButtonGroup-grouped": {
                                    textTransform: "none",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    padding: "10px 20px",
                                    border: "none",
                                    color: "#374151",
                                    "&.Mui-selected": {
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #ddd",
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        color: "#000",
                                        fontWeight: "600",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#f2f5f7",
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="Daily">Harian</ToggleButton>
                            <ToggleButton value="Weekly">Mingguan</ToggleButton>
                            <ToggleButton value="Monthly">Bulanan</ToggleButton>
                        </ToggleButtonGroup>

                        <DatePicker
                                        selected={date}
                                        onChange={(date) => setDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        customInput={<CustomDateInput />}
                                      />

                        <Button
                            variant="contained"
                            sx={{
                                background: "#4158A6",
                                color: "white",
                                padding: "10px 20px",
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                "&:hover": {
                                    background: "#3C4565",
                                    transform: "scale(1.05)",
                                    boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                                },
                            }}
                        >
                            <Download style={{ fontSize: "20px" }} />
                            Export
                        </Button>
                    </Box>
                    </div>

                    {/* Rest of the content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <SummaryCard
                            title="Bilangan TVPPS Diluluskan"
                            value={approvedCount ?? "Memuatkan..."}
                            icon={{
                                Component: MonitorCheckIcon,
                                color: "#287033",
                                bgColor: "#cbf6d1",
                              }}
                        />
                        <SummaryCard
                            title="Bilangan Pending Validasi"
                            value={pendingCount ?? "Memuatkan..."}
                            icon={{
                                Component: Hourglass,
                                color: "#602250",
                                bgColor: "#ecc7e3",
                              }}
                        />
                        <SummaryCard
                            title="Bilangan Sekolah Di Daerah Anda"
                            value={schoolsCount ?? "Memuatkan..."}
                            icon={{
                                Component: MapPinHouse,
                                color: "#604222",
                                bgColor: "#ecdac7",
                              }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                            <h3 className="text-center text-lg font-semibold text-[#455185] mb-4">
                                Bilangan Pengguna Mengikut Jenis
                            </h3>
                            <Bar data={barData} options={barOptions} />
                        </div>

                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                            <h3 className="text-center text-lg font-semibold text-[#455185] mb-4">
                                Jumlah Peratusan Status Versi TVPSS
                            </h3>
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center bg-white border py-4 text-gray-600">
                © 2024 Kementerian Pendidikan Malaysia (KPM)
            </footer>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ title, value, icon: { Component, color, bgColor } }) {
    return (
      <div className="bg-white p-5 rounded-2xl border-2 border-gray-150 flex items-center gap-4 hover:scale-105 transform transition duration-300 ease-in-out">
        <div 
        className="rounded-full p-4 flex items-center justify-center" 
        style={{ backgroundColor: bgColor }}
        >
          <Component style={{ color, fontSize: "40px" }} />
        </div>
        <div className="text-black">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    );
  }
