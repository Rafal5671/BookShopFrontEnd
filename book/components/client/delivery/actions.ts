"use server";

/**
 * Tworzy zamówienie w backendzie.
 * 
 * @param token - token uwierzytelniający
 * @param orderData - dane zamówienia (items, address, amount)
 */
export async function createOrderServer(token: string, orderData: any) {
  if (!token) {
    throw new Error("Brak tokenu (createOrderServer). Zaloguj się ponownie.");
  }

  const response = await fetch("http://localhost:8080/api/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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
 * 
 * @param token - token JWT
 */
export async function fetchCustomerDataServer(token: string) {
  if (!token) {
    throw new Error("Brak tokenu (fetchCustomerDataServer).");
  }

  const response = await fetch("http://localhost:8080/api/customers/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Błąd podczas pobierania danych użytkownika.");
  }

  return response.json();
}
