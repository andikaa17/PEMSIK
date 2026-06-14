import { Link } from "react-router-dom";
import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const KelasTable = ({
  kelas,
  matakuliah,
  dosen,
  openEditModal,
  onDelete,
  isLoading,
}) => {
  const { user } = useAuthStateContext();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Memuat data kelas...</p>
      </div>
    );
  }

  const safeMatakuliah = Array.isArray(matakuliah) ? matakuliah : [];
  const safeDosen = Array.isArray(dosen) ? dosen : [];
  const safeKelas = Array.isArray(kelas) ? kelas : [];

  const getMatakuliahNama = (id) => {
    if (!id) return "-";
    const item = safeMatakuliah.find((m) => m.id === id);
    return item ? `${item.kode} - ${item.nama}` : "-";
  };

  const getDosenNama = (id) => {
    if (!id) return "-";
    const item = safeDosen.find((d) => d.id === id);
    return item ? item.nama : "-";
  };

  if (safeKelas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada data kelas</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-3 text-left">Kode</th>
            <th className="py-3 px-3 text-left">Nama Kelas</th>
            <th className="py-3 px-3 text-left">Mata Kuliah</th>
            <th className="py-3 px-3 text-left">Dosen</th>
            <th className="py-3 px-3 text-left">Ruangan</th>
            <th className="py-3 px-3 text-left">Hari</th>
            <th className="py-3 px-3 text-left">Jam</th>
            <th className="py-3 px-3 text-center">Kapasitas</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {safeKelas.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-2 px-3 border-b">{item.kode}</td>
              <td className="py-2 px-3 border-b">{item.nama}</td>
              <td className="py-2 px-3 border-b">
                {getMatakuliahNama(item.matakuliah_id)}
              </td>
              <td className="py-2 px-3 border-b">
                {getDosenNama(item.dosen_id)}
              </td>
              <td className="py-2 px-3 border-b">{item.ruangan || "-"}</td>
              <td className="py-2 px-3 border-b">{item.hari || "-"}</td>
              <td className="py-2 px-3 border-b">
                {item.jam_mulai
                  ? `${item.jam_mulai} - ${item.jam_selesai}`
                  : "-"}
              </td>
              <td className="py-2 px-3 border-b text-center">
                {item.kapasitas || "-"}
              </td>
              <td className="py-2 px-3 border-b text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${item.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                >
                  {item.status ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
              <td className="py-2 px-3 border-b text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <Link
                    to={`/admin/kelas/${item.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                  >
                    Detail
                  </Link>
                  {user?.permission?.includes("kelas.update") && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </Button>
                  )}
                  {user?.permission?.includes("kelas.delete") && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item.id)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;
