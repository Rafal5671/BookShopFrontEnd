import { fetchWithAuth } from "@/auth/apiClient";

export interface DashboardStats {
  ordersCount: number;
  usersCount: number;
  productsCount: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetchWithAuth("http://localhost:8080/api/admin/statistics", {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}
