import { createContext, useContext, useState, useEffect } from "react";

const AuthStateContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        _setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const setUser = (userData) => {
    _setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthStateContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthStateContext must be used within AuthProvider");
  }
  return context;
};
