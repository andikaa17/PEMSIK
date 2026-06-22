import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMatakuliah,
  storeMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
} from "@/Utils/Apis/MatakuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMatakuliah = (query = {}) =>
  useQuery({
    queryKey: ["matakuliah"],
    queryFn: () => getAllMatakuliah(),
    select: (res) => {
      let data = res?.data ?? [];

      if (query.q) {
        const keyword = query.q.toLowerCase();
        data = data.filter(
          (m) =>
            m.nama?.toLowerCase().includes(keyword) ||
            m.kode?.toLowerCase().includes(keyword),
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

export const useStoreMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMatakuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Mata kuliah berhasil ditambahkan!");
    },
    onError: (error) => {
      // Tangani error 409 Conflict (duplikasi kode)
      if (error?.status === 409 || error?.code === "23505") {
        toastError("Gagal menambahkan: Kode mata kuliah sudah terdaftar!");
      } else {
        toastError(error?.message || "Gagal menambahkan mata kuliah.");
      }
    },
  });
};

export const useUpdateMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMatakuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Mata kuliah berhasil diperbarui!");
    },
    onError: (error) => {
      if (error?.status === 409 || error?.code === "23505") {
        toastError("Gagal memperbarui: Kode mata kuliah sudah terdaftar!");
      } else {
        toastError(error?.message || "Gagal memperbarui mata kuliah.");
      }
    },
  });
};

export const useDeleteMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatakuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Mata kuliah berhasil dihapus!");
    },
    onError: (error) => {
      toastError(error?.message || "Gagal menghapus mata kuliah.");
    },
  });
};
