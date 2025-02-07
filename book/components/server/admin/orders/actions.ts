"use server";

import { fetchWithAuth } from "@/auth/apiClient";
import { OrderAdmin,PageResponse } from "@/types/types";

export type SortOption = "dateAsc" | "dateDesc" | "amountAsc" | "amountDesc";

/**
 * Pobiera listę zamówień z backendu.
 *
 * @param token – JWT lub inny token autoryzacyjny
 * @param page – numer strony (1-based; dla backendu konwertujemy na 0-based)
 * @param rowsPerPage – liczba zamówień na stronę
 * @param sortOption – jak sortujemy (dateAsc, dateDesc, itp.)
 */
export async function fetchOrdersServer(
  page: number,
  rowsPerPage: number,
  sortOption: SortOption,
  searchTerm?: string,
  filterStatus?: string
): Promise<PageResponse<OrderAdmin>> {
  // Konwersja 1-based -> 0-based
  const springPage = page - 1;

  let sortBy = "orderDate";
  let sortDir = "asc";

  switch (sortOption) {
    case "dateAsc":
      sortBy = "orderDate";
      sortDir = "asc";
      break;
    case "dateDesc":
      sortBy = "orderDate";
      sortDir = "desc";
      break;
    case "amountAsc":
      sortBy = "amount";
      sortDir = "asc";
      break;
    case "amountDesc":
      sortBy = "amount";
      sortDir = "desc";
      break;
  }

  // Budowanie URL z parametrami zapytania
  const url = new URL("http://localhost:8080/api/admin/orders");
  url.searchParams.append("page", springPage.toString());
  url.searchParams.append("size", rowsPerPage.toString());
  url.searchParams.append("sortBy", sortBy);
  url.searchParams.append("sortDir", sortDir);

  if (searchTerm) {
    url.searchParams.append("searchTerm", searchTerm);
  }
  if (filterStatus && filterStatus !== "Wszystkie") {
    url.searchParams.append("filterStatus", filterStatus);
  }

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Nie udało się pobrać zamówień.");
  }

  return response.json();
}

/**
 * Aktualizuje status zamówienia.
 *
 * @param token – JWT lub inny token autoryzacyjny
 * @param orderId – ID zamówienia
 * @param newStatus – status w formie, której oczekuje backend (np. "PAID", "SHIPPED", ...)
 */
export async function updateOrderStatusServer(
  orderId: string,
  newStatus: string
) {
  const response = await fetchWithAuth(
    `http://localhost:8080/api/admin/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zaktualizować statusu zamówienia.");
  }

  return response.text();
}
