import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Admin/Components/Button";
import { Link } from "react-router-dom";

const KelasTable = ({ kelas, openEditModal, onDelete }) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">Nama Kelas</th>
          <th className="py-2 px-4 text-center">Tahun</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {kelas.map((k, index) => (
          <tr
            key={k.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{k.nama}</td>
            <td className="py-2 px-4 text-center">{k.tahun}</td>
            <td className="py-2 px-4 text-center space-x-2">
              <Link
                to={`/admin/kelas/${k.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Detail
              </Link>
              {user?.permission?.includes("kelas.update") && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(k)}
                >
                  Edit
                </Button>
              )}
              {user?.permission?.includes("kelas.delete") && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(k.id)}
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

export default KelasTable;
