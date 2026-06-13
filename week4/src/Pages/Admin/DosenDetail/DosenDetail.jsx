import { useParams, Link } from "react-router-dom";
import { useDosen } from "@/Utils/Hooks/useDosen";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

const DosenDetail = () => {
  const { id } = useParams();
  const { data: dosen = [] } = useDosen();

  // Cari dengan string (tidak perlu parseInt)
  const dosenItem = dosen.find((d) => d.id == id);

  if (!dosenItem) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-500">Data dosen tidak ditemukan</p>
          <Link to="/admin/dosen">
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
          Detail Dosen
        </Heading>
        <Link to="/admin/dosen">
          <Button variant="secondary">Kembali</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-600">NIDN</label>
            <p className="text-lg">{dosenItem.nidn}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Nama Lengkap</label>
            <p className="text-lg">{dosenItem.nama}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Email</label>
            <p className="text-lg">{dosenItem.email}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DosenDetail;
