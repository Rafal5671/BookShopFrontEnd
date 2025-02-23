"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import {
  Input,
  Pagination,
  Modal,
  Button,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchOrdersServer,
  SortOption,
  updateOrderStatusServer,
} from "../server/admin/orders/actions";
import { OrderAdmin } from "@/types/types";
import { withAuth } from "../server/auth/withAuth";

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

function Orders() {
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("Wszystkie");
  const [searchTerm, setSearchTerm] = useState<string>("");


  const [sortOption, setSortOption] = useState<SortOption>("dateAsc");

  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 4;


  const [selectedOrder, setSelectedOrder] = useState<OrderAdmin | null>(null);


  const detailsDisclosure = useDisclosure();


  const { token } = useAuth();


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const [isPending, startTransition] = useTransition();


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError("Brak tokenu autoryzacji. Zaloguj się ponownie.");
      return;
    }

    setIsLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const data = await fetchOrdersServer(
          currentPage,
          rowsPerPage,
          sortOption,
          searchTerm,
          filterStatus
        );
 
        setOrders(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Nieznany błąd");
      } finally {
        setIsLoading(false);
      }
    });
  }, [token, currentPage, rowsPerPage, sortOption, searchTerm, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortOption, fetchOrders]);


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
          await updateOrderStatusServer(orderId, mappedStatus);
          fetchOrders();
        } catch (err) {
          console.error(err);
          setError("Nie udało się zaktualizować statusu zamówienia.");
        }
      });
    },
    [token, fetchOrders]
  );


  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "Wszystkie") {
      if (REVERSE_STATUS_MAP[order.status] !== filterStatus) {
        return false;
      }
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !String(order.orderId).toLowerCase().includes(searchLower) &&
        !String(order.orderDate).toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  function resetPagination() {
    setCurrentPage(1);
  }


  if (isLoading) return <p>Ładowanie zamówień...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Zamówienia</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
        <Input
          type="text"
          placeholder="ID lub data (np. 2025-01-02)"
          startContent={<FaSearch />}
          className="w-64"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchTerm((e.target as HTMLInputElement).value);
              resetPagination();
            }
          }}
        />

        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                resetPagination();
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
            >
              <option value="Wszystkie">Wszystkie</option>
              {Object.keys(STATUS_MAP).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Sortuj:
            </label>
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

      {/* Lista zamówień */}
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
                <strong>Data:</strong> {formatDate(order.orderDate)}
              </div>
              <div className="text-gray-800">
                <strong>Ilość produktów:</strong>{" "}
                {order.itemCount || (order.orderItems && order.orderItems.length)}
              </div>
              <div className="text-gray-800">
                <strong>Kwota:</strong> {order.totalAmount} PLN
              </div>
            </div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <select
                value={REVERSE_STATUS_MAP[order.status] || order.status}
                onChange={(e) =>
                  updateOrderStatus(order.orderId.toString(), e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 ml-2"
              >
                {Object.keys(STATUS_MAP).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Button onPress={() => {
                setSelectedOrder(order);
                detailsDisclosure.onOpen();
              }}>Szczegóły</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginacja */}
      <div className="flex justify-center mt-6">
        <Pagination
          total={totalPages}
          initialPage={1}
          color="warning"
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal ze szczegółami zamówienia */}
      <Modal isOpen={detailsDisclosure.isOpen} onOpenChange={detailsDisclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">Szczegóły zamówienia</h3>
          </ModalHeader>
          <ModalBody>
            {selectedOrder ? (
              <div>
                <div className="mb-4">
                  <strong>ID zamówienia:</strong> {selectedOrder.orderId}
                </div>
                <div className="mb-4">
                  <strong>Data zamówienia:</strong>{" "}
                  {formatDate(selectedOrder.orderDate)}
                </div>
                <div className="mb-4">
                  <strong>Łączna kwota:</strong> {selectedOrder.totalAmount} PLN
                </div>
                <div className="mb-4">
                  <strong>Ilość produktów:</strong>{" "}
                  {selectedOrder.itemCount ||
                    (selectedOrder.orderItems && selectedOrder.orderItems.length)}
                </div>
                <div>
                  <h4 className="font-bold mb-2">Produkty w zamówieniu:</h4>
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item) => (
                      <div key={item.productId} className="flex flex-col gap-1 mb-1 border-b pb-1">
                        <span>
                          <strong>ID produktu:</strong> {item.productId}
                        </span>
                        <span>
                          <strong>Nazwa produktu:</strong> {item.productName}
                        </span>
                        <span>
                          <strong>Ilość:</strong> {item.quantity}
                        </span>
                        <span>
                          <strong>Łączna cena pozycji:</strong> {item.lineTotal}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Brak produktów.</p>
                  )}
                </div>
              </div>
            ) : (
              <p>Brak danych zamówienia.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={detailsDisclosure.onClose}>Zamknij</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default withAuth(Orders, ["ROLE_ADMIN", "ROLE_EMPLOYEE"]);
