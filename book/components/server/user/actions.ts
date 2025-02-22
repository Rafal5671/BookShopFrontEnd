import { fetchWithAuth } from "@/auth/apiClient";
import { User } from "@/types/types";

export async function fetchUserProfileServer(): Promise<User> {
  // 1) Wywołujemy fetchWithAuth zamiast fetch
  const response = await fetchWithAuth("http://localhost:8080/api/customers/profile/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Błąd przy pobieraniu danych użytkownika: ${response.status} - ${errorText}`);
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
export async function deleteReviewServer(reviewId: number): Promise<void> {
  try {
    // Używamy fetchWithAuth (tak jak w fetchUserProfileServer)
    const response = await fetchWithAuth(
      `http://localhost:8080/api/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
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