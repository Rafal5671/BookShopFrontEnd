'use server'

import { jwtDecode } from "jwt-decode";
import { LoginData, LoginResponse, AuthResult } from "@/types/types";
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:8080/api/customers/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Logowanie nie powiodło się');
  }

  // Oczekujemy obiektu: { "accessToken": "...", "refreshToken": "..." }
  return response.json() as Promise<LoginResponse>;
};

export const handleLogin = async (data: LoginData): Promise<AuthResult> => {
  try {
    const result = await loginUser(data);
    const { accessToken, refreshToken } = result;

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userEmail = decodedToken.sub || '';
      const userRole = decodedToken.role || '';
      return {
        userEmail,
        userRole,
        accessToken,
        refreshToken: refreshToken || null,
      };
    } else {
      console.error('Brak accessToken w odpowiedzi');
      return { userRole:null, userEmail: null, accessToken: null, refreshToken: null };
    }
  } catch (error) {
    console.error('Błąd logowania:', error);
    throw error;
  }
};
