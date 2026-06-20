import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMatakuliah } from "@/Utils/Apis/MatakuliahApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const RencanaStudiDosen = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const dosenId = user?.id;
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
          <Heading as="h2">Rencana Studi - Kelas Saya</Heading>
          <div className="text-sm text-gray-600">
            Total Kelas:{" "}
            <span className="font-bold text-blue-600">{myKelas.length}</span>
          </div>
        </div>

        {myKelas.length > 0 ? (
          <div className="space-y-6">
            {myKelas.map((kls) => {
              const matkul = getMatkul(kls);
              const mhsInClass = (kls.mahasiswa_ids || [])
                .map((id) => mahasiswa.find((m) => m.id === id))
                .filter(Boolean);

              return (
                <div key={kls.id} className="border rounded shadow bg-white">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold">
                      {matkul?.nama || "-"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Kode: {kls.kode || "-"} | SKS: {matkul?.sks || 0} |{" "}
                      {kls.hari || "-"} | {kls.jam_mulai} - {kls.jam_selesai}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ruangan: {kls.ruangan || "-"} | Kapasitas:{" "}
                      {mhsInClass.length}/{kls.kapasitas || "∞"}
                    </p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="py-2 px-4 text-left">No</th>
                        <th className="py-2 px-4 text-left">Nama</th>
                        <th className="py-2 px-4 text-left">NIM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mhsInClass.length > 0 ? (
                        mhsInClass.map((m, i) => (
                          <tr
                            key={m.id}
                            className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
                          >
                            <td className="py-2 px-4">{i + 1}</td>
                            <td className="py-2 px-4">{m.nama}</td>
                            <td className="py-2 px-4">{m.nim}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-3 px-4 text-center italic text-gray-500"
                          >
                            Belum ada mahasiswa.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Belum ada kelas yang diajar</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RencanaStudiDosen;
