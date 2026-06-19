import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMatakuliah } from "@/Utils/Apis/MataKuliahApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";

const DashboardDosen = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [dosen, setDosen] = useState([]);
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
        const [resKelas, resMahasiswa, resMataKuliah, resDosen] =
          await Promise.all([
            getAllKelas(),
            getAllMahasiswa(),
            getAllMatakuliah(),
            getAllDosen(),
          ]);
        setKelas(resKelas.data || []);
        setMahasiswa(resMahasiswa.data || []);
        setMataKuliah(resMataKuliah.data || []);
        setDosen(resDosen.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dosenId = user?.id;

  const dataDosen = dosen.find((d) => d.id === dosenId);
  const maxSks = dataDosen?.max_sks || user?.max_sks || 0;

  const myKelas = kelas.filter((k) => k.dosen_id === dosenId);
  const totalMahasiswa = myKelas.reduce(
    (sum, k) => sum + (k.mahasiswa_ids || []).length,
    0,
  );
  const totalSks = myKelas
    .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
    .reduce((a, b) => a + b, 0);

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
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Dosen</h1>
          <p className="text-gray-500 text-sm">
            {greeting}, {user?.name || "Dosen"}!
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {time.toLocaleTimeString("id-ID")}
          </div>
          <div className="text-sm text-gray-400">
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
              <p className="text-sm opacity-80">Total Kelas</p>
              <p className="text-3xl font-bold">{myKelas.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <BookOpen size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Mahasiswa</p>
              <p className="text-3xl font-bold">{totalMahasiswa}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total SKS</p>
              <p className="text-3xl font-bold">{totalSks}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Max SKS</p>
              <p className="text-3xl font-bold">{maxSks}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-500" />
            Kelas yang Diajar
          </h3>
          {myKelas.length > 0 ? (
            <div className="space-y-2">
              {myKelas.map((k) => {
                const matkul = mataKuliah.find((m) => m.id === k.matakuliah_id);
                return (
                  <div
                    key={k.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{matkul?.nama || "-"}</p>
                      <p className="text-sm text-gray-500">
                        {k.hari || "-"} | {k.jam_mulai} - {k.jam_selesai} |{" "}
                        {k.ruangan || "-"}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {(k.mahasiswa_ids || []).length} Mahasiswa
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">Belum ada kelas yang diajar</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardDosen;
