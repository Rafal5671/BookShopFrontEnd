"use server";

import { fetchWithAuth } from "@/auth/apiClient";


export async function createOrderServer(orderData: any) {

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


  return response.json();
}

export async function fetchCustomerDataServer() {

  const response = await fetchWithAuth("http://localhost:8080/api/customers/me", {
    method: "GET",
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Błąd podczas pobierania danych użytkownika.");
  }

  return response.json();
}
