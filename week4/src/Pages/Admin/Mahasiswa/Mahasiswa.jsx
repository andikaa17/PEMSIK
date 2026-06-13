import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";

import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMahasiswa = async () => {
    try {
      const response = await getAllMahasiswa();
      setMahasiswa(response.data);
    } catch (error) {
      toastError("Gagal mengambil data mahasiswa");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const handleStoreMahasiswa = async (newData) => {
    try {
      const dataToSend = {
        nim: newData.nim,
        nama: newData.nama,
        status: newData.status === true || newData.status === "true",
      };

      await storeMahasiswa(dataToSend);
      toastSuccess("Data mahasiswa berhasil ditambahkan");
      fetchMahasiswa();
      return true;
    } catch (error) {
      toastError("Data mahasiswa gagal ditambahkan");
      console.error(error);
      return false;
    }
  };

  const handleUpdateMahasiswa = async (updatedData) => {
    try {
      const idToUpdate = updatedData.id || selectedMahasiswa?.id;

      if (!idToUpdate) {
        toastError("ID tidak ditemukan untuk update");
        return false;
      }

      const dataToSend = {
        nim: updatedData.nim,
        nama: updatedData.nama,
        status: updatedData.status === true || updatedData.status === "true",
      };

      await updateMahasiswa(idToUpdate, dataToSend);
      toastSuccess("Data mahasiswa berhasil diperbarui");
      fetchMahasiswa();
      return true;
    } catch (error) {
      toastError("Data mahasiswa gagal diperbarui");
      console.error(error);
      return false;
    }
  };

  const handleDeleteMahasiswa = async (id) => {
    try {
      await deleteMahasiswa(id);
      toastSuccess("Data mahasiswa berhasil dihapus");
      fetchMahasiswa();
      return true;
    } catch (error) {
      toastError("Data mahasiswa gagal dihapus");
      console.error(error);
      return false;
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setSelectedMahasiswa(null);
  };

  const openEditModal = (mhs) => {
    setIsModalOpen(true);
    setSelectedMahasiswa(mhs);
  };

  const handleSubmit = async (formData) => {
    let success = false;

    if (selectedMahasiswa) {
      const dataWithId = { ...formData, id: selectedMahasiswa.id };

      await confirmUpdate(async () => {
        success = await handleUpdateMahasiswa(dataWithId);
        if (success) setIsModalOpen(false);
      });
    } else {
      success = await handleStoreMahasiswa(formData);
      if (success) setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      await handleDeleteMahasiswa(id);
    });
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <p>Memuat data mahasiswa...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>
          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
          )}
        </div>

        {user?.permission?.includes("mahasiswa.read") && (
          <MahasiswaTable
            mahasiswa={mahasiswa}
            openEditModal={openEditModal}
            onDelete={handleDelete}
          />
        )}
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
