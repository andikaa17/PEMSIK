import { useState, useEffect } from "react";
import Modal from "@/Pages/Admin/Components/Modal";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";

const KelasModal = ({ isModalOpen, onClose, onSubmit, selectedKelas }) => {
  const [form, setForm] = useState({
    nama: "",
    tahun: "",
  });

  useEffect(() => {
    if (selectedKelas) {
      setForm({
        nama: selectedKelas.nama || "",
        tahun: selectedKelas.tahun || "",
      });
    } else {
      setForm({ nama: "", tahun: "" });
    }
  }, [selectedKelas, isModalOpen]);

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
      title={selectedKelas ? "Edit Kelas" : "Tambah Kelas"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="nama">Nama Kelas</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="tahun">Tahun</Label>
          <Input
            type="number"
            name="tahun"
            value={form.tahun}
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

export default KelasModal;
