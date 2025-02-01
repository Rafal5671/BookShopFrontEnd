"use server";

export interface Publisher {
  publisherId: number;
  name: string;
}

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // aktualna strona 0-based (Spring)
  size: number;
}

/**
 * Pobiera listę wydawców z backendu.
 *
 * @param token - token uwierzytelniający
 * @param page - numer strony (1-based w komponencie, konwertujemy na 0-based)
 * @param pageSize - liczba wydawców na stronę
 */
export async function fetchPublishersServer(
  token: string,
  page: number,
  pageSize: number
): Promise<PagedResponse<Publisher>> {
  if (!token) {
    throw new Error("Brak tokenu uwierzytelniającego (fetchPublishers).");
  }

  const springPageIndex = page - 1;

  const response = await fetch(
    `http://localhost:8080/api/admin/publishers?page=${springPageIndex}&size=${pageSize}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Błąd podczas pobierania wydawców.");
  }

  return response.json();
}

/**
 * Usuwa wydawcę o podanym ID
 */
export async function deletePublisherServer(
  token: string,
  publisherId: number
) {
  if (!token) {
    throw new Error("Brak tokenu uwierzytelniającego (deletePublisher).");
  }

  const response = await fetch(
    `http://localhost:8080/api/admin/publishers/${publisherId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie można usunąć wydawcy. Może być powiązany z istniejącymi książkami."
    );
  }

  // Możesz zwrócić pusty obiekt, lub JSON potwierdzenia:
  return response.json();
}
