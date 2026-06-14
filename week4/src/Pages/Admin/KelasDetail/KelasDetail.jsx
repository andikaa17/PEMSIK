import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { getKelas } from "@/Utils/Apis/KelasApi";
import { useMatakuliah } from "@/Utils/Hooks/useMatakuliah";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const KelasDetail = () => {
  const { id } = useParams();
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: resultMatakuliah = { data: [] } } = useMatakuliah();
  const { data: resultDosen = { data: [] } } = useDosen();
  const matakuliah = resultMatakuliah.data;
  const dosen = resultDosen.data;

  useEffect(() => {
    fetchKelas();
  }, [id]);

  const fetchKelas = async () => {
    try {
      const response = await getKelas(id);
      setKelas(response.data);
    } catch (error) {
      toastError("Gagal mengambil data kelas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMatakuliahNama = (id) => {
    const item = Array.isArray(matakuliah)
      ? matakuliah.find((m) => m.id === id)
      : null;
    return item ? `${item.kode} - ${item.nama}` : "-";
  };

  const getDosenNama = (id) => {
    const item = Array.isArray(dosen) ? dosen.find((d) => d.id === id) : null;
    return item ? item.nama : "-";
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center py-8">Memuat data kelas...</p>
      </Card>
    );
  }

  if (!kelas) {
    return (
      <Card>
        <p className="text-red-600 text-center py-8">
          Data kelas tidak ditemukan.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Kelas
      </Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">Kode</td>
            <td className="py-2 px-4">{kelas.kode}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama Kelas</td>
            <td className="py-2 px-4">{kelas.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Tahun</td>
            <td className="py-2 px-4">{kelas.tahun}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Semester</td>
            <td className="py-2 px-4">{kelas.semester}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Mata Kuliah</td>
            <td className="py-2 px-4">
              {getMatakuliahNama(kelas.matakuliah_id)}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Dosen</td>
            <td className="py-2 px-4">{getDosenNama(kelas.dosen_id)}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Ruangan</td>
            <td className="py-2 px-4">{kelas.ruangan}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Hari</td>
            <td className="py-2 px-4">{kelas.hari}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Jam</td>
            <td className="py-2 px-4">
              {kelas.jam_mulai} - {kelas.jam_selesai}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Kapasitas</td>
            <td className="py-2 px-4">{kelas.kapasitas}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Status</td>
            <td className="py-2 px-4">
              <span
                className={`px-2 py-1 rounded text-xs ${kelas.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
              >
                {kelas.status ? "Aktif" : "Tidak Aktif"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default KelasDetail;
