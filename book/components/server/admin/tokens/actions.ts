`use server`

import { fetchWithAuth } from "@/auth/apiClient"; // lub Twój fetchWithAuth
import { PageResponse } from "@/types/types";

// Typ Twojego RefreshToken
export interface RefreshTokenItem {
  id: number;
  token: string;
  email: string;
  expiryDate: string; // w formacie ISO
  revoked: boolean;
}

// 1) Pobiera listę tokenów (paged)
export async function fetchRefreshTokensServer(page: number, size: number): Promise<PageResponse<RefreshTokenItem>> {
  const res = await fetchWithAuth(
    `http://localhost:8080/api/admin/refresh-tokens?page=${page}&size=${size}`,
    { method: "GET" }
  );
  if (!res.ok) {
    throw new Error("Nie udało się pobrać listy tokenów.");
  }
  return res.json();
}

// 2) Pobiera listę tokenów danego usera (opcjonalne)
export async function fetchRefreshTokensByEmailServer(
  email: string,
  page: number,
  size: number
): Promise<PageResponse<RefreshTokenItem>> {
  const res = await fetchWithAuth(
    `http://localhost:8080/api/admin/refresh-tokens/by-email/paged?email=${email}&page=${page}&size=${size}`,
    { method: "GET" }
  );
  if (!res.ok) {
    throw new Error("Nie udało się pobrać listy tokenów dla email: " + email);
  }
  return res.json();
}

// 3) Revoke konkretnego tokenu
export async function revokeRefreshTokenServer(tokenId: number) {
  const res = await fetchWithAuth(
    `http://localhost:8080/api/admin/refresh-tokens/revoke/${tokenId}`,
    { method: "PUT" }
  );
  if (!res.ok) {
    throw new Error("Nie udało się unieważnić tokenu o ID: " + tokenId);
  }
  return res.json(); // np. { "message": "Token revoked" }
}
