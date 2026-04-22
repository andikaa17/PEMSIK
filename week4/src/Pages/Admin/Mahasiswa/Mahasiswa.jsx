import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";

import { mahasiswaList } from "@/Data/Dummy";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState(mahasiswaList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true,
  });

  const openAddModal = () => {
    setForm({
      nim: "",
      nama: "",
      status: true,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addMahasiswa = (newData) => {
    setMahasiswa([...mahasiswa, newData]);
  };

  const updateMahasiswa = (nim, newData) => {
    const updated = mahasiswa.map((mhs) =>
      mhs.nim === nim ? { ...mhs, ...newData } : mhs,
    );
    setMahasiswa(updated);
  };

  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((mhs) => mhs.nim !== nim);
    setMahasiswa(filtered);
  };

  const handleEdit = (mhs) => {
    setForm({
      nim: mhs.nim,
      nama: mhs.nama,
      status: mhs.status,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (nim) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      deleteMahasiswa(nim);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      alert("Data kurang terisi");
      return;
    }

    if (isEdit) {
      const confirmUpdate = confirm("Yakin ingin update data ini?");
      if (!confirmUpdate) return;

      updateMahasiswa(form.nim, form);
    } else {
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        alert("NIM sudah terdaftar!");
        return;
      }

      addMahasiswa(form);
    }

    setForm({
      nim: "",
      nama: "",
      status: true,
    });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>
          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        </div>

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">NIM</th>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-center">Status</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((mhs, index) => (
              <tr
                key={mhs.nim}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="py-2 px-4">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama}</td>
                <td className="py-2 px-4 text-center">
                  {mhs.status ? "Aktif" : "Tidak Aktif"}
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  <Link
                    to={`/admin/mahasiswa/${mhs.nim}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Detail
                  </Link>

                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEdit(mhs)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(mhs.nim)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
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
                  readOnly={isEdit}
                  placeholder="Masukkan NIM"
                  required
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
                  required
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Mahasiswa;
