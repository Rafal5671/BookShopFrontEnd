'use server'

import { jwtDecode } from "jwt-decode";

export interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}
interface AuthResult {
  userEmail: string | null;
  token: string | null;
}
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

  return await response.json();
};

export const handleLogin = async (data: LoginData): Promise<AuthResult> => {
  try {
    const result = await loginUser(data);
    const token = result.token;

    if (token) {
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub || '';
      return { userEmail, token };
    } else {
      console.error('Brak tokenu w odpowiedzi');
      return { userEmail: null, token: null };
    }
  } catch (error) {
    console.error('Błąd logowania:', error);
    throw error;
  }
};