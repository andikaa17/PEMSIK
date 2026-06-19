import usersData from "@/../db/user.json";

export const login = async (email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = usersData.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    throw new Error("Email atau password salah");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
