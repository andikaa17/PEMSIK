import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Hook untuk get all dengan pagination (dilakukan di client side)
export const useKelas = (query = {}) =>
  useQuery({
    queryKey: ["kelas"],
    queryFn: () => getAllKelas(),
    select: (res) => {
      let data = res?.data ?? [];

      // Search (berdasarkan nama atau kode)
      if (query.q) {
        const keyword = query.q.toLowerCase();
        data = data.filter(
          (k) =>
            k.nama?.toLowerCase().includes(keyword) ||
            k.kode?.toLowerCase().includes(keyword),
        );
      }

      // Sort
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

      // Pagination
      if (query._page && query._limit) {
        const start = (query._page - 1) * query._limit;
        const end = start + query._limit;
        data = data.slice(start, end);
      }

      return { data, total };
    },
    keepPreviousData: true,
  });

export const useStoreKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan kelas."),
  });
};

export const useUpdateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui kelas."),
  });
};

export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus kelas."),
  });
};
