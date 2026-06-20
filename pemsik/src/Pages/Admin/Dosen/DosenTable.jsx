import { Link } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Admin/Components/Button";

const DosenTable = ({
  dosen,
  kelas = [],
  mataKuliah = [],
  openEditModal,
  onDelete,
  isLoading,
}) => {
  const { user } = useAuthStateContext();

  const getTotalSksDosen = (dosenId) => {
    let total = 0;
    kelas.forEach((k) => {
      if (k.dosen_id === dosenId) {
        const m = mataKuliah.find((mk) => mk.id === k.matakuliah_id);
        total += m?.sks || 0;
      }
    });
    return total;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Memuat data dosen...</p>
      </div>
    );
  }

  if (dosen.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada data dosen</p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIDN</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-center">Max SKS</th>
          <th className="py-2 px-4 text-center">SKS Terpakai</th>
          <th className="py-2 px-4 text-center">Sisa SKS</th>
          <th className="py-2 px-4 text-center">Status</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {dosen.map((d, index) => {
          const totalSks = getTotalSksDosen(d.id);
          const sisaSks = (d.max_sks || 0) - totalSks;
          const isOver = sisaSks < 0;

          return (
            <tr
              key={d.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="py-2 px-4">{d.nidn}</td>
              <td className="py-2 px-4">{d.nama}</td>
              <td className="py-2 px-4">{d.email}</td>
              <td className="py-2 px-4 text-center font-semibold">
                {d.max_sks || 0}
              </td>
              <td className="py-2 px-4 text-center">{totalSks}</td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    isOver
                      ? "bg-red-200 text-red-800"
                      : sisaSks <= 2
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                  }`}
                >
                  {isOver ? "OVER" : sisaSks}
                </span>
              </td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    d.status
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {d.status ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
              <td className="py-2 px-4 text-center space-x-2">
                <Link
                  to={`/admin/dosen/${d.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Detail
                </Link>
                {user?.role === "admin" && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => openEditModal(d)}
                  >
                    Edit
                  </Button>
                )}
                {user?.role === "admin" && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(d.id)}
                  >
                    Hapus
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DosenTable;
