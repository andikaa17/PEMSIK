import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import DosenTable from "./DosenTable";
import DosenModal from "./DosenModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Utils/Hooks/useDosen";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const Dosen = () => {
  const { user } = useAuthStateContext();
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dosen = [] } = useDosen();
  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  const resetForm = () => {
    setSelectedDosen(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setSelectedDosen(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dosen) => {
    setSelectedDosen(dosen);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const isEdit = !!selectedDosen;

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedDosen.id, data: formData });
        resetForm();
      });
    } else {
      const exists = dosen.find((d) => d.nidn === formData.nidn);
      if (exists) {
        toastError("NIDN sudah terdaftar!");
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
            Daftar Dosen
          </Heading>
          {user?.permission?.includes("dosen.create") && (
            <Button onClick={openAddModal}>+ Tambah Dosen</Button>
          )}
        </div>

        {user?.permission?.includes("dosen.read") && (
          <DosenTable
            dosen={dosen}
            openEditModal={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <DosenModal
        isModalOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        selectedDosen={selectedDosen}
      />
    </>
  );
};

export default Dosen;
