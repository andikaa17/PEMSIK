import axios from "@/Utils/AxiosInstance";

export const getAllMatakuliah = () => axios.get("/matakuliah");
export const getMatakuliah = (id) => axios.get(`/matakuliah/${id}`);
export const storeMatakuliah = (data) => axios.post("/matakuliah", data);
export const updateMatakuliah = (id, data) =>
  axios.put(`/matakuliah/${id}`, data);
export const deleteMatakuliah = (id) => axios.delete(`/matakuliah/${id}`);
