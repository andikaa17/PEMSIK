import axios from "@/Utils/AxiosInstance";

// Ambil semua matakuliah (dengan parameter pagination)
export const getAllMatakuliah = (params = {}) =>
  axios.get("/matakuliah", { params });

// Ambil 1 matakuliah
export const getMatakuliah = (id) => axios.get(`/matakuliah/${id}`);

// Tambah matakuliah
export const storeMatakuliah = (data) => axios.post("/matakuliah", data);

// Update matakuliah
export const updateMatakuliah = (id, data) =>
  axios.put(`/matakuliah/${id}`, data);

// Hapus matakuliah
export const deleteMatakuliah = (id) => axios.delete(`/matakuliah/${id}`);
