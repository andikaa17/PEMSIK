import { useParams, Link } from "react-router-dom";
import { useMatakuliah } from "@/Utils/Hooks/useMatakuliah";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

const MatakuliahDetail = () => {
  const { id } = useParams();
  const { data: matakuliah = [] } = useMatakuliah();
  const matakuliahItem = matakuliah.find((m) => m.id == id);

  if (!matakuliahItem) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-500">Data mata kuliah tidak ditemukan</p>
          <Link to="/admin/matakuliah">
            <Button variant="primary" className="mt-4">
              Kembali
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Detail Mata Kuliah
        </Heading>
        <Link to="/admin/matakuliah">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-600">
              Kode Mata Kuliah
            </label>
            <p className="text-lg">{matakuliahItem.kode}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-600">
              Nama Mata Kuliah
            </label>
            <p className="text-lg">{matakuliahItem.nama}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-600">SKS</label>
            <p className="text-lg">{matakuliahItem.sks}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MatakuliahDetail;
