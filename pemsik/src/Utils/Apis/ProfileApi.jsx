import { supabase } from "@/supabaseClient";

// Ambil data profile lengkap: gabungan app_user + dosen/mahasiswa (dicari via email)
export const getProfile = async (email, role) => {
  const { data: appUser, error: appUserError } = await supabase
    .from("app_user")
    .select("*")
    .eq("email", email)
    .single();
  if (appUserError) throw appUserError;

  let detail = null;
  if (role === "dosen") {
    const { data, error } = await supabase
      .from("dosen")
      .select("*")
      .eq("email", email)
      .single();
    if (!error) detail = data;
  } else if (role === "mahasiswa") {
    const { data, error } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("email", email)
      .single();
    if (!error) detail = data;
  }

  const { password: _, ...appUserSafe } = appUser;

  return {
    data: {
      ...appUserSafe,
      ...(detail || {}),
      // pastikan field identitas utama tidak ketiban null dari detail kalau gak ketemu
      nama: detail?.nama ?? appUser?.name,
      email: appUser?.email,
    },
  };
};

// Update profile: update ke app_user, dan ke dosen/mahasiswa (kalau ada)
export const updateProfile = async (oldEmail, role, payload) => {
  const { nama, email, nim, nidn, max_sks, password } = payload;

  // 1. Update tabel app_user
  const appUserUpdate = { name: nama, email };
  if (password) appUserUpdate.password = password;

  const { error: appUserError } = await supabase
    .from("app_user")
    .update(appUserUpdate)
    .eq("email", oldEmail);
  if (appUserError) throw appUserError;

  // 2. Update tabel dosen / mahasiswa sesuai role
  if (role === "dosen") {
    const dosenUpdate = { nama, email };
    if (password) dosenUpdate.password = password;
    if (max_sks !== undefined) dosenUpdate.max_sks = max_sks;

    const { error } = await supabase
      .from("dosen")
      .update(dosenUpdate)
      .eq("email", oldEmail);
    if (error) throw error;
  } else if (role === "mahasiswa") {
    const mhsUpdate = { nama, email };
    if (password) mhsUpdate.password = password;
    if (max_sks !== undefined) mhsUpdate.max_sks = max_sks;

    const { error } = await supabase
      .from("mahasiswa")
      .update(mhsUpdate)
      .eq("email", oldEmail);
    if (error) throw error;
  }

  return getProfile(email, role);
};
