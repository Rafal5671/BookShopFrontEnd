"use server";

import { fetchWithAuth } from "@/auth/apiClient";
import { Product, Review } from "@/types/types";

/**
 * Pobiera produkt na podstawie ID.
 */
export async function fetchProductById(
  productId: string,
  lang: string = "pl"
): Promise<Product> {
  try {
    const res = await fetchWithAuth(
      `http://localhost:8080/api/books/${productId}?lang=${lang}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product with ID: ${productId}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error("Empty response from server");
    }

    const product: Product = JSON.parse(text);
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Pobiera recenzję zalogowanego użytkownika.
 */
export async function fetchUserReview(
  productId: string
): Promise<Review | null> {
  try {
    const res = await fetchWithAuth(
      `http://localhost:8080/api/reviews/${productId}/me`,
      {
        method: "GET",
      }
    );

    if (res.status === 401) {
      console.warn("Token JWT wygasł. Brak dostępu do recenzji użytkownika.");
      return null;
    }

    if (res.status === 404) {
      console.warn(`Brak recenzji użytkownika dla produktu ${productId}`);
      return null;
    }

    if (!res.ok) {
      throw new Error(`Błąd API: ${res.statusText}`);
    }

    const fetched = await res.json();
    const review: Review = {
      reviewId: fetched.reviewId,
      name: fetched.name,
      content: fetched.content || fetched.commentPl,
      rating: fetched.rating,
    };

    return review;
  } catch (error) {
    console.error("Error fetching user review:", error);
    throw error;
  }
}

/**
 * Pobiera wszystkie recenzje dla produktu.
 */
export async function fetchAllReviews(productId: string): Promise<Review[]> {
  try {
    const res = await fetchWithAuth(
      `http://localhost:8080/api/reviews/book-reviews/${productId}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch reviews for product ID: ${productId}`);
    }

    const data = await res.json();
    const mappedReviews: Review[] = data.map((rev: any) => ({
      reviewId: rev.reviewId,
      name: rev.name,
      content: rev.content || rev.commentPl,
      rating: rev.rating,
    }));

    return mappedReviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}


export async function updateUserReview(
  productId: string,
  reviewId: number,
  newContent: string,
  newRating: number
): Promise<void> {
  try {
    const res = await fetchWithAuth(
      `http://localhost:8080/api/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent, rating: newRating }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update review ID: ${reviewId}`);
    }

    console.log("Review updated successfully.");
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}


export async function deleteUserReview(reviewId: string): Promise<void> {
  try {
    const res = await fetchWithAuth(
      `http://localhost:8080/api/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete review ID: ${reviewId}`);
    }

    console.log("Review deleted successfully.");
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}
