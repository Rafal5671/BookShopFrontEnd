import { User } from "@/types/types";

export async function fetchUserProfileServer(token: string): Promise<User> {
    if (!token) {
        throw new Error("Brak tokenu uwierzytelniającego (fetchUserProfileServer).");
    }

    const response = await fetch("http://localhost:8080/api/customers/profile/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Błąd przy pobieraniu danych użytkownika: ${response.status} - ${errorText}`
        );
    }

    const result: User = await response.json();
    return result;
}

/**
 * Usuwa recenzję o podanym ID.
 *
 * @param token - token uwierzytelniający
 * @param reviewId - ID recenzji do usunięcia
 * @returns Promise<void>
 * @throws Error w przypadku braku tokenu lub błędu w fetch
 */
export async function deleteReviewServer(
    token: string,
    reviewId: number
  ): Promise<void> {
    if (!token) {
      throw new Error("Brak tokenu uwierzytelniającego (deleteReviewServer).");
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/customers/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Błąd przy usuwaniu recenzji: ${response.status} - ${errorText}`
        );
      }
    } catch (error: any) {
      throw new Error(
        error.message || "Nieznany błąd podczas usuwania recenzji."
      );
    }
  }