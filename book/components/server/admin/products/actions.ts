"use server";

import { PageResponse, Author, Product, Publisher } from "@/types/types";


export async function fetchPublishersServer(token: string): Promise<PageResponse<Publisher>> {
  if (!token) throw new Error("Brak tokenu uwierzytelniającego (publishers).");

  const res = await fetch(
    "http://localhost:8080/api/admin/publishers?page=0&size=1000",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Błąd podczas pobierania wydawnictw.");
  }

  return res.json(); // Zakładamy, że serwer zwraca PagedResponse<Publisher>
}

/**
 * Pobranie listy autorów z back-endu
 */
export async function fetchAuthorsServer(token: string): Promise<PageResponse<Author>> {
  if (!token) throw new Error("Brak tokenu uwierzytelniającego (authors).");

  const res = await fetch(
    "http://localhost:8080/api/admin/authors?page=0&size=10000",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
export async function createProductServer(token: string, requestBody: any) {
  if (!token) throw new Error("Brak tokenu uwierzytelniającego (create).");

  const res = await fetch("http://localhost:8080/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    // Można spróbować odczytać błąd z JSON
    let errorData;
    try {
      errorData = await res.json();
    } catch { }
    throw new Error(errorData?.message ?? "Błąd podczas dodawania produktu.");
  }

  return res.json();
}

/**
 * Aktualizacja istniejącego produktu
 */
export async function updateProductServer(token: string, bookId: number, requestBody: any) {
  if (!token) throw new Error("Brak tokenu uwierzytelniającego (update).");

  const res = await fetch(`http://localhost:8080/api/admin/products/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch { }
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
  token: string,
  page: number,
  size: number
): Promise<PageResponse<Product>> {
  if (!token) {
    throw new Error("Brak tokenu uwierzytelniającego (fetchProducts).");
  }

  // Nasz backend wymaga 0-based, więc konwertujemy:
  const springPageIndex = page - 1;

  const response = await fetch(
    `http://localhost:8080/api/admin/products?page=${springPageIndex}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
export async function deleteProductServer(token: string, productId: number) {
  if (!token) {
    throw new Error("Brak tokenu uwierzytelniającego (deleteProduct).");
  }

  const response = await fetch(
    `http://localhost:8080/api/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć produktu.");
  }

  // Możesz zwrócić JSON z informacją o sukcesie
  return response.json();
}