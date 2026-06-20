import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Hook untuk get all dengan pagination (dilakukan di client side)
export const useDosen = (query = {}) =>
  useQuery({
    queryKey: ["dosen"],
    queryFn: () => getAllDosen(),
    select: (res) => {
      let data = res?.data ?? [];

      // Search (berdasarkan nama atau nidn)
      if (query.q) {
        const keyword = query.q.toLowerCase();
        data = data.filter(
          (d) =>
            d.nama?.toLowerCase().includes(keyword) ||
            d.nidn?.toLowerCase().includes(keyword),
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

export const useStoreDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan dosen."),
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui dosen."),
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus dosen."),
  });
};
