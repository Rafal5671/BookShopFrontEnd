"use server";

import { fetchWithAuth } from "@/auth/apiClient";
import { PageResponse, Author, Product, Publisher } from "@/types/types";

export async function fetchPublishersServer(): Promise<PageResponse<Publisher>> {
  // 1) Wywołujemy fetchWithAuth, który ustawi nagłówek Authorization
  const res = await fetchWithAuth(
    "http://localhost:8080/api/admin/publishers?page=0&size=1000",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Błąd podczas pobierania wydawnictw.");
  }

  return res.json();
}

/**
 * Pobranie listy autorów z back-endu
 */
export async function fetchAuthorsServer(): Promise<PageResponse<Author>> {
  const res = await fetchWithAuth(
    "http://localhost:8080/api/admin/authors?page=0&size=10000",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Błąd podczas pobierania autorów.");
  }

  return res.json();
}

/**
 * Dodanie nowego produktu
 */
export async function createProductServer(requestBody: any) {
  const res = await fetchWithAuth("http://localhost:8080/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {}
    throw new Error(errorData?.message ?? "Błąd podczas dodawania produktu.");
  }

  return res.json();
}

/**
 * Aktualizacja istniejącego produktu
 */
export async function updateProductServer(bookId: number, requestBody: any) {
  const res = await fetchWithAuth(`http://localhost:8080/api/admin/products/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {}
    throw new Error(errorData?.message ?? "Błąd podczas aktualizacji produktu.");
  }

  return res.json();
}
/**
 * Pobiera listę produktów z backendu.
 * 
 * @param token - JWT lub inny token uwierzytelniający
 * @param page - numer strony (1-based, bo w komponencie używamy 1-based)
 * @param size - liczba produktów na stronę
 */
export async function fetchProductsServer(
  page: number,
  size: number,
  title?: string,
  categoryId?: number,
  genreId?: number
): Promise<PageResponse<Product>> {
  const springPageIndex = page - 1;

  const queryParams = new URLSearchParams({
    page: springPageIndex.toString(),
    size: size.toString(),
  });

  if (title) queryParams.append("title", title);
  if (categoryId) queryParams.append("categoryId", categoryId.toString());
  if (genreId) queryParams.append("genreId", genreId.toString());

  const response = await fetchWithAuth(
    `http://localhost:8080/api/admin/products?${queryParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Błąd pobierania listy produktów.");
  }

  return response.json();
}

/**
 * Usuwa produkt o danym ID
 */
export async function deleteProductServer(productId: number) {
  const response = await fetchWithAuth(
    `http://localhost:8080/api/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć produktu.");
  }

  return response.json();
}

export async function fetchCategories(): Promise<{ categoryId: number; namePl: string }[]> {
  const response = await fetchWithAuth("http://localhost:8080/api/admin/categories/all", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Błąd pobierania kategorii");
  }

  return response.json();
}

export async function fetchGenres(): Promise<string[]> {
  const response = await fetchWithAuth("http://localhost:8080/api/admin/genres/all", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Błąd pobierania gatunków");
  }

  return response.json();
}
