import { Link } from "react-router-dom";
import Button from "@/Pages/Admin/Components/Button";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {
  const handleDelete = (nim) => {
    onDelete(nim);
  };

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Status</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {mahasiswa.map((mhs, index) => (
          <tr
            key={mhs.nim}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{mhs.nim}</td>
            <td className="py-2 px-4">{mhs.nama}</td>
            <td className="py-2 px-4 text-center">
              {mhs.status ? "Aktif" : "Tidak Aktif"}
            </td>
            <td className="py-2 px-4 text-center space-x-2">
              <Link
                to={`/admin/mahasiswa/${mhs.nim}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Detail
              </Link>

              <Button
                size="sm"
                variant="warning"
                onClick={() => openEditModal(mhs)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(mhs.nim)}
              >
                Hapus
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
