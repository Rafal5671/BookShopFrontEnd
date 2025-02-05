`use server`
import { fetchWithAuth } from "@/auth/apiClient";
import { Category,PageResponse } from "@/types/types";

const API_BASE_URL = "http://localhost:8080/api/admin/categories";

export async function fetchCategoriesServer(
  page: number,
  size: number
): Promise<PageResponse<Category>> {
  // 1) Używamy fetchWithAuth
  const response = await fetchWithAuth(`${API_BASE_URL}?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas pobierania kategorii.");
  }

  return response.json();
}

export async function addCategoryServer(
  nameEn: string,
  namePl: string
): Promise<Category> {
  const response = await fetchWithAuth(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nameEn, namePl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas dodawania kategorii.");
  }

  return response.json();
}

export async function updateCategoryServer(
  categoryId: number,
  nameEn: string,
  namePl: string
): Promise<Category> {
  const response = await fetchWithAuth(`${API_BASE_URL}/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nameEn, namePl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas aktualizacji kategorii.");
  }

  return response.json();
}

export async function deleteCategoryServer(categoryId: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/${categoryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas usuwania kategorii.");
  }
}

