import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMatakuliah,
  storeMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
} from "@/Utils/Apis/MatakuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMatakuliah = () =>
  useQuery({
    queryKey: ["matakuliah"],
    queryFn: getAllMatakuliah,
    select: (res) => res?.data ?? [],
  });

export const useStoreMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMatakuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Mata Kuliah berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mata kuliah."),
  });
};

export const useUpdateMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMatakuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Mata Kuliah berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mata kuliah."),
  });
};

export const useDeleteMatakuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatakuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Mata Kuliah berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mata kuliah."),
  });
};
