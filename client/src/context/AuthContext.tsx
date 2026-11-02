import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

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

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
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
    void refresh();
  }, [refresh]);

  /*
   * STUDENT + ADMIN HEARTBEAT
   *
   * Every 30 seconds.
   * Session cookie identifies the exact browser/device.
   */
  useEffect(() => {
    if (!user) return;

    let active = true;
    let sending = false;

    const sendHeartbeat = async () => {
      if (!active || sending) return;

      sending = true;

      try {
        await api.post("/auth/heartbeat");
      } catch (error) {
        // Network failure will not automatically log out the user.
        console.warn("Heartbeat failed:", error);
      } finally {
        sending = false;
      }
    };

    // First heartbeat immediately after login/refresh.
    void sendHeartbeat();

    const intervalId = window.setInterval(() => {
      void sendHeartbeat();
    }, 30_000);

    // Update activity when the user returns to the tab.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void sendHeartbeat();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      active = false;
      window.clearInterval(intervalId);

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [user]);

  async function login(
    identifier: string,
    password: string
  ) {
    try {
      const res = await api.post("/auth/login", {
        identifier,
        password,
      });

      setUser({
        email: res.data.data.profile?.email || identifier,
        role: res.data.data.role,
        profile: res.data.data.profile,
      });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function adminLogin(
    email: string,
    password: string
  ) {
    try {
      const res = await api.post("/auth/admin/login", {
        email,
        password,
      });

      setUser({
        email,
        role: "ADMIN",
        profile: res.data.data.profile,
      });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}