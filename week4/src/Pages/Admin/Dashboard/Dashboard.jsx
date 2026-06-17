import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Users,
  User,
  BookOpen,
  School,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMatakuliah } from "@/Utils/Apis/MataKuliahApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [kelas, setKelas] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKelas, resMahasiswa, resDosen, resMatakuliah] =
          await Promise.all([
            getAllKelas(),
            getAllMahasiswa(),
            getAllDosen(),
            getAllMatakuliah(),
          ]);
        setKelas(resKelas.data || []);
        setMahasiswa(resMahasiswa.data || []);
        setDosen(resDosen.data || []);
        setMataKuliah(resMatakuliah.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading Dashboard...</div>
      </div>
    );
  }

  const totalMahasiswa = mahasiswa.length;
  const totalDosen = dosen.length;
  const totalMatkul = mataKuliah.length;
  const totalKelas = kelas.length;

  const stats = [
    {
      label: "Mahasiswa",
      value: totalMahasiswa,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      path: "/admin/mahasiswa",
    },
    {
      label: "Dosen",
      value: totalDosen,
      icon: User,
      color: "from-emerald-500 to-emerald-600",
      path: "/admin/dosen",
    },
    {
      label: "Mata Kuliah",
      value: totalMatkul,
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
      path: "/admin/matakuliah",
    },
    {
      label: "Kelas",
      value: totalKelas,
      icon: School,
      color: "from-orange-500 to-orange-600",
      path: "/admin/kelas",
    },
  ];

  const sortedMahasiswa = [...mahasiswa].sort((a, b) => {
    let totalA = 0,
      totalB = 0;
    kelas.forEach((k) => {
      if (k.mahasiswa_ids?.includes(a.id)) {
        const m = mataKuliah.find((mk) => mk.id === k.matakuliah_id);
        totalA += m?.sks || 0;
      }
      if (k.mahasiswa_ids?.includes(b.id)) {
        const m = mataKuliah.find((mk) => mk.id === k.matakuliah_id);
        totalB += m?.sks || 0;
      }
    });
    return totalB - totalA;
  });

  const top5 = sortedMahasiswa.slice(0, 5);

  const pieLabels = kelas.map((k) => {
    const m = mataKuliah.find((mk) => mk.id === k.matakuliah_id);
    return m?.nama || "Unknown";
  });
  const pieDataValues = kelas.map((k) => k.mahasiswa_ids?.length || 0);
  const pieTotal = pieDataValues.reduce((a, b) => a + b, 0);

  const doughnutLabels = mahasiswa.slice(0, 10).map((m) => m.nama);
  const doughnutDataValues = mahasiswa.slice(0, 10).map((m) => {
    let total = 0;
    kelas.forEach((k) => {
      if (k.mahasiswa_ids?.includes(m.id)) {
        const mk = mataKuliah.find((mat) => mat.id === k.matakuliah_id);
        total += mk?.sks || 0;
      }
    });
    return total;
  });
  const doughnutTotal = doughnutDataValues.reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Ringkasan data sistem akademik
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={16} />
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.path)}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 text-white shadow-lg flex items-center justify-between cursor-pointer hover:shadow-xl hover:scale-105 transition-all`}
          >
            <div>
              <p className="text-sm opacity-80">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <stat.icon size={28} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Distribusi Mahasiswa per Kelas
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={{
                labels: pieLabels,
                datasets: [
                  {
                    data: pieDataValues,
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                      "#FF9F40",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      boxWidth: 12,
                      font: { size: 11 },
                      padding: 15,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0,
                        );
                        const percentage =
                          total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Total SKS per Dosen
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Bar
              data={{
                labels: dosen.map((d) => d.nama),
                datasets: [
                  {
                    label: "SKS",
                    data: dosen.map((d) => {
                      let total = 0;
                      kelas.forEach((k) => {
                        if (k.dosen_id === d.id) {
                          const m = mataKuliah.find(
                            (mk) => mk.id === k.matakuliah_id,
                          );
                          total += m?.sks || 0;
                        }
                      });
                      return total;
                    }),
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                    ],
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-purple-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Penggunaan SKS Mahasiswa (Top 10)
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={{
                labels: doughnutLabels,
                datasets: [
                  {
                    data: doughnutDataValues,
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                      "#FF9F40",
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      boxWidth: 12,
                      font: { size: 10 },
                      padding: 12,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0,
                        );
                        const percentage =
                          total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${value} SKS (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-pink-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Trend SKS Mahasiswa (Top 5)
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Line
              data={{
                labels: top5.map((m) => m.nama),
                datasets: [
                  {
                    label: "SKS Diambil",
                    data: top5.map((m) => {
                      let total = 0;
                      kelas.forEach((k) => {
                        if (k.mahasiswa_ids?.includes(m.id)) {
                          const mk = mataKuliah.find(
                            (mat) => mat.id === k.matakuliah_id,
                          );
                          total += mk?.sks || 0;
                        }
                      });
                      return total;
                    }),
                    borderColor: "#FF6384",
                    backgroundColor: "rgba(255, 99, 132, 0.1)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#FF6384",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                  },
                  {
                    label: "Max SKS",
                    data: top5.map((m) => m.max_sks || 24),
                    borderColor: "#36A2EB",
                    backgroundColor: "rgba(54, 162, 235, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5],
                    pointBackgroundColor: "#36A2EB",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      boxWidth: 12,
                      font: { size: 10 },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
