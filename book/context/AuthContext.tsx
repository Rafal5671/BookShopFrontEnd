"use client";

import React, { createContext, useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  sessionExpired: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
    }
    setSessionExpired(false);
    setToken(newToken);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
    setSessionExpired(false);
    setToken(null);
  };

  const value: AuthContextType = {
    token,
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
