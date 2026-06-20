import { supabase } from "@/supabaseClient";

export const getAllMahasiswa = async () => {
  const { data, error } = await supabase.from("mahasiswa").select("*");
  if (error) throw error;
  return { data };
};

export const getMahasiswa = async (id) => {
  const { data, error } = await supabase
    .from("mahasiswa")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return { data };
};

export const storeMahasiswa = async (payload) => {
  const { data, error } = await supabase
    .from("mahasiswa")
    .insert(payload)
    .select();
  if (error) throw error;
  return { data };
};

export const updateMahasiswa = async (id, payload) => {
  const { data, error } = await supabase
    .from("mahasiswa")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return { data };
};

export const deleteMahasiswa = async (id) => {
  const { data, error } = await supabase
    .from("mahasiswa")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  return { data };
};
