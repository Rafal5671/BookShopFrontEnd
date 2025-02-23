import { fetchWithAuth } from "@/auth/apiClient";
import { User } from "@/types/types";

export async function fetchUserProfileServer(): Promise<User> {

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


export async function deleteReviewServer(reviewId: number): Promise<void> {
  try {

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