import Button from "@/Pages/Admin/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const { user } = useAuthStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    confirmLogout(() => {
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    });
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/mahasiswa")) return "Mahasiswa";
    if (path.includes("/admin/dosen")) return "Dosen";
    if (path.includes("/admin/matakuliah")) return "Mata Kuliah";
    if (path.includes("/admin/kelas")) return "Kelas";
    if (path.includes("/admin/rencana-studi")) return "Rencana Studi";

    if (user?.role === "admin") return "Dashboard Admin";
    if (user?.role === "mahasiswa") return "KRS Mahasiswa";
    return "Sistem Akademik";
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login sebagai:{" "}
            <span className="font-semibold capitalize">{user?.role}</span>
          </p>
        </div>

        <div className="relative">
          <Button
            onClick={toggleProfileMenu}
            className="w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold focus:outline-none hover:bg-indigo-700 flex items-center justify-center"
          >
            {user?.name?.charAt(0) || "U"}
          </Button>

          <div
            id="profileMenu"
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden z-50"
          >
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                const path =
                  user?.role === "admin"
                    ? "/admin/profile"
                    : user?.role === "dosen"
                      ? "/dosen/profile"
                      : "/mahasiswa/profile";
                navigate(path);
                toggleProfileMenu();
              }}
              className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
