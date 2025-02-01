"use server";

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
  
    const method = reviewId ? 'PUT' : 'POST';
    const url = reviewId
      ? `http://localhost:8080/api/reviews/${bookId}/${reviewId}`
      : `http://localhost:8080/api/reviews/${bookId}`;
  
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
  
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete review');
    }
  }