"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export type UserData = {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
};

interface AuthContextType {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("userData");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (newToken: string, userData: UserData) => {
    Cookies.set("token", newToken, { expires: 1 });
    Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userData");
    setToken(null);
    setUser(null);

    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
