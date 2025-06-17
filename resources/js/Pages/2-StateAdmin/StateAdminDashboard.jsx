import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import StateAdminSideBar from "./StateAdminSideBar";
import { ToggleButtonGroup, ToggleButton, Button, Box } from "@mui/material";
import { Download, Calendar, FileBadge, Award, MapPinHouse } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Weekly");
  const [date, setDate] = useState(new Date());
  const [approvedCount, setApprovedCount] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(null);
  const [schoolsCount, setSchoolCount] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("Semua Negeri");
  const [version1Counts, setVersion1Counts] = useState("Memuatkan...");
  const [version2Counts, setVersion2Counts] = useState("Memuatkan...");
  const [version3Counts, setVersion3Counts] = useState("Memuatkan...");
  const [version4Counts, setVersion4Counts] = useState("Memuatkan...");

  const totalCounts =
  version1Counts + version2Counts + version3Counts + version4Counts;

  const percentages = [
    ((version1Counts / totalCounts) * 100).toFixed(2),
    ((version2Counts / totalCounts) * 100).toFixed(2),
    ((version3Counts / totalCounts) * 100).toFixed(2),
    ((version4Counts / totalCounts) * 100).toFixed(2),
  ];
  
  

  useEffect(() => {
    fetch("/state-admin-stats")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Add this line to inspect the response
        setApprovedCount(data.approved_tvpss_count ?? 0);
        setAchievementsCount(data.achievements_count ?? 0);
        setSchoolCount(data.schools_count ?? 0);
      })
      .catch((error) => {
        console.error("Error fetching school stats:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/state-admin-version-counts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Add this line to inspect the response
        setVersion1Counts(data.version1_count);
        setVersion2Counts(data.version2_count);
        setVersion3Counts(data.version3_count);
        setVersion4Counts(data.version4_count);
      })
      .catch((error) => {
        console.error("Error fetching version counts:", error);
      });
  }, []);
  

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange) setTimeRange(newTimeRange);
  };

  const barData = {
    labels: ["Versi 1", "Versi 2", "Versi 3", "Versi 4"],
    datasets: [
      {
        label: "Jumlah",
        data: [version1Counts,version2Counts,version3Counts,version4Counts],
        backgroundColor: ["#455185", "#179BAE", "#FF6F61", "#F5B7B1"],
        borderColor: ["#455185", "#179BAE", "#FF6F61", "#F5B7B1"],
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
    labels: ["Versi 1", "Versi 2", "Versi 3", "Versi 4"],
    datasets: [
      {
        label: "Jumlah (%)",
        data: percentages, // Use the calculated percentages
        backgroundColor: ["#4158A6", "#179BAE", "#FF6F61", "#F5B7B1"], // Added extra color
        borderColor: ["#455185", "#179BAE", "#FF6F61", "#F5B7B1"], // Added extra border color
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
  
  console.log(doughnutData);

  return (
    <AuthenticatedLayout>
      <Head title="TVPSS | Dashboard" />
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="w-1/6 bg-white shadow-lg">
          <StateAdminSideBar />
        </div>

        <div className="w-full md:ml-[120px] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900 bg-clip-text">Dashboard</h2>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-lg text-gray-700 mt-2">
              Selamat Datang ke Dashboard State Admin!
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <SummaryCard
              title="Bilangan Pending TVPSS"
              value={approvedCount ?? "Memuatkan..."}
              icon={{
                Component: FileBadge,
                color: "#9d8338",
                bgColor: "#f6ebcb",
              }}
            />
            <SummaryCard
              title="Bilangan Pencapaian"
              value={achievementsCount ?? "Memuatkan..."}
              icon={{
                Component: Award,
                color: "#287033",
                bgColor: "#cbf6d1",
              }}
            />
            <SummaryCard
              title="Bilangan TVPSS Sekolah"
              value={schoolsCount ?? "Memuatkan..."}
              icon={{
                Component: MapPinHouse,
                color: "#0f3365",
                bgColor: "#bbd1ef",
              }}
            />
          </div>

          {/* Chart Containers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">Bilangan Sekolah Mengikut Versi</h3>
              <Bar data={barData} options={barOptions} />
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Jumlah Peratusan Mengikut Versi</h3>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 border-t bg-white text-gray-600">
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
        <Component style={{ color }} className="text-3xl" />
      </div>
      <div>
        <h4 className="font-semibold text-lg text-gray-900">{title}</h4>
        <p className="text-2xl text-gray-700">{value}</p>
      </div>
    </div>
  );
}

function CustomDateInput({ value, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        padding: "10px 20px",
        background: "#f3f4f6",
        borderColor: "#d1d5db",
        color: "#6b7280",
        textTransform: "none",
        borderRadius: 2,
      }}
    >
      <Calendar className="mr-2" /> {value || "Pilih Tarikh"}
    </Button>
  );
}
