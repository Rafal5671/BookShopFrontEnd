"use server";

import { fetchWithAuth } from "@/auth/apiClient";

export async function submitReview(
  token: string | null,
  bookId: number,
  reviewId: number | null,
  rating: number,
  commentPl: string
): Promise<void> {
  if (!token) {
    throw new Error('Unauthorized');
  }
  console.log(bookId);
  const method = reviewId ? 'PUT' : 'POST';
  const url = reviewId
    ? `http://localhost:8080/api/reviews/${bookId}/${reviewId}`
    : `http://localhost:8080/api/reviews/${bookId}`;

  const res = await fetchWithAuth(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Jeżeli naprawdę musisz ręcznie przekazać token (np. serwerowo), możesz to zostawić:
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      rating,
      commentPl,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to submit review');
  }
}

export async function deleteReview(
  token: string | null,
  bookId: number,
  reviewId: number
): Promise<void> {
  if (!token) {
    throw new Error('Unauthorized');
  }

  const url = `http://localhost:8080/api/reviews/${bookId}/${reviewId}`;

  const res = await fetchWithAuth(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to delete review');
  }
}
