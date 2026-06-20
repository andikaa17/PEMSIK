import { supabase } from "@/supabaseClient";

// Ambil semua kelas, lalu lampirkan mahasiswa_ids (array of id)
// supaya bentuk datanya tetap sama seperti db.json lama,
// dan Dashboard.jsx / halaman lain tidak perlu diubah.
export const getAllKelas = async () => {
  const { data: kelasData, error: kelasError } = await supabase
    .from("kelas")
    .select("*");
  if (kelasError) throw kelasError;

  const { data: relasiData, error: relasiError } = await supabase
    .from("kelas_mahasiswa")
    .select("kelas_id, mahasiswa_id");
  if (relasiError) throw relasiError;

  const data = kelasData.map((k) => ({
    ...k,
    mahasiswa_ids: relasiData
      .filter((r) => r.kelas_id === k.id)
      .map((r) => r.mahasiswa_id),
  }));

  return { data };
};

export const getKelas = async (id) => {
  const { data: k, error: kelasError } = await supabase
    .from("kelas")
    .select("*")
    .eq("id", id)
    .single();
  if (kelasError) throw kelasError;

  const { data: relasiData, error: relasiError } = await supabase
    .from("kelas_mahasiswa")
    .select("mahasiswa_id")
    .eq("kelas_id", id);
  if (relasiError) throw relasiError;

  const data = {
    ...k,
    mahasiswa_ids: relasiData.map((r) => r.mahasiswa_id),
  };

  return { data };
};

// payload boleh menyertakan mahasiswa_ids: [1,2,3] untuk langsung diisi relasinya
export const storeKelas = async (payload) => {
  const { mahasiswa_ids, ...kelasFields } = payload;

  const { data: created, error } = await supabase
    .from("kelas")
    .insert(kelasFields)
    .select()
    .single();
  if (error) throw error;

  if (mahasiswa_ids && mahasiswa_ids.length > 0) {
    const rows = mahasiswa_ids.map((mid) => ({
      kelas_id: created.id,
      mahasiswa_id: mid,
    }));
    const { error: relasiError } = await supabase
      .from("kelas_mahasiswa")
      .insert(rows);
    if (relasiError) throw relasiError;
  }

  return { data: { ...created, mahasiswa_ids: mahasiswa_ids || [] } };
};

export const updateKelas = async (id, payload) => {
  const { mahasiswa_ids, ...kelasFields } = payload;

  const { data: updated, error } = await supabase
    .from("kelas")
    .update(kelasFields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  // Kalau mahasiswa_ids ikut dikirim, replace semua relasi lama dengan yang baru
  if (mahasiswa_ids) {
    const { error: deleteError } = await supabase
      .from("kelas_mahasiswa")
      .delete()
      .eq("kelas_id", id);
    if (deleteError) throw deleteError;

    if (mahasiswa_ids.length > 0) {
      const rows = mahasiswa_ids.map((mid) => ({
        kelas_id: id,
        mahasiswa_id: mid,
      }));
      const { error: insertError } = await supabase
        .from("kelas_mahasiswa")
        .insert(rows);
      if (insertError) throw insertError;
    }
  }

  return { data: { ...updated, mahasiswa_ids: mahasiswa_ids || [] } };
};

export const deleteKelas = async (id) => {
  // kelas_mahasiswa otomatis ikut terhapus karena ON DELETE CASCADE
  const { data, error } = await supabase
    .from("kelas")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  return { data };
};

// Tambah satu mahasiswa ke kelas tertentu
export const addMahasiswaToKelas = async (kelasId, mahasiswaId) => {
  const { data, error } = await supabase
    .from("kelas_mahasiswa")
    .insert({ kelas_id: kelasId, mahasiswa_id: mahasiswaId })
    .select();
  if (error) throw error;
  return { data };
};

// Keluarkan satu mahasiswa dari kelas tertentu
export const removeMahasiswaFromKelas = async (kelasId, mahasiswaId) => {
  const { data, error } = await supabase
    .from("kelas_mahasiswa")
    .delete()
    .eq("kelas_id", kelasId)
    .eq("mahasiswa_id", mahasiswaId)
    .select();
  if (error) throw error;
  return { data };
};
