import { supabase } from "@/supabaseClient";

export const getAllMatakuliah = async () => {
  const { data, error } = await supabase.from("matakuliah").select("*");
  if (error) throw error;
  return { data };
};

export const getMatakuliah = async (id) => {
  const { data, error } = await supabase
    .from("matakuliah")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return { data };
};

export const storeMatakuliah = async (payload) => {
  const { data, error } = await supabase
    .from("matakuliah")
    .insert(payload)
    .select();
  if (error) throw error;
  return { data };
};

export const updateMatakuliah = async (id, payload) => {
  const { data, error } = await supabase
    .from("matakuliah")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return { data };
};

export const deleteMatakuliah = async (id) => {
  const { data, error } = await supabase
    .from("matakuliah")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  return { data };
};
