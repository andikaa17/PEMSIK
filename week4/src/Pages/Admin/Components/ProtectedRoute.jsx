import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStateContext();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/mahasiswa/krs" replace />;
  }

  return children;
};

export default ProtectedRoute;
