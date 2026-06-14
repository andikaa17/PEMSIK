import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { getDosen } from "@/Utils/Apis/DosenApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const DosenDetail = () => {
  const { id } = useParams();
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDosen();
  }, [id]);

  const fetchDosen = async () => {
    try {
      const response = await getDosen(id);
      setDosen(response.data);
    } catch (error) {
      toastError("Gagal mengambil data dosen");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center py-8">Memuat data dosen...</p>
      </Card>
    );
  }

  if (!dosen) {
    return (
      <Card>
        <p className="text-red-600 text-center py-8">
          Data dosen tidak ditemukan.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Dosen
      </Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIDN</td>
            <td className="py-2 px-4">{dosen.nidn}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{dosen.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Email</td>
            <td className="py-2 px-4">{dosen.email || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Status</td>
            <td className="py-2 px-4">
              <span
                className={`px-2 py-1 rounded text-xs ${dosen.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
              >
                {dosen.status ? "Aktif" : "Tidak Aktif"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default DosenDetail;
