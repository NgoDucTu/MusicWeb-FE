"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getMeApi } from "@/lib/api/users.api";
import type { UserResponse } from "@/types";

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (token: string, user?: UserResponse) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const setAuth = useCallback(async (t: string, u?: UserResponse) => {
    // Store token first so getMeApi can use it
    localStorage.setItem("token", t);
    setToken(t);

    let resolvedUser = u;
    if (!resolvedUser) {
      // Backend didn't return user in auth response — fetch separately
      const res = await getMeApi();
      if (res.success && res.data) resolvedUser = res.data;
    }

    if (resolvedUser) {
      localStorage.setItem("user", JSON.stringify(resolvedUser));
      setUser(resolvedUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await getMeApi();
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, setAuth, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
