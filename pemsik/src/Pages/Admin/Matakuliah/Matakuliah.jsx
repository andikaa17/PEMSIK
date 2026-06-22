import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MatakuliahModal from "./MatakuliahModal";
import MatakuliahTable from "./MatakuliahTable";
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
  const queryClient = useQueryClient();
  const [selectedMatakuliah, setSelectedMatakuliah] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMatakuliah,
    refetch,
  } = useMatakuliah({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: matakuliah = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  const cachedData = queryClient.getQueryData(["matakuliah"]);
  const allMatakuliah = cachedData?.data || [];

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
    refetch();
  };

  const openEditModal = (mk) => {
    setSelectedMatakuliah(mk);
    setIsModalOpen(true);
    refetch();
  };

  const handleSubmit = (formData) => {
    const isEdit = !!selectedMatakuliah;

    if (isEdit) {
      confirmUpdate(
        `Update Mata Kuliah`,
        `Apakah Anda yakin ingin memperbarui data ${selectedMatakuliah?.nama || "mata kuliah"}?`,
        () => {
          update({ id: selectedMatakuliah.id, data: formData });
          resetForm();
          setTimeout(() => refetch(), 300);
        },
      );
    } else {
      const exists = allMatakuliah.find(
        (m) => m.kode?.toUpperCase() === formData.kode?.toUpperCase(),
      );
      if (exists) {
        toastError("Kode Mata Kuliah sudah terdaftar!");
        return;
      }
      store(formData);
      resetForm();
      setTimeout(() => refetch(), 300);
    }
  };

  const handleDelete = (id) => {
    const matkulItem = matakuliah.find((m) => m.id === id);
    confirmDelete(
      `Hapus Mata Kuliah`,
      `Apakah Anda yakin ingin menghapus ${matkulItem?.nama || "data"}?`,
      () => {
        remove(id);
        setTimeout(() => refetch(), 300);
      },
    );
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mata Kuliah
          </Heading>
          {user?.role === "admin" && (
            <Button onClick={openAddModal}>+ Tambah Mata Kuliah</Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari kode/nama mata kuliah..."
            className="border px-3 py-1 rounded flex-grow"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="id">Sort by ID</option>
            <option value="kode">Sort by Kode</option>
            <option value="nama">Sort by Nama</option>
            <option value="sks">Sort by SKS</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={25}>25 / halaman</option>
          </select>
        </div>

        <MatakuliahTable
          matakuliah={matakuliah}
          openEditModal={openEditModal}
          onDelete={handleDelete}
          isLoading={isLoadingMatakuliah}
        />

        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm">
              Menampilkan {Math.min((page - 1) * limit + 1, totalCount)} -{" "}
              {Math.min(page * limit, totalCount)} dari {totalCount} data
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={handlePrev}
                disabled={page === 1 || isLoadingMatakuliah}
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Halaman {page} dari {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={handleNext}
                disabled={page === totalPages || isLoadingMatakuliah}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      <MatakuliahModal
        isModalOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        selectedMatakuliah={selectedMatakuliah}
        matakuliah={allMatakuliah}
      />
    </>
  );
};

export default Matakuliah;
