"use server";

import { fetchWithAuth } from "@/auth/apiClient";
import { PageResponse, Publisher } from "@/types/types";

/**
 * Pobiera listę wydawców z backendu.
 *
 * @param token - token uwierzytelniający
 * @param page - numer strony (1-based w komponencie, konwertujemy na 0-based)
 * @param pageSize - liczba wydawców na stronę
 */
export async function fetchPublishersServer(
  page: number,
  pageSize: number,
  query?: string
): Promise<PageResponse<Publisher>> {
  const springPageIndex = page - 1;
  // Jeśli query jest podane, dodaj je do parametrów URL (pamiętaj o encodeURIComponent)
  const queryParam = query && query.trim() !== "" ? `&query=${encodeURIComponent(query)}` : "";
  const response = await fetchWithAuth(
    `http://localhost:8080/api/admin/publishers?page=${springPageIndex}&size=${pageSize}${queryParam}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Błąd podczas pobierania wydawców.");
  }

  return response.json();
}
export async function deletePublisherServer(publisherId: number) {
  const response = await fetchWithAuth(
    `http://localhost:8080/api/admin/publishers/${publisherId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie można usunąć wydawcy...");
  }

  // Zwracamy response.json() – jeśli serwer coś zwraca
  return response.json();
}