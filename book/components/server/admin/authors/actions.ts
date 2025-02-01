"use server";

export async function addAuthor(token: string | null, firstName: string, lastName: string) {
    if (!token) {
        throw new Error("Brak tokenu!");
    }

    const response = await fetch("http://localhost:8080/api/authors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
    });

    if (!response.ok) {
        throw new Error(`Błąd zewnętrznego API: ${response.status}`);
    }

    return response.json();
}
export async function fetchAuthorsServer(token: string, page: number) {
    // Jeśli token jest potrzebny do autoryzacji – sprawdzamy:
    if (!token) throw new Error("Brak tokenu.");
  
    // Konwersja numeru strony na indeks używany przez Springa
    const springPageIndex = page - 1;
  
    // Wywołanie do Twojego backendu
    const response = await fetch(
      `http://localhost:8080/api/admin/authors?page=${springPageIndex}&size=21`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (response.status === 401) {
      // Możemy rzucić błąd, żeby klient wiedział, że sesja wygasła
      throw new Error("SESSION_EXPIRED");
    }
  
    if (!response.ok) {
      throw new Error(`Błąd (status ${response.status}).`);
    }
  
    return response.json(); // Zwracamy wynik do komponentu
  }
  
  // Usuwa autora po ID
  export async function deleteAuthorServer(token: string, authorId: number) {
    if (!token) throw new Error("Brak tokenu.");
  
    const response = await fetch(
      `http://localhost:8080/api/admin/authors/${authorId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Nie można usunąć autora (status: ${response.status}).`);
    }
  
    return response.json();
  }