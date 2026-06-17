import Button from "@/Pages/Admin/Components/Button";
import Select from "@/Pages/Admin/Components/Select";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const RencanaStudiTable = ({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas,
}) => {
  const { user } = useAuthStateContext();

  const getTotalSksMahasiswa = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => mataKuliah.find((m) => m.id === k.matakuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const getMaxSks = (mhsId) => {
    const mhs = mahasiswa.find((m) => m.id === mhsId);
    return mhs?.max_sks || 0;
  };

  if (kelas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada kelas. Silakan tambah kelas baru.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find((m) => m.id === kls.matakuliah_id);
        const dosenPengampu = dosen.find((d) => d.id === kls.dosen_id);
        const mhsInClass = (kls.mahasiswa_ids || [])
          .map((id) => mahasiswa.find((m) => m.id === id))
          .filter(Boolean);

        const kapasitas = kls.kapasitas || 0;
        const isFull = kapasitas > 0 && mhsInClass.length >= kapasitas;

        return (
          <div key={kls.id} className="border rounded shadow bg-white">
            <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b bg-gray-50 gap-2">
              <div>
                <h3 className="text-lg font-semibold">{matkul?.nama || "-"}</h3>
                <p className="text-sm text-gray-600">
                  Dosen: <strong>{dosenPengampu?.nama || "-"}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  SKS: {matkul?.sks || 0} | {kls.kode || ""} | Kapasitas:{" "}
                  {mhsInClass.length}/{kapasitas || "∞"}
                  {isFull && (
                    <span className="ml-2 text-red-500 font-semibold">
                      (PENUH!)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {user?.permission?.includes("rencana-studi.update") && (
                  <>
                    <Select
                      value={selectedDsn[kls.id] || ""}
                      onChange={(e) =>
                        setSelectedDsn({
                          ...selectedDsn,
                          [kls.id]: Number(e.target.value),
                        })
                      }
                      size="sm"
                      className="w-48"
                    >
                      <option value="">-- Ganti Dosen --</option>
                      {dosen.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nama}
                        </option>
                      ))}
                    </Select>
                    <Button size="sm" onClick={() => handleChangeDosen(kls)}>
                      Simpan
                    </Button>
                  </>
                )}

                {user?.permission?.includes("rencana-studi.delete") && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (mhsInClass.length > 0) {
                        if (
                          !window.confirm(
                            `Kelas ini memiliki ${mhsInClass.length} mahasiswa. Yakin ingin menghapus?`,
                          )
                        )
                          return;
                      }
                      handleDeleteKelas(kls.id);
                    }}
                  >
                    Hapus Kelas
                  </Button>
                )}
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama</th>
                  <th className="py-2 px-4 text-left">NIM</th>
                  <th className="py-2 px-4 text-center">Max SKS</th>
                  <th className="py-2 px-4 text-center">SKS Diambil</th>
                  <th className="py-2 px-4 text-center">Sisa SKS</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mhsInClass.length > 0 ? (
                  mhsInClass.map((m, i) => {
                    const totalSks = getTotalSksMahasiswa(m.id);
                    const maxSks = getMaxSks(m.id);
                    const sisaSks = maxSks - totalSks;
                    const isOver = sisaSks < 0;

                    return (
                      <tr
                        key={m.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
                      >
                        <td className="py-2 px-4">{i + 1}</td>
                        <td className="py-2 px-4">{m.nama}</td>
                        <td className="py-2 px-4">{m.nim}</td>
                        <td className="py-2 px-4 text-center font-semibold">
                          {maxSks}
                        </td>
                        <td className="py-2 px-4 text-center">{totalSks}</td>
                        <td className="py-2 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              isOver
                                ? "bg-red-200 text-red-800"
                                : sisaSks <= 3
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-green-200 text-green-800"
                            }`}
                          >
                            {isOver ? "OVER" : sisaSks}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          {user?.permission?.includes(
                            "rencana-studi.update",
                          ) && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteMahasiswa(kls, m.id)}
                            >
                              Hapus
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-3 px-4 text-center italic text-gray-500"
                    >
                      Belum ada mahasiswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {user?.permission?.includes("rencana-studi.update") && (
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t bg-gray-50">
                <Select
                  value={selectedMhs[kls.id] || ""}
                  onChange={(e) =>
                    setSelectedMhs({
                      ...selectedMhs,
                      [kls.id]: Number(e.target.value),
                    })
                  }
                  size="sm"
                  className="w-56"
                >
                  <option value="">-- Pilih Mahasiswa --</option>
                  {mahasiswa.map((m) => {
                    const isAlreadyInClass = kls.mahasiswa_ids?.includes(m.id);
                    const totalSks = getTotalSksMahasiswa(m.id);
                    const maxSks = getMaxSks(m.id);
                    const sisaSks = maxSks - totalSks;
                    const matkul = mataKuliah.find(
                      (mk) => mk.id === kls.matakuliah_id,
                    );
                    const sks = matkul?.sks || 0;
                    const canAdd =
                      !isAlreadyInClass && sisaSks >= sks && !isFull;

                    return (
                      <option key={m.id} value={m.id} disabled={!canAdd}>
                        {m.nama} ({m.nim}){" "}
                        {isAlreadyInClass ? "✅" : `- Sisa: ${sisaSks} SKS`}
                      </option>
                    );
                  })}
                </Select>
                <Button
                  size="sm"
                  onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])}
                  disabled={isFull}
                >
                  {isFull ? "Kelas Penuh" : "Tambah Mahasiswa"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RencanaStudiTable;
