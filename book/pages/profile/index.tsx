`use client`
import React, { useEffect, useState } from "react";
import { Card, Spinner } from "@nextui-org/react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { deleteReviewServer, fetchUserProfileServer } from "@/components/server/user/actions";
import { useTranslation } from "@/hooks/useTranslation";
// Typ dla pojedynczego elementu zamówienia
type OrderItem = {
  itemId: number;
  quantity: number;
  bookTitle: string;
};

// Typ dla pojedynczego zamówienia
type Order = {
  orderId: number;
  status:
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "RETURNED";
  orderType: "REGISTERED_USER" | "GUEST";
  amount: string;
  createdAt: string;
  orderDate: string;
  items: OrderItem[];
};

// Typ dla pojedynczej recenzji
type Review = {
  reviewId: number;
  rating: number;
  commentPl: string;
  commentEn: string;
  bookTitle: string;
  createdAt: string;
  reviewDate: string;
};

// Typ dla użytkownika
type User = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  orders: Order[];
  reviews: Review[];
};

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  // Funkcje do obsługi modalu
  const openDeleteModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedReviewId(null);
    setIsModalOpen(false);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (selectedReviewId === null) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      setDeleteError("Brak tokenu uwierzytelniającego.");
      return;
    }

    setDeleting(true);
    try {
      await deleteReviewServer(token, selectedReviewId);
      // Po udanym usunięciu, odśwież dane użytkownika
      if (userData) {
        setUserData({
          ...userData,
          reviews: userData.reviews.filter(
            (review) => review.reviewId !== selectedReviewId
          ),
        });
      }
      closeDeleteModal();
    } catch (error: unknown) {
      console.error("Błąd podczas usuwania recenzji:", error);
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Wystąpił nieznany błąd.");
      }
    } finally {
      setDeleting(false);
    }
  };

  // Funkcja do obsługi edycji recenzji (implementacja zależy od wymagań)
  const handleEdit = (reviewId: number) => {
    // Implementacja edycji recenzji
    console.log(`Edytuj recenzję o ID: ${reviewId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log(token);
    const getUserProfile = async () => {

      if (!token) {
        setError("Nie znaleziono tokenu. Użytkownik nie jest zalogowany.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserProfileServer(token);
        setUserData(data);
      } catch (error: unknown) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Wystąpił nieznany błąd.");
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
        <span className="ml-2">Ładowanie...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Brak danych użytkownika
      </div>
    );
  }

  // Funkcja pomocnicza do nadawania klas CSS w zależności od statusu zamówienia
  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500";
      case "PAID":
        return "text-blue-500";
      case "SHIPPED":
        return "text-indigo-500";
      case "DELIVERED":
        return "text-green-500";
      case "CANCELED":
        return "text-red-500";
      case "RETURNED":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <Card className="w-full max-w-5xl p-8 shadow-md bg-primary-100">
        {/* Nagłówek */}
        <h1 className="text-3xl font-bold text-center mb-8 uppercase">
          {t("greeting")} {userData.firstName}!
        </h1>


        {/* Dane osobowe */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {t("personalData")}
          </h2>
          <p className="mb-2">
            <span className="font-bold">{t("fullName")}:</span> {userData.firstName} {userData.lastName}
          </p>
          <p className="mb-2">
            <span className="font-bold">{t("email")}:</span> {userData.email}
          </p>
          <p className="mb-2">
            <span className="font-bold">{t("phone")}:</span> {userData.phone}
          </p>
          <p>
            <span className="font-bold">{t("accountCreated")}:</span> {userData.createdAt}
          </p>
        </div>


        {/* Zamówienia */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {t("orders")}
          </h2>
          {userData.orders.length > 0 ? (
            <div className="flex flex-col space-y-6">
              {userData.orders.map((order) => (
                <Card key={order.orderId} className="p-6 shadow-lg bg-primary-200">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">
                      {t("orderNumber")} #{order.orderId}
                    </h3>
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mb-2">
                    <span className="font-bold">{t("amount")}:</span> {order.amount} PLN
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">{t("date")}:</span>  {order.createdAt}
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">{t("products")}:</span>
                  </p>
                  <ul className="list-disc ml-5">
                    {order.items.map((item) => (
                      <li key={item.itemId}>
                        {item.bookTitle} (Ilość: {item.quantity})
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t("noOrders")}</p>
          )}
        </div>

        {/* Recenzje */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {t("reviews")}
          </h2>
          {userData.reviews.length > 0 ? (
            <div className="flex flex-col space-y-6">
              {userData.reviews.map((review) => (
                <Card key={review.reviewId} className="p-6 shadow-lg bg-primary-200 relative">
                  {/* Ikony edycji i usunięcia */}
                  <div className="absolute top-4 right-4 flex space-x-4">
                    <button
                      onClick={() => handleEdit(review.reviewId)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edytuj"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(review.reviewId)}
                      className="text-red-500 hover:text-red-700"
                      title="Usuń"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                  {/* Tytuł książki i gwiazdki */}
                  <h3 className="text-lg font-bold mb-2 flex items-center space-x-2">
                    <span>{review.bookTitle}</span>
                    <span className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`${index < review.rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </span>
                  </h3>
                  {/* Komentarz */}
                  <p className="mb-2">
                    <span className="font-bold">{t("comment")}:</span>{" "}
                    {review.commentPl}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t("noReviews")}</p>
          )}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
              <div className=" p-6 rounded-lg shadow-lg bg-black max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">{t("confirmDeletion")}</h2>
                <p className="mb-4">{t("deleteReviewQuestion")}</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    {t("cancel")}
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
