import { useState, useEffect } from "react";
import Modal from "@/Pages/Admin/Components/Modal";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Admin/Components/Input";
import Label from "@/Pages/Admin/Components/Label";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const KelasModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedKelas,
  matakuliah,
  dosen,
  listKelas = [],
}) => {
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    tahun: "",
    semester: "",
    matakuliah_id: "",
    dosen_id: "",
    ruangan: "",
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
    kapasitas: "",
    mahasiswa_ids: [],
    status: true,
  });

  const [kodeError, setKodeError] = useState("");
  const [isKodeExist, setIsKodeExist] = useState(false);

  const listMatakuliah = Array.isArray(matakuliah) ? matakuliah : [];
  const listDosen = Array.isArray(dosen) ? dosen : [];

  useEffect(() => {
    if (selectedKelas) {
      setForm({
        kode: selectedKelas.kode || "",
        nama: selectedKelas.nama || "",
        tahun: selectedKelas.tahun || "",
        semester: selectedKelas.semester || "",
        matakuliah_id: selectedKelas.matakuliah_id || "",
        dosen_id: selectedKelas.dosen_id || "",
        ruangan: selectedKelas.ruangan || "",
        hari: selectedKelas.hari || "",
        jam_mulai: selectedKelas.jam_mulai || "",
        jam_selesai: selectedKelas.jam_selesai || "",
        kapasitas: selectedKelas.kapasitas || "",
        mahasiswa_ids: selectedKelas.mahasiswa_ids || [],
        status:
          selectedKelas.status !== undefined ? selectedKelas.status : true,
      });
      setKodeError("");
      setIsKodeExist(false);
    } else {
      setForm({
        kode: "",
        nama: "",
        tahun: new Date().getFullYear().toString(),
        semester: "Genap",
        matakuliah_id: "",
        dosen_id: "",
        ruangan: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
        kapasitas: "",
        mahasiswa_ids: [],
        status: true,
      });
      setKodeError("");
      setIsKodeExist(false);
    }
  }, [selectedKelas, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    if (
      name === "matakuliah_id" ||
      name === "dosen_id" ||
      name === "kapasitas"
    ) {
      finalValue = value ? Number(value) : "";
    }
    setForm({ ...form, [name]: type === "checkbox" ? checked : finalValue });

    if (name === "kode") {
      const trimmedKode = value.trim().toUpperCase();

      if (trimmedKode === "") {
        setKodeError("");
        setIsKodeExist(false);
        return;
      }

      const exists = listKelas.some(
        (k) =>
          k.kode?.toUpperCase() === trimmedKode &&
          (!selectedKelas || k.id !== selectedKelas.id),
      );

      if (exists) {
        setKodeError("Kode kelas sudah terdaftar di sistem!");
        setIsKodeExist(true);
      } else {
        setKodeError("");
        setIsKodeExist(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.kode.trim()) {
      toastError("Kode kelas wajib diisi!");
      return;
    }

    if (!form.nama.trim()) {
      toastError("Nama kelas wajib diisi!");
      return;
    }

    if (!form.tahun.trim()) {
      toastError("Tahun wajib diisi!");
      return;
    }

    if (!form.matakuliah_id) {
      toastError("Mata kuliah wajib dipilih!");
      return;
    }

    if (!form.dosen_id) {
      toastError("Dosen pengajar wajib dipilih!");
      return;
    }

    if (!form.ruangan.trim()) {
      toastError("Ruangan wajib diisi!");
      return;
    }

    if (!form.hari) {
      toastError("Hari wajib dipilih!");
      return;
    }

    if (!form.jam_mulai) {
      toastError("Jam mulai wajib diisi!");
      return;
    }

    if (!form.jam_selesai) {
      toastError("Jam selesai wajib diisi!");
      return;
    }

    if (!form.kapasitas || form.kapasitas < 1) {
      toastError("Kapasitas wajib diisi minimal 1!");
      return;
    }

    const kodeExists = listKelas.some(
      (k) =>
        k.kode?.toUpperCase() === form.kode?.toUpperCase() &&
        (!selectedKelas || k.id !== selectedKelas.id),
    );

    if (kodeExists) {
      toastError("Kode kelas sudah terdaftar!");
      return;
    }

    const matkulId = form.matakuliah_id ? Number(form.matakuliah_id) : null;
    const dosenId = form.dosen_id ? Number(form.dosen_id) : null;

    const existingKelas = listKelas.find(
      (k) => k.id !== selectedKelas?.id && k.matakuliah_id === matkulId,
    );

    if (existingKelas) {
      const dosenExisting = listDosen.find(
        (d) => d.id === existingKelas.dosen_id,
      );
      toastError(
        `Mata kuliah ini sudah diampu oleh ${dosenExisting?.nama || "dosen lain"}!`,
      );
      return;
    }

    const submitData = {
      ...form,
      matakuliah_id: matkulId,
      dosen_id: dosenId,
      kapasitas: form.kapasitas ? Number(form.kapasitas) : null,
      mahasiswa_ids: form.mahasiswa_ids || [],
    };

    onSubmit(submitData);
    onClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedKelas ? "Edit Kelas" : "Tambah Kelas"}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="kode">Kode Kelas</Label>
            <div className="relative">
              <Input
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                readOnly={!!selectedKelas}
                placeholder="Masukkan Kode"
                className={`w-full border px-3 py-2 rounded pr-24 ${
                  kodeError ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {form.kode.trim() && (
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
            {!kodeError && form.kode.trim() && !isKodeExist && (
              <p className="text-green-500 text-sm mt-1">
                Kode tersedia, bisa digunakan
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="nama">Nama Kelas</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama "
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="tahun">Tahun</Label>
            <Input
              type="text"
              name="tahun"
              value={form.tahun}
              onChange={handleChange}
              placeholder="Masukkan tahun"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="semester">Semester</Label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>

          <div className="mb-4">
            <Label htmlFor="matakuliah_id">Mata Kuliah</Label>
            <select
              name="matakuliah_id"
              value={form.matakuliah_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Mata Kuliah</option>
              {listMatakuliah.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama} ({item.sks} SKS)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <Label htmlFor="dosen_id">Dosen Pengajar</Label>
            <select
              name="dosen_id"
              value={form.dosen_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Dosen</option>
              {listDosen.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nidn} - {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <Label htmlFor="ruangan">Ruangan</Label>
            <Input
              type="text"
              name="ruangan"
              value={form.ruangan}
              onChange={handleChange}
              placeholder="Masukkan ruangan"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="hari">Hari</Label>
            <select
              name="hari"
              value={form.hari}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Pilih Hari</option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
            </select>
          </div>

          <div className="mb-4">
            <Label htmlFor="jam_mulai">Jam Mulai</Label>
            <Input
              type="time"
              name="jam_mulai"
              value={form.jam_mulai}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="jam_selesai">Jam Selesai</Label>
            <Input
              type="time"
              name="jam_selesai"
              value={form.jam_selesai}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="kapasitas">Kapasitas</Label>
            <Input
              type="number"
              name="kapasitas"
              value={form.kapasitas}
              onChange={handleChange}
              placeholder="Masukkan kapasitas"
              min="1"
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
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!!kodeError || isKodeExist}
          >
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default KelasModal;
