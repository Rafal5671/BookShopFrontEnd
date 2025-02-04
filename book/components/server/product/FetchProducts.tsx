'use server';

import { Product } from "@/types/types";

// Funkcja do pobierania produktów po stronie serwera
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch("http://localhost:8080/api/books", {
      cache: "no-store", // Wyłączenie cache'owania
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const products: Product[] = await res.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
