import { useParams, Link } from "react-router-dom";
import { useKelas } from "@/Utils/Hooks/useKelas";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

const KelasDetail = () => {
  const { id } = useParams();
  const { data: kelas = [] } = useKelas();
  const kelasItem = kelas.find((k) => k.id == id);

  if (!kelasItem) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-500">Data kelas tidak ditemukan</p>
          <Link to="/admin/kelas">
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
          Detail Kelas
        </Heading>
        <Link to="/admin/kelas">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-600">Nama Kelas</label>
            <p className="text-lg">{kelasItem.nama}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Tahun</label>
            <p className="text-lg">{kelasItem.tahun}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KelasDetail;
