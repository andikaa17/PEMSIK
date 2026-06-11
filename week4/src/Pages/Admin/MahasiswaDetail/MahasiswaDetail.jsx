import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

import { getMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaDetail = () => {
  const { id } = useParams();  // Ganti dari nim ke id
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMahasiswa();
  }, [id]);

  const fetchMahasiswa = async () => {
    try {
      const response = await getMahasiswa(id);
      setMahasiswa(response.data);
    } catch (error) {
      toastError("Gagal mengambil data mahasiswa");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center py-8">Memuat data mahasiswa...</p>
      </Card>
    );
  }

  if (!mahasiswa) {
    return (
      <Card>
        <p className="text-red-600 text-center py-8">Data mahasiswa tidak ditemukan.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Mahasiswa
      </Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">ID</td>
            <td className="py-2 px-4">{mahasiswa.id}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">NIM</td>
            <td className="py-2 px-4">{mahasiswa.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mahasiswa.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Status</td>
            <td className="py-2 px-4">
              {mahasiswa.status ? "Aktif" : "Tidak Aktif"}
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;