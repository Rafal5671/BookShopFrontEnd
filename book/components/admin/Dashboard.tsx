// DashboardPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { withAuth } from "../server/auth/withAuth";
import { DashboardStats, fetchDashboardStats } from "../server/admin/dashboard/actions";


const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching dashboard stats");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Układ kart w gridzie Tailwind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Karta nr 1 - Ilość zamówień */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Ilość zamówień
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats?.ordersCount}</p>
          </CardBody>
        </Card>

        {/* Karta nr 2 - Ilość produktów */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Ilość produktów
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats?.productsCount}</p>
          </CardBody>
        </Card>

        {/* Karta nr 3 - Liczba użytkowników */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-700">
              Liczba użytkowników
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{stats?.usersCount}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage, ["ROLE_ADMIN", "ROLE_EMPLOYEE"]);
