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
import SuperAdminSideBar from "./SuperAdminSideBar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ToggleButtonGroup, ToggleButton, Button, Box } from "@mui/material";
import {
  School,
  Layers,
  Download,
  Calendar,
  ChevronDown,
  Landmark,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Weekly");
  const [date, setDate] = useState(new Date());
  const [userCounts, setUserCounts] = useState(null);

  // Fetch user counts on component mount
  useEffect(() => {
    async function fetchUserCounts() {
      try {
        const response = await fetch("/user-role-counts");
        if (!response.ok) {
          throw new Error("Failed to fetch user counts");
        }
        const data = await response.json();
        setUserCounts({
          stateAdmin: data.state_admin || 0,
          ppdAdmin: data.ppd_admin || 0,
          schoolAdmin: data.school_admin || 0,
        });
      } catch (error) {
        console.error("Error fetching user role counts:", error);
      }
    }

    fetchUserCounts();
  }, []);

  if (!userCounts) {
    return <div>Loading user data...</div>;
  }


  const barData = {
    labels: ["Admin State", "Admin PPD", "Admin Sekolah"],
    datasets: [
      {
        label: "Bilangan Pengguna Mengikut Jenis",
        data: [userCounts.stateAdmin, userCounts.ppdAdmin, userCounts.schoolAdmin],
        backgroundColor: ["#4158A6", "#179BAE", "#FF8343"],
        borderColor: ["#4158A6", "#179BAE", "#FF8343"],
        borderWidth: 1,
        borderRadius: 20,
      },
    ],
  };

  

  const doughnutData = {
    labels: ["Admin State", "Admin PPD", "Admin Sekolah"],
    datasets: [
      {
        label: "Bilangan Peratusan Pengguna Mengikut Jenis",
        data: [
          (userCounts.stateAdmin / (userCounts.stateAdmin + userCounts.ppdAdmin + userCounts.schoolAdmin)) * 100,
          (userCounts.ppdAdmin / (userCounts.stateAdmin + userCounts.ppdAdmin + userCounts.schoolAdmin)) * 100,
          (userCounts.schoolAdmin / (userCounts.stateAdmin + userCounts.ppdAdmin + userCounts.schoolAdmin)) * 100,
        ],
        backgroundColor: ["#4158A6", "#179BAE", "#FF8343"],
        borderColor: ["#4158A6", "#179BAE", "#FF8343"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange) {
      setTimeRange(newTimeRange);
    }
  };

  const CustomDateInput = ({ value, onClick }) => (
    <div style={{ position: "relative" }} onClick={onClick}>
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
        }}
      />
      <ChevronDown
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          color: "#374151",
        }}
      />
    </div>
  );

  return (
    <AuthenticatedLayout>
      <Head title="TVPSS | Dashboard" />
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="w-1/6 bg-white shadow-lg">
          <SuperAdminSideBar />
        </div>

        <div className="w-full md:ml-[120px] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900 bg-clip-text">Dashboard</h2>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-lg text-gray-700 mt-2">Selamat Datang ke Dashboard Super Admin!</p>

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
                           Eksport
                         </Button>
                       </Box>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <SummaryCard
              title="Bilangan State Admin"
              value={userCounts.stateAdmin}
              icon={{
                Component: Layers,
                color: "#5c63f6",
                bgColor: "#E8F0FE",
              }}
            />
            <SummaryCard
              title="Bilangan PPD Admin"
              value={userCounts.ppdAdmin}
              icon={{
                Component: Landmark,
                color: "#17bae",
                bgColor: "#e8f5f7",
              }}
            />
            <SummaryCard
              title="Bilangan Sekolah Admin"
              value={userCounts.schoolAdmin}
              icon={{
                Component: School,
                color: "#e99341",
                bgColor: "#FFF3E0",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Bilangan Pengguna Mengikut Jenis</h3>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  indexAxis: "y",
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          return tooltipItem.raw.toLocaleString();
                        },
                      },
                    },
                  },
                  elements: { bar: { borderRadius: 10 } },
                  scales: {
                    x: { beginAtZero: true },
                    y: {
                      grid: { display: false },
                      ticks: { display: true },
                    },
                  },
                }}
              />
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 flex flex-col items-center">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Bilangan Peratusan Pengguna</h3>
              <Doughnut data={doughnutData} options={options} />
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center py-4 bg-white text-gray-600">© 2024 Kementerian Pendidikan Malaysia</footer>
    </AuthenticatedLayout>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between border border-gray-200 hover:scale-105 transform transition duration-300 ease-in-out">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-lg font-semibold text-gray-600">{value}</p>
      </div>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: icon.bgColor }}
      >
        <icon.Component style={{ color: icon.color, fontSize: "30px" }} />
      </div>
    </div>
  );
}
