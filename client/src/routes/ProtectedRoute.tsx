import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import { UserRole } from "../types";

export function ProtectedRoute({ role }: { role: UserRole }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking your session..." />;

  if (!user) return <Navigate to={role === "ADMIN" ? "/admin/login" : "/login"} replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
