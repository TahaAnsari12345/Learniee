import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="page-loader">Loading your dashboard…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
