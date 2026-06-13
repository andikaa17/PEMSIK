import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MatakuliahTable from "./MatakuliahTable";
import MatakuliahModal from "./MatakuliahModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useMatakuliah,
  useStoreMatakuliah,
  useUpdateMatakuliah,
  useDeleteMatakuliah,
} from "@/Utils/Hooks/useMatakuliah";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const Matakuliah = () => {
  const { user } = useAuthStateContext();
  const [selectedMatakuliah, setSelectedMatakuliah] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: matakuliah = [] } = useMatakuliah();
  const { mutate: store } = useStoreMatakuliah();
  const { mutate: update } = useUpdateMatakuliah();
  const { mutate: remove } = useDeleteMatakuliah();

  const resetForm = () => {
    setSelectedMatakuliah(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setSelectedMatakuliah(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mk) => {
    setSelectedMatakuliah(mk);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const isEdit = !!selectedMatakuliah;

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedMatakuliah.id, data: formData });
        resetForm();
      });
    } else {
      const exists = matakuliah.find((m) => m.kode === formData.kode);
      if (exists) {
        toastError("Kode Mata Kuliah sudah terdaftar!");
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
            Daftar Mata Kuliah
          </Heading>
          {user?.permission?.includes("matakuliah.create") && (
            <Button onClick={openAddModal}>+ Tambah Mata Kuliah</Button>
          )}
        </div>

        {user?.permission?.includes("matakuliah.read") && (
          <MatakuliahTable
            matakuliah={matakuliah}
            openEditModal={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <MatakuliahModal
        isModalOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        selectedMatakuliah={selectedMatakuliah}
      />
    </>
  );
};

export default Matakuliah;
