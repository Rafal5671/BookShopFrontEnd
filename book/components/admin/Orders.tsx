"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { Input, Pagination } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrdersServer, OrderAdmin, SortOption, updateOrderStatusServer } from "../server/admin/orders/actions";

// Import z pliku z server actions:


const STATUS_MAP: { [key: string]: string } = {
  "Oczekujące": "PENDING",
  "Opłacone": "PAID",
  "Wysłane": "SHIPPED",
  "Dostarczone": "DELIVERED",
  "Anulowane": "CANCELED",
  "Zwrócone": "RETURNED",
};

const REVERSE_STATUS_MAP: { [key: string]: string } = {
  PENDING: "Oczekujące",
  PAID: "Opłacone",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELED: "Anulowane",
  RETURNED: "Zwrócone",
};

const STATUSES = ["Wszystkie", "Nowe", "W realizacji", "Wysłane", "Zrealizowane"];

export default function Orders() {
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("Wszystkie");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sortowanie
  const [sortOption, setSortOption] = useState<SortOption>("dateAsc");

  // Paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 4;

  // Auth
  const { token } = useAuth();

  // Stan ładowania i błędów
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React 18: do zarządzania asynchronicznymi operacjami
  const [isPending, startTransition] = useTransition();

  // --------------------------------------------
  // 1. Pobieranie zamówień (Server Action)
  // --------------------------------------------
  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError("Brak tokenu autoryzacji. Zaloguj się ponownie.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Wywołujemy server action w startTransition
    startTransition(async () => {
      try {
        const data = await fetchOrdersServer(token, currentPage, rowsPerPage, sortOption);
        setOrders(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Nieznany błąd");
      } finally {
        setIsLoading(false);
      }
    });
  }, [token, currentPage, rowsPerPage, sortOption]);

  // Odpal fetchOrders przy zmianie currentPage lub sortOption
  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortOption, fetchOrders]);

  // --------------------------------------------
  // 2. Aktualizacja statusu zamówienia (Server Action)
  // --------------------------------------------
  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      const mappedStatus = STATUS_MAP[newStatus];
      if (!mappedStatus) {
        console.error("Nieprawidłowy status:", newStatus);
        return;
      }

      if (!token) {
        setError("Brak tokenu autoryzacji.");
        return;
      }

      startTransition(async () => {
        try {
          await updateOrderStatusServer(token, orderId, mappedStatus);
          // Po udanej aktualizacji możesz np. odświeżyć listę:
          fetchOrders();
        } catch (err) {
          console.error(err);
          setError("Nie udało się zaktualizować statusu zamówienia.");
        }
      });
    },
    [token, fetchOrders]
  );

  // --------------------------------------------
  // 3. Filtrowanie lokalne (status i searchTerm)
  // --------------------------------------------
  const filteredOrders = orders.filter((order) => {
    // Filtrowanie po statusie
    if (filterStatus !== "Wszystkie") {
      // Tu ewentualnie mapowanie na backendowy status?
      if (REVERSE_STATUS_MAP[order.status] !== filterStatus) {
        return false;
      }
    }

    // Filtrowanie po searchTerm
    if (searchTerm) {
      // U Ciebie w oryginale to nie wysyłało do backendu, więc robimy lokalnie
      // np. sprawdzamy czy ID lub data zawiera searchTerm
      if (
        !order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.date.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });

  // Reset paginacji przy zmianie filtra
  function resetPagination() {
    setCurrentPage(1);
  }

  // --------------------------------------------
  // 4. Render
  // --------------------------------------------
  if (isLoading) return <p>Ładowanie zamówień...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Zamówienia</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
        <Input
          type="text"
          placeholder="ID lub data (np. 2025-01-02)"
          value={searchTerm}
          startContent={<FaSearch />}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            resetPagination();
          }}
          className="w-64"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                resetPagination();
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Sortuj:</label>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value as SortOption);
                resetPagination();
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
            >
              <option value="dateAsc">Data: rosnąco</option>
              <option value="dateDesc">Data: malejąco</option>
              <option value="amountAsc">Kwota: rosnąco</option>
              <option value="amountDesc">Kwota: malejąco</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.orderId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border rounded-md bg-white shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-gray-800">
                <strong>ID:</strong> {order.orderId}
              </div>
              <div className="text-gray-800">
                <strong>Data:</strong> {order.date}
              </div>
              <div className="text-gray-800">
                <strong>Ilość:</strong> {order.itemsCount}
              </div>
              <div className="text-gray-800">
                <strong>Kwota:</strong> {order.amount}
              </div>
            </div>
            <div className="text-gray-800 flex items-center gap-2">
              <strong>Status:</strong>
              <select
                value={REVERSE_STATUS_MAP[order.status] || order.status}
                onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
              >
                {Object.keys(STATUS_MAP).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Paginacja */}
      <div className="flex justify-center mt-6">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}       // wersje NextUI od 5.0 mają "page"
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
