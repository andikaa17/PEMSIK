import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { getMatakuliah } from "@/Utils/Apis/MatakuliahApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MatakuliahDetail = () => {
  const { id } = useParams();
  const [matakuliah, setMatakuliah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatakuliah();
  }, [id]);

  const fetchMatakuliah = async () => {
    try {
      const response = await getMatakuliah(id);
      setMatakuliah(response.data);
    } catch (error) {
      toastError("Gagal mengambil data mata kuliah");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center py-8">Memuat data mata kuliah...</p>
      </Card>
    );
  }

  if (!matakuliah) {
    return (
      <Card>
        <p className="text-red-600 text-center py-8">
          Data mata kuliah tidak ditemukan.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Mata Kuliah
      </Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">Kode</td>
            <td className="py-2 px-4">{matakuliah.kode}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama Mata Kuliah</td>
            <td className="py-2 px-4">{matakuliah.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">SKS</td>
            <td className="py-2 px-4">{matakuliah.sks}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Status</td>
            <td className="py-2 px-4">
              <span
                className={`px-2 py-1 rounded text-xs ${matakuliah.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
              >
                {matakuliah.status ? "Aktif" : "Tidak Aktif"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MatakuliahDetail;
