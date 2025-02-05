"use server";

import { fetchWithAuth } from "@/auth/apiClient";

export async function addAuthor(firstName: string, lastName: string) {
  // Wywołujemy fetchWithAuth
  const response = await fetchWithAuth("http://localhost:8080/api/authors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName }),
  });

  if (!response.ok) {
    throw new Error(`Błąd zewnętrznego API: ${response.status}`);
  }

  return response.json();
}

export async function fetchAuthorsServer(page: number, query?: string) {
  const springPageIndex = page - 1;
  let endpoint: string;
  if (query && query.trim() !== "") {
    // Endpoint wyszukiwania autorów
    endpoint = `http://localhost:8080/api/admin/authors?query=${encodeURIComponent(query)}&page=${springPageIndex}&size=21`;
  } else {
    // Endpoint pobierający wszystkich autorów
    endpoint = `http://localhost:8080/api/admin/authors?page=${springPageIndex}&size=21`;
  }
  const response = await fetchWithAuth(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Możesz wyrzucić błąd lub obsłużyć inaczej
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    throw new Error(`Błąd (status ${response.status}).`);
  }

  return response.json();
}


// Usuwa autora po ID
export async function deleteAuthorServer(authorId: number) {
  const response = await fetchWithAuth(
    `http://localhost:8080/api/admin/authors/${authorId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Nie można usunąć autora (status: ${response.status}).`);
  }

  return response.json();
}