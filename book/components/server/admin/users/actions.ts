import { fetchWithAuth } from "@/auth/apiClient";

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // numer aktualnej strony (0-based)
  size: number;
}

const API_URL = "http://localhost:8080/api/admin";

/**
 * Pobiera użytkowników z podanej strony.
 * @param page - numer strony (1-based)
 * @param pageSize - liczba rekordów na stronę (domyślnie 12)
 * @returns obiekt PageResponse z listą użytkowników
 */
export async function fetchUsers(
  page: number,
  pageSize: number = 12
): Promise<PageResponse<User>> {
  const springPageIndex = page - 1; 
  const response = await fetchWithAuth(
    `${API_URL}/users?page=${springPageIndex}&size=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Błąd podczas pobierania użytkowników.");
  }

  const data: PageResponse<User> = await response.json();
  return data;
}

/**
 * Usuwa użytkownika o podanym identyfikatorze.
 * @param userId - identyfikator użytkownika
 * @returns wynik operacji w formie JSON
 */
export async function deleteUser(userId: number): Promise<any> {
  const response = await fetchWithAuth(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Nie można usunąć użytkownika.");
  }

  return await response.json();
}
