import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  School,
  ClipboardList,
  FileText,
  Calendar,
} from "lucide-react";

const Sidebar = () => {
  const { user, loading } = useAuthStateContext();

  if (loading) {
    return (
      <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
        <div className="p-4 text-center text-gray-300">Loading...</div>
      </aside>
    );
  }

  const isAdmin = user?.role === "admin";
  const isDosen = user?.role === "dosen";
  const isMahasiswa = user?.role === "mahasiswa";

  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">
          {isAdmin && "Admin Panel"}
          {isDosen && "Dosen Panel"}
          {isMahasiswa && "Mahasiswa Panel"}
        </span>
        <span className="text-2xl font-bold lg:hidden block text-center">
          {isAdmin && "A"}
          {isDosen && "D"}
          {isMahasiswa && "M"}
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {/* DASHBOARD - SEMUA ROLE */}
        {(isAdmin || isDosen || isMahasiswa) && (
          <NavLink
            to={
              isAdmin
                ? "/admin/dashboard"
                : isDosen
                  ? "/dosen/dashboard"
                  : "/mahasiswa/dashboard"
            }
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span className="menu-text hidden lg:inline">Dashboard</span>
          </NavLink>
        )}

        {/* MAHASISWA - HANYA ADMIN */}
        {isAdmin && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <Users size={20} />
            <span className="menu-text hidden lg:inline">Mahasiswa</span>
          </NavLink>
        )}

        {/* DOSEN - HANYA ADMIN */}
        {isAdmin && (
          <NavLink
            to="/admin/dosen"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <User size={20} />
            <span className="menu-text hidden lg:inline">Dosen</span>
          </NavLink>
        )}

        {/* MATA KULIAH - HANYA ADMIN */}
        {isAdmin && (
          <NavLink
            to="/admin/matakuliah"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <BookOpen size={20} />
            <span className="menu-text hidden lg:inline">Mata Kuliah</span>
          </NavLink>
        )}

        {/* KELAS - HANYA ADMIN */}
        {isAdmin && (
          <NavLink
            to="/admin/kelas"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <School size={20} />
            <span className="menu-text hidden lg:inline">Kelas</span>
          </NavLink>
        )}

        {/* RENCANA STUDI - ADMIN & DOSEN */}
        {(isAdmin || isDosen) && (
          <NavLink
            to={isAdmin ? "/admin/rencana-studi" : "/dosen/rencana-studi"}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <ClipboardList size={20} />
            <span className="menu-text hidden lg:inline">Rencana Studi</span>
          </NavLink>
        )}

        {/* JADWAL - DOSEN & MAHASISWA */}
        {(isDosen || isMahasiswa) && (
          <NavLink
            to={isDosen ? "/dosen/jadwal" : "/mahasiswa/jadwal"}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <Calendar size={20} />
            <span className="menu-text hidden lg:inline">Jadwal</span>
          </NavLink>
        )}

        {/* KRS - HANYA MAHASISWA */}
        {isMahasiswa && (
          <NavLink
            to="/mahasiswa/krs"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FileText size={20} />
            <span className="menu-text hidden lg:inline">KRS</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
