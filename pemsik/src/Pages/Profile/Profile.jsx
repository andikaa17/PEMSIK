import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getProfile, updateProfile } from "@/Utils/Apis/ProfileApi";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Profile = () => {
  const { user, setUser } = useAuthStateContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile(user.email, user.role);
      setProfile(res.data);
      setForm({
        nama: res.data.nama || "",
        email: res.data.email || "",
        password: "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toastError("Gagal memuat data profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nama: form.nama,
        email: form.email,
      };
      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      const res = await updateProfile(user.email, user.role, payload);
      setProfile(res.data);

      const updatedUser = {
        ...user,
        name: form.nama,
        email: form.email,
      };
      setUser(updatedUser);

      setForm((prev) => ({ ...prev, password: "" }));
      setIsEditing(false);
      toastSuccess("Profile berhasil diperbarui");
    } catch (error) {
      console.error("Error updating profile:", error);
      toastError("Gagal memperbarui profile");
    }
  };

  const handleCancel = () => {
    setForm({
      nama: profile.nama || "",
      email: profile.email || "",
      password: "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Data profile tidak ditemukan</div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-left">
          Profile Saya
        </Heading>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4 max-w-md">
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="font-medium">{profile.nama || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{profile.email || "-"}</p>
          </div>
          {user?.role === "mahasiswa" && (
            <div>
              <p className="text-sm text-gray-500">NIM</p>
              <p className="font-medium">{profile.nim || "-"}</p>
            </div>
          )}
          {user?.role === "dosen" && (
            <div>
              <p className="text-sm text-gray-500">NIDN</p>
              <p className="font-medium">{profile.nidn || "-"}</p>
            </div>
          )}
          {(user?.role === "mahasiswa" || user?.role === "dosen") && (
            <div>
              <p className="text-sm text-gray-500">Maksimal SKS</p>
              <p className="font-medium">{profile.max_sks ?? "-"}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Password Baru{" "}
              <span className="text-xs text-gray-400">
                (kosongkan jika tidak ingin mengganti)
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="••••••••"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit">Simpan</Button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default Profile;
