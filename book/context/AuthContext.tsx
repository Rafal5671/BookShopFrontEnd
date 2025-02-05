"use client";

import React, { createContext, useState, useEffect } from "react";

export type AuthContextType = {
  token: string | null;
  userRole: string | null;
  loading: boolean;
  sessionExpired: boolean;
  login: (newToken: string, newRole: string) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

// context/AuthContext.tsx (kontynuacja)
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      const storedRole = localStorage.getItem("userRole");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedRole) {
        setUserRole(storedRole);
      }
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newRole: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("userRole", newRole);
    }
    setSessionExpired(false);
    setToken(newToken);
    setUserRole(newRole);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    }
    setSessionExpired(false);
    setToken(null);
    setUserRole(null);
  };

  const value: AuthContextType = {
    token,
    userRole,
    loading,
    sessionExpired,
    login,
    logout,
    setSessionExpired,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

