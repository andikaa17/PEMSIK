import { useState, useEffect } from "react";
import Modal from "@/Pages/Admin/Components/Modal";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";

const MatakuliahModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMatakuliah,
  matakuliah,
}) => {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    sks: "",
    status: true,
  });

  useEffect(() => {
    if (selectedMatakuliah) {
      setForm({
        kode: selectedMatakuliah.kode || "",
        nama: selectedMatakuliah.nama || "",
        sks: selectedMatakuliah.sks || "",
        status:
          selectedMatakuliah.status !== undefined
            ? selectedMatakuliah.status
            : true,
      });
    } else {
      setForm({ kode: "", nama: "", sks: "", status: true });
    }
  }, [selectedMatakuliah, isModalOpen]);

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
    onClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedMatakuliah ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="kode">Kode Mata Kuliah</Label>
          <Input
            type="text"
            name="kode"
            value={form.kode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="nama">Nama Mata Kuliah</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="sks">SKS</Label>
          <Input
            type="number"
            name="sks"
            value={form.sks}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="status">Status</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>{form.status ? "Aktif" : "Tidak Aktif"}</span>
          </div>
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

export default MatakuliahModal;
