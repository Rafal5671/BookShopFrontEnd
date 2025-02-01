import React, { useState, useEffect } from "react";
import {
  Pagination,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from "@nextui-org/react";
import { useAuth } from "@/hooks/useAuth";

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // numer aktualnej strony (0-based)
  size: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    user: null as User | null,
  }); // Modal potwierdzenia usunięcia
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Modal błędu
const { token, loading, logout } = useAuth();
  const pageSize = 12;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = (page: number) => {
    const springPageIndex = page - 1;
    if (!token) return;

    fetch(
      `http://localhost:8080/api/admin/users?page=${springPageIndex}&size=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: PageResponse<User>) => {
        setUsers(data.content);
        setTotalPages(data.totalPages);
      });
  };

  const confirmDeleteUser = (user: User) => {
    setDeleteConfirmation({ isOpen: true, user });
  };

  const deleteUser = (userId: number) => {
    if (!token) return;

    fetch(`http://localhost:8080/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nie można usunąć użytkownika.");
        }
        return response.json();
      })
      .then(() => {
        setUsers(users.filter((user) => user.userId !== userId)); // Usuń z listy
        setDeleteConfirmation({ isOpen: false, user: null }); // Zamknij modal
      })
      .catch(() => {
        setIsErrorModalOpen(true); // Otwórz modal błędu
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista Użytkowników</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.userId}
              className="border rounded-lg bg-white shadow-md p-6 flex flex-col justify-between"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {user.username}
              </h2>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Rola: {user.role}</p>
              <Button
                className="mt-4 bg-red-500 font-semibold"
                onPress={() => confirmDeleteUser(user)}
              >
                Usuń
              </Button>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-gray-500 mt-4">
            Brak użytkowników do wyświetlenia.
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              disableCursorAnimation
              showControls
              initialPage={currentPage}
              total={totalPages}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </main>

      {/* Modal potwierdzenia usunięcia */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={() =>
          setDeleteConfirmation({ isOpen: false, user: null })
        }
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Potwierdzenie usunięcia</ModalHeader>
          <ModalBody>
            Czy na pewno chcesz usunąć użytkownika{" "}
            <strong>{deleteConfirmation.user?.username}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() =>
                deleteConfirmation.user &&
                deleteUser(deleteConfirmation.user.userId)
              }
            >
              Tak
            </Button>
            <Button
              color="default"
              onPress={() =>
                setDeleteConfirmation({ isOpen: false, user: null })
              }
            >
              Nie
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal błędu */}
      <Modal
        isOpen={isErrorModalOpen}
        onOpenChange={() => setIsErrorModalOpen(false)}
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            <p>Nie można usunąć użytkownika, ponieważ jest powiązany z innymi danymi.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setIsErrorModalOpen(false)}>
              Zamknij
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Users;
