import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMatakuliah } from "@/Utils/Apis/MataKuliahApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  FileText,
} from "lucide-react";
import { exportJadwalDosenPDF } from "@/Pages/Dosen/Utils/ExportJadwalDosen";

const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const JadwalDosen = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

  const dosenId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKelas, resMataKuliah] = await Promise.all([
          getAllKelas(),
          getAllMatakuliah(),
        ]);
        setKelas(resKelas.data || []);
        setMataKuliah(resMataKuliah.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const myKelas = kelas.filter((k) => k.dosen_id === dosenId);

  const getMatkul = (kelasItem) => {
    return mataKuliah.find((m) => m.id === kelasItem.matakuliah_id);
  };

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
          <Heading as="h2">Jadwal Mengajar</Heading>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Total Kelas:{" "}
              <span className="font-bold text-blue-600">{myKelas.length}</span>
            </div>
            {myKelas.length > 0 && (
              <button
                onClick={() => exportJadwalDosenPDF(myKelas, mataKuliah, user)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <FileText size={16} />
                Download Jadwal
              </button>
            )}
          </div>
        </div>

        {myKelas.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="py-3 px-4 text-left font-semibold">Hari</th>
                  <th className="py-3 px-4 text-left font-semibold">Jam</th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Mata Kuliah
                  </th>
                  <th className="py-3 px-4 text-center font-semibold">SKS</th>
                  <th className="py-3 px-4 text-left font-semibold">Ruangan</th>
                  <th className="py-3 px-4 text-center font-semibold">
                    Mahasiswa
                  </th>
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
                        <td className="py-3 px-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            {k.jam_mulai && k.jam_selesai
                              ? `${k.jam_mulai} - ${k.jam_selesai}`
                              : "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 font-medium">
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
                        <td className="py-3 px-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            {k.ruangan || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            {(k.mahasiswa_ids || []).length}
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
            <p className="text-gray-500 font-medium">
              Belum ada jadwal mengajar
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Anda belum ditugaskan mengajar kelas manapun
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JadwalDosen;
