import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import KelasModal from "./KelasModal";
import KelasTable from "./KelasTable";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Utils/Hooks/useKelas";
import { useMatakuliah } from "@/Utils/Hooks/useMatakuliah";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";

const Kelas = () => {
  const { user } = useAuthStateContext();
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const { data: result = { data: [], total: 0 }, isLoading: isLoadingKelas } =
    useKelas({
      q: search,
      _sort: sortBy,
      _order: sortOrder,
      _page: page,
      _limit: limit,
    });

  const { data: kelas = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  const { data: resultMatakuliah = { data: [] } } = useMatakuliah();
  const { data: resultDosen = { data: [] } } = useDosen();
  const matakuliah = resultMatakuliah.data;
  const dosen = resultDosen.data;

  const matakuliahBelumAdaKelas = matakuliah.filter(
    (m) => m.status !== false && !kelas.some((k) => k.matakuliah_id === m.id),
  );

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

    const existingKelas = kelas.find(
      (k) =>
        k.id !== selectedKelas?.id &&
        k.matakuliah_id === formData.matakuliah_id,
    );

    if (existingKelas) {
      toastError("Mata kuliah ini sudah memiliki kelas!");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedKelas.id, data: formData });
        resetForm();
        toastSuccess("Kelas berhasil diupdate!");
      });
    } else {
      const exists = kelas.find((k) => k.kode === formData.kode);
      if (exists) {
        toastError("Kode Kelas sudah terdaftar!");
        return;
      }
      store(formData);
      toastSuccess("Kelas berhasil ditambahkan");
      resetForm();
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

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

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari kode/nama kelas..."
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
            <option value="hari">Sort by Hari</option>
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

        {user?.permission?.includes("kelas.read") && (
          <KelasTable
            kelas={kelas}
            matakuliah={matakuliah}
            dosen={dosen}
            openEditModal={openEditModal}
            onDelete={handleDelete}
            isLoading={isLoadingKelas}
          />
        )}

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
                disabled={page === 1 || isLoadingKelas}
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Halaman {page} dari {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={handleNext}
                disabled={page === totalPages || isLoadingKelas}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      <KelasModal
        isModalOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        selectedKelas={selectedKelas}
        matakuliah={matakuliahBelumAdaKelas}
        dosen={dosen}
        listKelas={kelas}
      />
    </>
  );
};

export default Kelas;
