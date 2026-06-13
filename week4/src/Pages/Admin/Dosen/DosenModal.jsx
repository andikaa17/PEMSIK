import { useState, useEffect } from "react";
import Modal from "@/Pages/Admin/Components/Modal";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";

const DosenModal = ({ isModalOpen, onClose, onSubmit, selectedDosen }) => {
  const [form, setForm] = useState({
    nidn: "",
    nama: "",
    email: "",
    status: true,
  });

  useEffect(() => {
    if (selectedDosen) {
      setForm({
        nidn: selectedDosen.nidn || "",
        nama: selectedDosen.nama || "",
        email: selectedDosen.email || "",
        status: selectedDosen.status ?? true,
      });
    } else {
      setForm({ nidn: "", nama: "", email: "", status: true });
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
    onSubmit(form);
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
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
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
