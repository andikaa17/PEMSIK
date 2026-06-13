import { Link } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Admin/Components/Button";

const DosenTable = ({ dosen, openEditModal, onDelete }) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIDN</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-center">Status</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {dosen.map((d, index) => (
          <tr
            key={d.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{d.nidn}</td>
            <td className="py-2 px-4">{d.nama}</td>
            <td className="py-2 px-4">{d.email}</td>
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
              {user?.permission?.includes("dosen.update") && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(d)}
                >
                  Edit
                </Button>
              )}
              {user?.permission?.includes("dosen.delete") && (
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
        ))}
      </tbody>
    </table>
  );
};

export default DosenTable;
