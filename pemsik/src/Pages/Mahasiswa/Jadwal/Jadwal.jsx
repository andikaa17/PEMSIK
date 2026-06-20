import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMatakuliah } from "@/Utils/Apis/MatakuliahApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Download,
  FileText,
} from "lucide-react";
import { exportJadwalPDF } from "@/Pages/Mahasiswa/Utils/ExportJadwal";

const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const Jadwal = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

  const mahasiswaId = user?.id;

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

  const myKelas = kelas.filter((k) => k.mahasiswa_ids?.includes(mahasiswaId));

  const getMatkul = (kelasItem) => {
    return mataKuliah.find((m) => m.id === kelasItem.matakuliah_id);
  };

  const dataMahasiswa = mahasiswa.find((m) => m.id === mahasiswaId);
  const nim = dataMahasiswa?.nim || "-";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Heading as="h2">Jadwal Kuliah</Heading>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Total Matkul:{" "}
              <span className="font-bold text-blue-600">{myKelas.length}</span>
            </div>
            {myKelas.length > 0 && (
              <button
                onClick={() => exportJadwalPDF(myKelas, mataKuliah, user, nim)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <FileText size={16} />
                Download Jadwal
              </button>
            )}
          </div>
        </div>

        {myKelas.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="py-3 px-4 text-left font-semibold">Hari</th>
                  <th className="py-3 px-4 text-left font-semibold">Jam</th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Mata Kuliah
                  </th>
                  <th className="py-3 px-4 text-center font-semibold">SKS</th>
                  <th className="py-3 px-4 text-left font-semibold">Ruangan</th>
                </tr>
              </thead>
              <tbody>
                {hariList.map((hari) => {
                  const kelasHari = myKelas
                    .filter((k) => k.hari === hari)
                    .sort((a, b) =>
                      (a.jam_mulai || "").localeCompare(b.jam_mulai || ""),
                    );

                  if (kelasHari.length === 0) return null;

                  return kelasHari.map((k, idx) => {
                    const matkul = getMatkul(k);
                    return (
                      <tr
                        key={k.id}
                        className={
                          idx % 2 === 0
                            ? "bg-white hover:bg-blue-50 transition-colors"
                            : "bg-gray-50 hover:bg-blue-50 transition-colors"
                        }
                      >
                        {idx === 0 && (
                          <td
                            className="py-3 px-4 border-b border-gray-200 font-medium text-gray-700"
                            rowSpan={kelasHari.length}
                          >
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-blue-500" />
                              {hari}
                            </div>
                          </td>
                        )}
                        <td className="py-3 px-4 border-b border-gray-200 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            {k.jam_mulai && k.jam_selesai
                              ? `${k.jam_mulai} - ${k.jam_selesai}`
                              : "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-500" />
                            {matkul?.nama || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {matkul?.sks || 0} SKS
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            {k.ruangan || "-"}
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Calendar size={40} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Belum ada jadwal kuliah</p>
            <p className="text-sm text-gray-400 mt-1">
              Silakan ambil mata kuliah di halaman KRS
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Jadwal;
