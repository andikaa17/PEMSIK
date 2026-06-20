import { supabase } from "@/supabaseClient";

export const login = async (email, password) => {
  const { data: user, error } = await supabase
    .from("app_user")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !user) {
    throw new Error("Email atau password salah");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
