import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import { mahasiswaList } from "@/Data/Dummy";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState(mahasiswaList);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const storeMahasiswa = (newData) => {
    setMahasiswa([...mahasiswa, newData]);
  };

  const updateMahasiswa = (updatedData) => {
    const updated = mahasiswa.map((item) =>
      item.nim === updatedData.nim ? updatedData : item
    );
    setMahasiswa(updated);
  };

  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((item) => item.nim !== nim);
    setMahasiswa(filtered);
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setSelectedMahasiswa(null);
  };

  const openEditModal = (mhs) => {
    setIsModalOpen(true);
    setSelectedMahasiswa(mhs);
  };

  const handleSubmit = (formData) => {
    if (selectedMahasiswa) {
      const confirmUpdate = confirm("Yakin ingin update data ini?");
      if (!confirmUpdate) return;

      updateMahasiswa(formData);
    } else {
      storeMahasiswa(formData);
    }
  };

  const handleDelete = (nim) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      deleteMahasiswa(nim);
    }
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

        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
        mahasiswa={mahasiswa}
      />
    </>
  );
};

export default Mahasiswa;