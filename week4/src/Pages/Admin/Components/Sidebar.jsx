import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin Panel</span>
        <span className="text-2xl font-bold lg:hidden block text-center">
          A
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {user?.permission?.includes("dashboard.page") && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏠</span>
            <span className="menu-text hidden lg:inline">Dashboard</span>
          </NavLink>
        )}

        {user?.permission?.includes("mahasiswa.page") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="menu-text hidden lg:inline">Mahasiswa</span>
          </NavLink>
        )}

        {user?.permission?.includes("dosen.page") && (
          <NavLink
            to="/admin/dosen"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>👨‍🏫</span>
            <span className="menu-text hidden lg:inline">Dosen</span>
          </NavLink>
        )}

        {user?.permission?.includes("matakuliah.page") && (
          <NavLink
            to="/admin/matakuliah"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>📚</span>
            <span className="menu-text hidden lg:inline">Mata Kuliah</span>
          </NavLink>
        )}

        {user?.permission?.includes("kelas.page") && (
          <NavLink
            to="/admin/kelas"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏫</span>
            <span className="menu-text hidden lg:inline">Kelas</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
