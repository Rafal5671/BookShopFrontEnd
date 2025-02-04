"use server";

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
  token: string,
  page: number,
  rowsPerPage: number,
  sortOption: SortOption
): Promise<PageResponse<OrderAdmin>> {
  if (!token) {
    throw new Error("Brak tokenu autoryzacji.");
  }

  // Konwersja 1-based -> 0-based
  const springPage = page - 1;

  // Obsługa sortowania
  let sortBy = "orderDate"; // domyślnie po dacie
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
      sortBy = "amount"; // uwaga: musisz mieć obsługę w backendzie
      sortDir = "asc";
      break;
    case "amountDesc":
      sortBy = "amount"; // j.w.
      sortDir = "desc";
      break;
  }

  const response = await fetch(
    `http://localhost:8080/api/admin/orders?page=${springPage}&size=${rowsPerPage}&sortBy=${sortBy}&sortDir=${sortDir}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

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
  token: string,
  orderId: string,
  newStatus: string
) {
  if (!token) {
    throw new Error("Brak tokenu autoryzacji.");
  }

  const response = await fetch(
    `http://localhost:8080/api/admin/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zaktualizować statusu zamówienia.");
  }

  // Możesz zwrócić np. zaktualizowany obiekt zamówienia, jeśli Twój backend go zwraca
  return response.json();
}
