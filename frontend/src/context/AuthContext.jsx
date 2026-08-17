import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("learniee_token");
    if (!token) return setLoading(false);
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("learniee_token"))
      .finally(() => setLoading(false));
  }, []);
  const authenticate = ({ token, user: nextUser }) => {
    localStorage.setItem("learniee_token", token);
    setUser(nextUser);
  };
  const logout = () => {
    localStorage.removeItem("learniee_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
