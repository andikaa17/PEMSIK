import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMatakuliah } from "@/Utils/Apis/MatakuliahApi";
import { updateKelas } from "@/Utils/Apis/KelasApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  Award,
  Calendar,
  MapPin,
  AlertCircle,
} from "lucide-react";

const KRS = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

  const mahasiswaId = user?.id;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resKelas, resMataKuliah] = await Promise.all([
        getAllKelas(),
        getAllMatakuliah(),
      ]);
      setKelas(resKelas.data || []);
      setMataKuliah(resMataKuliah.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toastError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const myKelas = kelas.filter((k) => k.mahasiswa_ids?.includes(mahasiswaId));

  const availableKelas = kelas.filter(
    (k) =>
      !k.mahasiswa_ids?.includes(mahasiswaId) &&
      (!k.kapasitas || k.mahasiswa_ids?.length < k.kapasitas),
  );

  const toMinutes = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeOverlap = (start1, end1, start2, end2) => {
    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);
    return s1 < e2 && s2 < e1;
  };

  const isConflict = (kelasItem) => {
    return myKelas.some(
      (k) =>
        k.hari === kelasItem.hari &&
        isTimeOverlap(
          k.jam_mulai,
          k.jam_selesai,
          kelasItem.jam_mulai,
          kelasItem.jam_selesai,
        ),
    );
  };

  const handleAmbil = async (kelasItem) => {
    const sks =
      mataKuliah.find((m) => m.id === kelasItem.matakuliah_id)?.sks || 0;
    const totalSks = myKelas
      .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
    const maxSks = user?.max_sks || 24;

    if (totalSks + sks > maxSks) {
      toastError("SKS melebihi batas maksimal!");
      return;
    }

    if (isConflict(kelasItem)) {
      toastError("Jadwal bentrok dengan mata kuliah lain!");
      return;
    }

    try {
      const updated = {
        ...kelasItem,
        mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), mahasiswaId],
      };
      await updateKelas(kelasItem.id, updated);
      toastSuccess("Berhasil mengambil mata kuliah!");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toastError("Gagal mengambil mata kuliah");
    }
  };

  const handleBatal = async (kelasItem) => {
    try {
      const updated = {
        ...kelasItem,
        mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter(
          (id) => id !== mahasiswaId,
        ),
      };
      await updateKelas(kelasItem.id, updated);
      toastSuccess("Berhasil membatalkan mata kuliah!");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toastError("Gagal membatalkan mata kuliah");
    }
  };

  const totalSks = myKelas
    .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
    .reduce((a, b) => a + b, 0);

  const maxSks = user?.max_sks || 24;
  const sisaSks = maxSks - totalSks;

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
          <Heading as="h2">Kartu Rencana Studi (KRS)</Heading>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-600">
              Total SKS:{" "}
              <span className="font-bold text-blue-600">{totalSks}</span> /{" "}
              {maxSks}
            </div>
            <div className="text-gray-600">
              Sisa SKS:{" "}
              <span className="font-bold text-green-600">{sisaSks}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Matkul Diambil ({myKelas.length})
          </h3>
          {myKelas.length > 0 ? (
            <div className="space-y-2">
              {myKelas.map((k) => {
                const matkul = mataKuliah.find((m) => m.id === k.matakuliah_id);
                return (
                  <div
                    key={k.id}
                    className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded"
                  >
                    <div>
                      <p className="font-medium">{matkul?.nama || "-"}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Award size={14} />
                          {matkul?.sks || 0} SKS
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {k.hari || "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {k.jam_mulai && k.jam_selesai
                            ? `${k.jam_mulai} - ${k.jam_selesai}`
                            : "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {k.ruangan || "-"}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleBatal(k)}
                    >
                      Batal
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">Belum mengambil mata kuliah</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-500" />
            Matkul Tersedia ({availableKelas.length})
          </h3>
          {availableKelas.length > 0 ? (
            <div className="space-y-2">
              {availableKelas.map((k) => {
                const matkul = mataKuliah.find((m) => m.id === k.matakuliah_id);
                const sks = matkul?.sks || 0;
                const conflict = isConflict(k);
                const canTake = sisaSks >= sks && !conflict;

                return (
                  <div
                    key={k.id}
                    className={`flex justify-between items-center p-3 border rounded ${
                      canTake
                        ? "bg-gray-50 border-gray-200"
                        : "bg-gray-100 border-gray-300 opacity-60"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{matkul?.nama || "-"}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Award size={14} />
                          {sks} SKS
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {k.hari || "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {k.jam_mulai && k.jam_selesai
                            ? `${k.jam_mulai} - ${k.jam_selesai}`
                            : "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {k.ruangan || "-"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Users size={14} />
                          {(k.mahasiswa_ids || []).length}/{k.kapasitas || "∞"}
                        </span>
                      </div>
                      {!canTake && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {conflict ? "Jadwal bentrok!" : "SKS tidak cukup"}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAmbil(k)}
                      disabled={!canTake}
                    >
                      {canTake ? "Ambil" : "Tidak Tersedia"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">Tidak ada mata kuliah tersedia</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KRS;
