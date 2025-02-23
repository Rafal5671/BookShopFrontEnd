"use server";

import { fetchWithAuth } from "@/auth/apiClient";
import { PageResponse, Publisher } from "@/types/types";


export async function fetchPublishersServer(
  page: number,
  pageSize: number,
  query?: string
): Promise<PageResponse<Publisher>> {
  const springPageIndex = page - 1;
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

  return response.json();
}