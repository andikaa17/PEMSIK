import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMatakuliah } from "@/Utils/Apis/MataKuliahApi";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
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
        const [resKelas, resMataKuliah] = await Promise.all([
          getAllKelas(),
          getAllMatakuliah(),
        ]);
        setKelas(resKelas.data || []);
        setMataKuliah(resMataKuliah.data || []);
      } catch (error) {
        console.error("Error fetching kelas:", error);
      }
    };
    fetchData();
  }, []);

  const getTotalSks = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => mataKuliah.find((mk) => mk.id === k.matakuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMahasiswa,
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: mahasiswa = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const resetForm = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const isEdit = !!selectedMahasiswa;

    if (isEdit) {
      confirmUpdate(
        `Update Mahasiswa`,
        `Apakah Anda yakin ingin memperbarui data ${selectedMahasiswa?.nama || "mahasiswa"}?`,
        () => {
          update({ id: selectedMahasiswa.id, data: formData });
          resetForm();
          toastSuccess("Mahasiswa berhasil diupdate!");
        },
      );
    } else {
      const exists = mahasiswa.find((m) => m.nim === formData.nim);
      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      store(formData);
      toastSuccess("Mahasiswa berhasil ditambahkan");
      resetForm();
    }
  };

  const handleDelete = (id) => {
    const mahasiswaItem = mahasiswa.find((m) => m.id === id);
    confirmDelete(
      `Hapus Mahasiswa`,
      `Apakah Anda yakin ingin menghapus ${mahasiswaItem?.nama || "data"} ?`,
      () => {
        remove(id);
        toastSuccess(`Mahasiswa ${mahasiswaItem?.nama || ""} berhasil dihapus`);
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
            Daftar Mahasiswa
          </Heading>
          {user?.role === "admin" && (
            <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari nama/NIM..."
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
            <option value="nim">Sort by NIM</option>
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

        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
          isLoading={isLoadingMahasiswa}
          getTotalSks={getTotalSks}
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
                disabled={page === 1 || isLoadingMahasiswa}
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Halaman {page} dari {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={handleNext}
                disabled={page === totalPages || isLoadingMahasiswa}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
        mahasiswa={mahasiswa}
      />
    </>
  );
};

export default Mahasiswa;
