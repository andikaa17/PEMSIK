import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Admin/Components/Button";
import { Link } from "react-router-dom";

const MatakuliahTable = ({ matakuliah, openEditModal, onDelete }) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">Kode</th>
          <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
          <th className="py-2 px-4 text-center">SKS</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {matakuliah.map((mk, index) => (
          <tr
            key={mk.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{mk.kode}</td>
            <td className="py-2 px-4">{mk.nama}</td>
            <td className="py-2 px-4 text-center">{mk.sks}</td>
            <td className="py-2 px-4 text-center space-x-2">
              <Link
                to={`/admin/matakuliah/${mk.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Detail
              </Link>
              {user?.permission?.includes("matakuliah.update") && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(mk)}
                >
                  Edit
                </Button>
              )}
              {user?.permission?.includes("matakuliah.delete") && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(mk.id)}
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

export default MatakuliahTable;
