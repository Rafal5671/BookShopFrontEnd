"use server";

import { fetchWithAuth } from "@/auth/apiClient";

/**
 * Tworzy zamówienie w backendzie.
 * 
 * @param orderData - dane zamówienia (items, address, amount)
 */
export async function createOrderServer(orderData: any) {
  // Używamy fetchWithAuth, który sam dołączy token z localStorage
  const response = await fetchWithAuth("http://localhost:8080/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Nieznany błąd podczas składania zamówienia");
  }

  // Zwracamy np. potwierdzenie zamówienia
  return response.json();
}

/**
 * Pobiera dane użytkownika (opcjonalne).
 */
export async function fetchCustomerDataServer() {
  // Używamy fetchWithAuth, który dołączy token z localStorage
  const response = await fetchWithAuth("http://localhost:8080/api/customers/me", {
    method: "GET",
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Błąd podczas pobierania danych użytkownika.");
  }

  return response.json();
}
