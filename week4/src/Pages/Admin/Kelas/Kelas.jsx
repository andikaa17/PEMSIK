import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import KelasTable from "./KelasTable";
import KelasModal from "./KelasModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Utils/Hooks/useKelas";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const Kelas = () => {
  const { user } = useAuthStateContext();
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: kelas = [] } = useKelas();
  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  const resetForm = () => {
    setSelectedKelas(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setSelectedKelas(null);
    setIsModalOpen(true);
  };

  const openEditModal = (k) => {
    setSelectedKelas(k);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const isEdit = !!selectedKelas;

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedKelas.id, data: formData });
        resetForm();
      });
    } else {
      const exists = kelas.find(
        (k) => k.nama === formData.nama && k.tahun === formData.tahun,
      );
      if (exists) {
        toastError("Kelas sudah terdaftar!");
        return;
      }
      store(formData);
      resetForm();
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Kelas
          </Heading>
          {user?.permission?.includes("kelas.create") && (
            <Button onClick={openAddModal}>+ Tambah Kelas</Button>
          )}
        </div>

        {user?.permission?.includes("kelas.read") && (
          <KelasTable
            kelas={kelas}
            openEditModal={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <KelasModal
        isModalOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        selectedKelas={selectedKelas}
      />
    </>
  );
};

export default Kelas;
