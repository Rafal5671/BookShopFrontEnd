'use server';

import { Product } from "@/types/types";


export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch("http://localhost:8080/api/books/random", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    console.log(data);

    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
