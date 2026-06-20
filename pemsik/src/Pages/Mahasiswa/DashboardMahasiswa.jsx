import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMatakuliah } from "@/Utils/Apis/MatakuliahApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import {
  BookOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  User,
  Award,
} from "lucide-react";

const DashboardMahasiswa = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hour = time.getHours();
    if (hour < 12) setGreeting("🌅 Selamat Pagi");
    else if (hour < 15) setGreeting("☀️ Selamat Siang");
    else if (hour < 19) setGreeting("🌇 Selamat Sore");
    else setGreeting("🌙 Selamat Malam");
  }, [time]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKelas, resMahasiswa, resMataKuliah] = await Promise.all([
          getAllKelas(),
          getAllMahasiswa(),
          getAllMatakuliah(),
        ]);
        setKelas(resKelas.data || []);
        setMahasiswa(resMahasiswa.data || []);
        setMataKuliah(resMataKuliah.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mahasiswaId = user?.id;

  const dataMahasiswa = mahasiswa.find((m) => m.id === mahasiswaId);
  const nim = dataMahasiswa?.nim || user?.nim || "-";

  const myKelas = kelas.filter((k) => k.mahasiswa_ids?.includes(mahasiswaId));

  const totalSks = myKelas
    .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
    .reduce((a, b) => a + b, 0);

  const maxSks = dataMahasiswa?.max_sks || user?.max_sks || 24;
  const sisaSks = maxSks - totalSks;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Mahasiswa
          </h1>
          <p className="text-gray-500 text-sm">
            {greeting}, {user?.name || "Mahasiswa"}!
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {time.toLocaleTimeString("id-ID")}
          </div>
          <div className="text-sm text-gray-400 flex items-center justify-end gap-1">
            <Calendar size={14} />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total SKS Diambil</p>
              <p className="text-3xl font-bold">{totalSks}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <BookOpen size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Sisa SKS</p>
              <p className="text-3xl font-bold">{sisaSks}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Max SKS</p>
              <p className="text-3xl font-bold">{maxSks}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Matkul Diambil</p>
              <p className="text-3xl font-bold">{myKelas.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              Matkul Diambil
            </h3>
            {myKelas.length > 0 ? (
              <ul className="space-y-2">
                {myKelas.map((k) => {
                  const matkul = mataKuliah.find(
                    (m) => m.id === k.matakuliah_id,
                  );
                  return (
                    <li
                      key={k.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                    >
                      <span className="font-medium">{matkul?.nama || "-"}</span>
                      <span className="text-sm text-gray-500">
                        {matkul?.sks || 0} SKS
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-400">Belum mengambil mata kuliah</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <User size={18} className="text-purple-500" />
              Informasi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">NIM</span>
                <span className="font-medium">{nim}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Aktif
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Progress SKS</span>
                <span className="font-medium">
                  {totalSks}/{maxSks} ({Math.round((totalSks / maxSks) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMahasiswa;
