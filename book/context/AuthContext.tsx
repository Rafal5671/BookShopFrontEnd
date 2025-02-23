"use client";

import React, { createContext, useState, useEffect } from "react";

export type AuthContextType = {
  token: string | null;
  userRole: string | null;
  email :string|null;
  loading: boolean;
  sessionExpired: boolean;
  login: (newToken: string, newRole: string,email:string) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
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

  const login = (newToken: string, newRole: string,email:string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("userRole", newRole);
    }
    setSessionExpired(false);
    setEmail(email);
    setToken(newToken);
    setUserRole(newRole);
  };

  const logout = async () => {
    if (typeof window !== "undefined") {

      if (email) {
        try {
          await fetch("http://localhost:8080/api/refresh/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ email }),
          });
        } catch (error) {
          console.error("Błąd podczas wylogowania na backendzie:", error);
        }
      }


      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("refreshToken");
    }

    setSessionExpired(false);
    setToken(null);
    setUserRole(null);
  };

  const value: AuthContextType = {
    token,
    userRole,
    email,
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

