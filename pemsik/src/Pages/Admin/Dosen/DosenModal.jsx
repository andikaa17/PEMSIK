import { useState, useEffect } from "react";
import Modal from "@/Pages/Admin/Components/Modal";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const DosenModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedDosen,
  dosen,
}) => {
  const [form, setForm] = useState({
    nidn: "",
    nama: "",
    max_sks: "",
    status: true,
  });

  useEffect(() => {
    if (selectedDosen) {
      setForm({
        nidn: selectedDosen.nidn || "",
        nama: selectedDosen.nama || "",
        max_sks: selectedDosen.max_sks || "",
        status: selectedDosen.status ?? true,
      });
    } else {
      setForm({ nidn: "", nama: "", max_sks: "", status: true });
    }
  }, [selectedDosen, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nidn.trim() || !form.nama.trim()) {
      toastError("NIDN dan Nama wajib diisi");
      return;
    }

    if (!form.max_sks || form.max_sks < 1) {
      toastError("Max SKS harus diisi minimal 1");
      return;
    }

    const exists = dosen?.find(
      (d) =>
        d.nidn === form.nidn && (!selectedDosen || d.id !== selectedDosen.id),
    );

    if (exists) {
      toastError("NIDN sudah terdaftar!");
      return;
    }

    const namaLower = form.nama.toLowerCase();

    const payload = {
      ...form,
      email: `${namaLower}@dosen.ac.id`,
      password: `${namaLower}123`,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedDosen ? "Edit Dosen" : "Tambah Dosen"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="nidn">NIDN</Label>
          <Input
            type="text"
            name="nidn"
            value={form.nidn}
            onChange={handleChange}
            readOnly={!!selectedDosen}
            placeholder="Masukkan NIDN"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="nama">Nama</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan Nama"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="max_sks">Max SKS</Label>
          <Input
            type="number"
            name="max_sks"
            value={form.max_sks}
            onChange={handleChange}
            placeholder="Masukkan Max SKS"
            min="1"
            required
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="status"
            id="status"
            checked={form.status}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="status" className="mb-0 cursor-pointer">
            Aktif
          </Label>
        </div>

        {/* Informasi Login */}
        <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
          <p className="text-sm text-blue-700">
            <strong>Informasi Login:</strong>
          </p>
          <p className="text-sm text-blue-600">
            Email: <strong>{form.nama.toLowerCase()}@dosen.ac.id</strong>
          </p>
          <p className="text-sm text-blue-600">
            Password: <strong>{form.nama.toLowerCase()}123</strong>
          </p>
          <p className="text-xs text-blue-500 mt-1">
            * Password default = nama + 123 (huruf kecil semua)
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DosenModal;
