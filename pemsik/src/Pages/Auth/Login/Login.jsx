import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { login } from "@/Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "mahasiswa") {
      return <Navigate to="/mahasiswa/dashboard" replace />;
    }
    if (user.role === "dosen") {
      return <Navigate to="/dosen/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = form;

    try {
      const userData = await login(email, password);

      setUser(userData);
      toastSuccess("Login berhasil!");

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "mahasiswa") {
        navigate("/mahasiswa/dashboard");
      } else if (userData.role === "dosen") {
        navigate("/dosen/dashboard");
      }
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan email"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        <div className="text-sm text-center text-gray-600 mt-4">
          <p>Admin: admin@mail.com | admin123</p>
          <p>Mahasiswa: andi@mahasiswa.ac.id | andi123</p>
          <p>Dosen: slamet@dosen.ac.id | slamet123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
