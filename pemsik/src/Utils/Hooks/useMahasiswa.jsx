import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMahasiswa = (query = {}) =>
  useQuery({
    queryKey: ["mahasiswa"],
    queryFn: () => getAllMahasiswa(),
    select: (res) => {
      let data = res?.data ?? [];

      if (query.q) {
        const keyword = query.q.toLowerCase();
        data = data.filter(
          (m) =>
            m.nama?.toLowerCase().includes(keyword) ||
            m.nim?.toLowerCase().includes(keyword),
        );
      }

      if (query._sort) {
        data = [...data].sort((a, b) => {
          const valA = a[query._sort];
          const valB = b[query._sort];
          if (valA == null) return 1;
          if (valB == null) return -1;
          if (typeof valA === "number") {
            return query._order === "desc" ? valB - valA : valA - valB;
          }
          return query._order === "desc"
            ? String(valB).localeCompare(String(valA))
            : String(valA).localeCompare(String(valB));
        });
      }

      const total = data.length;

      if (query._page && query._limit) {
        const start = (query._page - 1) * query._limit;
        const end = start + query._limit;
        data = data.slice(start, end);
      }

      return { data, total };
    },
    keepPreviousData: true,
  });

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: (error) => {
      console.error("Store error:", error);
      toastError(error.message || "Gagal menambahkan mahasiswa.");
    },
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil diperbarui!");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toastError(error.message || "Gagal memperbarui mahasiswa.");
    },
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil dihapus!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toastError(error.message || "Gagal menghapus mahasiswa.");
    },
  });
};
