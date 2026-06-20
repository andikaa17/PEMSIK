import { useState, useEffect } from "react";
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
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMatakuliah } from "@/Utils/Apis/MataKuliahApi";

const Dosen = () => {
  const { user } = useAuthStateContext();
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKelas, resMatkul] = await Promise.all([
          getAllKelas(),
          getAllMatakuliah(),
        ]);
        setKelas(resKelas.data || []);
        setMataKuliah(resMatkul.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { data: result = { data: [], total: 0 }, isLoading: isLoadingDosen } =
    useDosen({
      q: search,
      _sort: sortBy,
      _order: sortOrder,
      _page: page,
      _limit: limit,
    });

  const { data: dosen = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

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
      confirmUpdate(
        `Update Dosen`,
        `Apakah Anda yakin ingin memperbarui data ${selectedDosen?.nama || "dosen"} ?`,
        () => {
          update({ id: selectedDosen.id, data: formData });
          resetForm();
          toastSuccess("Dosen berhasil diupdate!");
        },
      );
    } else {
      const exists = dosen.find((d) => d.nidn === formData.nidn);
      if (exists) {
        toastError("NIDN sudah terdaftar!");
        return;
      }
      store(formData);
      toastSuccess("Dosen berhasil ditambahkan");
      resetForm();
    }
  };

  const handleDelete = (id) => {
    const dosenItem = dosen.find((d) => d.id === id);
    confirmDelete(
      `Hapus Dosen`,
      `Apakah Anda yakin ingin menghapus ${dosenItem?.nama || "data"}?`,
      () => {
        remove(id);
        toastSuccess(`Dosen ${dosenItem?.nama || ""} berhasil dihapus`);
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
            Daftar Dosen
          </Heading>
          {user?.role === "admin" && (
            <Button onClick={openAddModal}>+ Tambah Dosen</Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari nama/NIDN..."
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
            <option value="nama">Sort by Nama</option>
            <option value="nidn">Sort by NIDN</option>
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

        <DosenTable
          dosen={dosen}
          kelas={kelas}
          mataKuliah={mataKuliah}
          openEditModal={openEditModal}
          onDelete={handleDelete}
          isLoading={isLoadingDosen}
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
                disabled={page === 1 || isLoadingDosen}
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Halaman {page} dari {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={handleNext}
                disabled={page === totalPages || isLoadingDosen}
              >
                Next
              </button>
            </div>
          </div>
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
