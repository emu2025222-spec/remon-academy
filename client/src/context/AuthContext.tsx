import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { api, getErrorMessage } from "../services/api";
import { UserRole } from "../types";

interface AuthUser {
  email: string;
  role: UserRole;
  profile: Record<string, unknown> | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function login(identifier: string, password: string) {
    try {
      const res = await api.post("/auth/login", { identifier, password });
      setUser({ email: identifier, role: res.data.data.role, profile: res.data.data.profile });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function adminLogin(email: string, password: string) {
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      setUser({ email, role: "ADMIN", profile: res.data.data.profile });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
