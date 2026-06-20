import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  getAllKelas,
  updateKelas,
  deleteKelas,
  storeKelas,
} from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMatakuliah } from "@/Utils/Apis/MataKuliahApi";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import RencanaStudiTable from "./RencanaStudiTable";
import KelasModal from "@/Pages/Admin/Kelas/KelasModal";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";

import { exportRencanaStudiPDF } from "@/Pages/Admin/Components/ExportPDF";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resKelas, resDosen, resMahasiswa, resMataKuliah] =
        await Promise.all([
          getAllKelas(),
          getAllDosen(),
          getAllMahasiswa(),
          getAllMatakuliah(),
        ]);
      setKelas(resKelas.data || []);
      setDosen(resDosen.data || []);
      setMahasiswa(resMahasiswa.data || []);
      setMataKuliah(resMataKuliah.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toastError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredKelas =
    user?.role === "mahasiswa"
      ? kelas.filter((k) => k.mahasiswa_ids?.includes(user.id))
      : user?.role === "dosen"
        ? kelas.filter((k) => {
            const dosenItem = dosen.find(
              (d) => d.email === user.email || d.nama === user.name,
            );
            return k.dosen_id === dosenItem?.id;
          })
        : kelas;

  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (m) => m.status !== false && !kelas.some((k) => k.matakuliah_id === m.id),
  );

  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.max_sks || 0;

  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    const mhsIdNumber = Number(mhsId);

    if (!mhsIdNumber) {
      toastError("Pilih mahasiswa terlebih dahulu");
      return;
    }

    const mhs = mahasiswa.find((m) => m.id === mhsIdNumber);
    const matkul = mataKuliah.find((m) => m.id === kelasItem.matakuliah_id);
    const sks = matkul?.sks || 0;

    const totalSksMahasiswa = kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsIdNumber))
      .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const maxSks = getMaxSks(mhsIdNumber);

    if (totalSksMahasiswa + sks > maxSks) {
      toastError(
        `SKS ${mhs?.nama || ""} melebihi batas maksimal (${maxSks} SKS)`,
      );
      return;
    }

    if (kelasItem.mahasiswa_ids?.includes(mhsIdNumber)) {
      toastError(`Mahasiswa ${mhs?.nama || ""} sudah terdaftar di kelas ini`);
      return;
    }

    if (
      kelasItem.kapasitas &&
      kelasItem.mahasiswa_ids?.length >= kelasItem.kapasitas
    ) {
      toastError(`Kapasitas kelas penuh (${kelasItem.kapasitas} mahasiswa)`);
      return;
    }

    try {
      const updated = {
        ...kelasItem,
        mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), mhsIdNumber],
      };
      await updateKelas(kelasItem.id, updated);
      toastSuccess(`Mahasiswa ${mhs?.nama || ""} berhasil ditambahkan`);
      setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
      fetchData();
    } catch (error) {
      console.error("Error adding mahasiswa:", error);
      toastError("Gagal menambahkan mahasiswa");
    }
  };

  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    const mhs = mahasiswa.find((m) => m.id === mhsId);
    const matkul = mataKuliah.find((m) => m.id === kelasItem.matakuliah_id);

    confirmDelete(
      `⚠️ Hapus ${mhs?.nama || "Mahasiswa"}`,
      `Yakin ingin mengeluarkan ${mhs?.nama || ""} dari kelas ${matkul?.nama || ""}?`,
      async () => {
        try {
          const updated = {
            ...kelasItem,
            mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter(
              (id) => id !== mhsId,
            ),
          };
          await updateKelas(kelasItem.id, updated);
          toastSuccess(`Mahasiswa ${mhs?.nama || ""} berhasil dihapus`);
          fetchData();
        } catch (error) {
          console.error("Error deleting mahasiswa:", error);
          toastError("Gagal menghapus mahasiswa");
        }
      },
    );
  };

  const handleChangeDosen = async (kelasItem) => {
    const dsnId = Number(selectedDsn[kelasItem.id]);

    if (!dsnId) {
      toastError("Pilih dosen terlebih dahulu");
      return;
    }

    const matkul = mataKuliah.find((m) => m.id === kelasItem.matakuliah_id);
    const dosenBaru = dosen.find((d) => d.id === dsnId);

    const existingDosen = kelas.find(
      (k) =>
        k.id !== kelasItem.id &&
        k.matakuliah_id === kelasItem.matakuliah_id &&
        k.dosen_id === dsnId,
    );

    if (existingDosen) {
      const dosenLama = dosen.find((d) => d.id === existingDosen.dosen_id);
      toastError(
        `Mata kuliah "${matkul?.nama || ""}" sudah diampu oleh dosen ${dosenLama?.nama || "lain"}!`,
      );
      return;
    }

    const totalSksDosen = kelas
      .filter((k) => k.dosen_id === dsnId)
      .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const kelasSks =
      mataKuliah.find((m) => m.id === kelasItem.matakuliah_id)?.sks || 0;
    const maxSks = getDosenMaxSks(dsnId);

    if (totalSksDosen + kelasSks > maxSks) {
      toastError(
        `Dosen ${dosenBaru?.nama || ""} melebihi batas maksimal SKS (${maxSks} SKS)`,
      );
      return;
    }

    try {
      await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
      toastSuccess(
        `Dosen ${dosenBaru?.nama || ""} berhasil ditambahkan ke kelas ${matkul?.nama || ""}`,
      );
      setSelectedDsn((prev) => ({ ...prev, [kelasItem.id]: "" }));
      fetchData();
    } catch (error) {
      console.error("Error changing dosen:", error);
      toastError("Gagal mengganti dosen");
    }
  };

  const handleDeleteKelas = async (kelasId) => {
    const kelasItem = kelas.find((k) => k.id === kelasId);
    const matkul = mataKuliah.find((m) => m.id === kelasItem?.matakuliah_id);

    confirmDelete(
      `⚠️ Hapus Kelas ${matkul?.nama || ""}`,
      `Yakin ingin menghapus kelas ${matkul?.nama || ""} beserta semua mahasiswanya?`,
      async () => {
        try {
          await deleteKelas(kelasId);
          toastSuccess(`Kelas ${matkul?.nama || ""} berhasil dihapus`);
          fetchData();
        } catch (error) {
          console.error("Error deleting kelas:", error);
          toastError("Gagal menghapus kelas");
        }
      },
    );
  };

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      const matkul = mataKuliah.find((m) => m.id === formData.matakuliah_id);

      await storeKelas(formData);
      setIsModalOpen(false);
      toastSuccess(`Kelas "${matkul?.nama || ""}" berhasil ditambahkan`);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toastError("Gagal menambahkan kelas");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2">Rencana Studi</Heading>
          <div className="flex gap-2">
            <button
              onClick={() =>
                exportRencanaStudiPDF(
                  filteredKelas,
                  mahasiswa,
                  dosen,
                  mataKuliah,
                )
              }
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export PDF
            </button>

            {user?.role === "admin" && (
              <Button onClick={openAddModal}>+ Tambah Kelas</Button>
            )}
          </div>
        </div>

        <RencanaStudiTable
          kelas={filteredKelas}
          mahasiswa={mahasiswa}
          dosen={dosen}
          mataKuliah={mataKuliah}
          selectedMhs={selectedMhs}
          setSelectedMhs={setSelectedMhs}
          selectedDsn={selectedDsn}
          setSelectedDsn={setSelectedDsn}
          handleAddMahasiswa={handleAddMahasiswa}
          handleDeleteMahasiswa={handleDeleteMahasiswa}
          handleChangeDosen={handleChangeDosen}
          handleDeleteKelas={handleDeleteKelas}
        />
      </Card>

      <KelasModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedKelas={null}
        matakuliah={mataKuliahBelumAdaKelas}
        dosen={dosen}
        listKelas={kelas}
      />
    </>
  );
};

export default RencanaStudi;
