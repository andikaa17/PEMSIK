import { useEffect, useState } from "react";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMahasiswa,
  mahasiswa,
}) => {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true,
  });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        status: selectedMahasiswa.status,
      });
    } else {
      setForm({
        nim: "",
        nama: "",
        status: true,
      });
    }
  }, [selectedMahasiswa, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim.trim() || !form.nama.trim()) {
      toastError("Data kurang terisi");
      return;
    }

    const exists = mahasiswa.find(
      (m) =>
        m.nim === form.nim &&
        (!selectedMahasiswa || m.nim !== selectedMahasiswa.nim)
    );

    if (exists) {
      toastError("NIM sudah terdaftar!");
      return;
    }

    onSubmit(form);

    setForm({
      nim: "",
      nama: "",
      status: true,
    });

    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={!!selectedMahasiswa}
              placeholder="Masukkan NIM"
            />
          </div>

          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
              />
              <span>{form.status ? "Aktif" : "Tidak Aktif"}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;