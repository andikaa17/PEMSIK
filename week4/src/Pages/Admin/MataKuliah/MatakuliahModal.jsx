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
}) => {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    sks: "",
  });

  useEffect(() => {
    if (selectedMatakuliah) {
      setForm({
        kode: selectedMatakuliah.kode || "",
        nama: selectedMatakuliah.nama || "",
        sks: selectedMatakuliah.sks || "",
      });
    } else {
      setForm({ kode: "", nama: "", sks: "" });
    }
  }, [selectedMatakuliah, isModalOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
