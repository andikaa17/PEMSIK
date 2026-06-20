import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStateContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
