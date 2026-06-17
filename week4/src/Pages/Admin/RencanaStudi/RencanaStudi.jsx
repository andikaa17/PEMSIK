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

  const mataKuliahBelumAdaKelas = mataKuliah.filter((m) => m.status !== false);

  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.max_sks || 0;

  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    const mhsIdNumber = Number(mhsId);

    if (!mhsIdNumber) {
      toastError("Pilih mahasiswa terlebih dahulu");
      return;
    }

    const matkul = mataKuliah.find((m) => m.id === kelasItem.matakuliah_id);
    const sks = matkul?.sks || 0;

    const totalSksMahasiswa = kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsIdNumber))
      .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const maxSks = getMaxSks(mhsIdNumber);

    if (totalSksMahasiswa + sks > maxSks) {
      toastError(`SKS melebihi batas maksimal (${maxSks} SKS)`);
      return;
    }

    if (kelasItem.mahasiswa_ids?.includes(mhsIdNumber)) {
      toastError("Mahasiswa sudah terdaftar di kelas ini");
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
      toastSuccess("Mahasiswa berhasil ditambahkan");
      setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
      fetchData();
    } catch (error) {
      console.error("Error adding mahasiswa:", error);
      toastError("Gagal menambahkan mahasiswa");
    }
  };

  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    try {
      const updated = {
        ...kelasItem,
        mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter(
          (id) => id !== mhsId,
        ),
      };
      await updateKelas(kelasItem.id, updated);
      toastSuccess("Mahasiswa berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("Error deleting mahasiswa:", error);
      toastError("Gagal menghapus mahasiswa");
    }
  };

  const handleChangeDosen = async (kelasItem) => {
    const dsnId = Number(selectedDsn[kelasItem.id]);

    if (!dsnId) {
      toastError("Pilih dosen terlebih dahulu");
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
      toastError(`Dosen melebihi batas maksimal SKS (${maxSks} SKS)`);
      return;
    }

    try {
      await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
      toastSuccess("Dosen berhasil diperbarui");
      setSelectedDsn((prev) => ({ ...prev, [kelasItem.id]: "" }));
      fetchData();
    } catch (error) {
      console.error("Error changing dosen:", error);
      toastError("Gagal mengganti dosen");
    }
  };

  const handleDeleteKelas = async (kelasId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      try {
        await deleteKelas(kelasId);
        toastSuccess("Kelas berhasil dihapus");
        fetchData();
      } catch (error) {
        console.error("Error deleting kelas:", error);
        toastError("Gagal menghapus kelas");
      }
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      await storeKelas(formData);
      setIsModalOpen(false);
      toastSuccess("Kelas berhasil ditambahkan");
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
          {user?.permission?.includes("rencana-studi.create") && (
            <Button onClick={openAddModal}>+ Tambah Kelas</Button>
          )}
        </div>

        <RencanaStudiTable
          kelas={kelas}
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
      />
    </>
  );
};

export default RencanaStudi;
