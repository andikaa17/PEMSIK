import { useState, useEffect } from "react";
import Modal from "@/Pages/Admin/Components/Modal";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { getAllMatakuliah } from "@/Utils/Apis/MatakuliahApi";

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
    status: true,
  });

  const [kodeError, setKodeError] = useState("");
  const [isKodeExist, setIsKodeExist] = useState(false);
  const [allMatakuliah, setAllMatakuliah] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      getAllMatakuliah()
        .then((res) => {
          setAllMatakuliah(res.data || []);
        })
        .catch((err) => {
          console.error("Gagal fetch matakuliah:", err);
          toastError("Gagal memuat data mata kuliah");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isModalOpen]);

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
      setKodeError("");
      setIsKodeExist(false);
    } else {
      setForm({ kode: "", nama: "", sks: "", status: true });
      setKodeError("");
      setIsKodeExist(false);
    }
  }, [selectedMatakuliah, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "kode") {
      const trimmedKode = value.trim();

      if (trimmedKode === "") {
        setKodeError("");
        setIsKodeExist(false);
        return;
      }

      const exists = allMatakuliah.some(
        (m) =>
          m.kode?.toUpperCase() === trimmedKode.toUpperCase() &&
          (!selectedMatakuliah || m.id !== selectedMatakuliah.id),
      );

      if (exists) {
        setKodeError(
          "Kode ini sudah terdaftar di Sistem, Gunakan kode yang berbeda",
        );
        setIsKodeExist(true);
      } else {
        setKodeError("");
        setIsKodeExist(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.kode.trim()) {
      toastError("Kode mata kuliah wajib diisi!");
      return;
    }

    if (!form.nama.trim()) {
      toastError("Nama mata kuliah wajib diisi!");
      return;
    }

    if (!form.sks || form.sks < 1) {
      toastError("SKS wajib diisi minimal 1!");
      return;
    }

    if (form.sks > 6) {
      toastError("SKS maksimal 6!");
      return;
    }

    const exists = allMatakuliah.some(
      (m) =>
        m.kode?.toUpperCase() === form.kode?.toUpperCase() &&
        (!selectedMatakuliah || m.id !== selectedMatakuliah.id),
    );

    if (exists) {
      toastError("Kode mata kuliah sudah terdaftar!");
      return;
    }

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
          <div className="relative">
            <Input
              type="text"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              readOnly={!!selectedMatakuliah}
              placeholder="Masukkan kode (contoh: MK101)"
              className={`w-full border px-3 py-2 rounded pr-24 ${
                kodeError ? "border-red-500" : "border-gray-300"
              }`}
              required
              disabled={loading}
            />
            {form.kode.trim() && !loading && (
              <span
                className={`absolute right-2 top-2 px-2 py-1 text-xs rounded ${
                  isKodeExist
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isKodeExist ? "Terdaftar" : "Tersedia"}
              </span>
            )}
          </div>
          {kodeError && (
            <p className="text-red-500 text-sm mt-1">{kodeError}</p>
          )}
          {!kodeError && form.kode.trim() && !isKodeExist && !loading && (
            <p className="text-green-500 text-sm mt-1">
              Kode tersedia, bisa digunakan
            </p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="nama">Nama Mata Kuliah</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama mata kuliah"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="sks">SKS</Label>
          <Input
            type="number"
            name="sks"
            value={form.sks}
            onChange={handleChange}
            placeholder="Masukkan jumlah SKS"
            min="1"
            max="6"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="status">Status</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="status"
              id="status"
              checked={form.status}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <Label htmlFor="status" className="mb-0 cursor-pointer">
              {form.status ? "Aktif" : "Tidak Aktif"}
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!!kodeError || isKodeExist || loading}
          >
            {loading ? "Memuat..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MatakuliahModal;
