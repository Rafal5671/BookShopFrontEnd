import { fetchWithAuth } from "@/auth/apiClient";
import { PageResponse } from "@/types/types";
export interface RefreshTokenItem {
  id: number;
  token: string;
  email: string;
  expiryDate: string;
  revoked: boolean;
}

// 1) Pobiera listę tokenów (z opcjonalnym email)
export async function fetchRefreshTokensServer(
  page: number,
  size: number,
  email?: string
): Promise<PageResponse<RefreshTokenItem>> {
  // Budujemy bazowy URL
  let url = `http://localhost:8080/api/admin/refresh-tokens?page=${page}&size=${size}`;
  
  // Jeśli mamy email – dodajemy go jako parametr
  if (email && email.trim() !== "") {
    url += `&email=${encodeURIComponent(email.trim())}`;
  }

  const res = await fetchWithAuth(url, { method: "GET" });
  if (!res.ok) {
    throw new Error("Nie udało się pobrać listy tokenów.");
  }
  return res.json();
}

// 2) Revoke konkretnego tokenu – zostaje bez zmian
export async function revokeRefreshTokenServer(tokenId: number) {
  const res = await fetchWithAuth(
    `http://localhost:8080/api/admin/refresh-tokens/revoke/${tokenId}`,
    { method: "PUT" }
  );
  if (!res.ok) {
    throw new Error("Nie udało się unieważnić tokenu o ID: " + tokenId);
  }
  return res.json();
}
