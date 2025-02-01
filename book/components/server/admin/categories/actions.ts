// src/server/admin/categories/actions.ts

export type Category = {
    Id: number;
    nameEn: string;
    namePl: string;
    createdAt: string; // ISO string
  };
  
  export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number; // current page (0-based)
    size: number;
  }
const API_BASE_URL = "http://localhost:8080/api/admin/categories"; // Dostosuj do swojego URL

export const fetchCategoriesServer = async (
  token: string,
  page: number,
  size: number
): Promise<PageResponse<Category>> => {
  const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas pobierania kategorii.");
  }

  return response.json();
};

export const addCategoryServer = async (
  token: string,
  nameEn: string,
  namePl: string
): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nameEn, namePl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas dodawania kategorii.");
  }

  return response.json();
};

export const updateCategoryServer = async (
  token: string,
  categoryId: number,
  nameEn: string,
  namePl: string
): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nameEn, namePl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas aktualizacji kategorii.");
  }

  return response.json();
};

export const deleteCategoryServer = async (
  token: string,
  categoryId: number
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Wystąpił błąd podczas usuwania kategorii.");
  }
};
