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
import { fetchUsers as fetchUsersAPI,deleteUser as deleteUserAPI,User } from "../server/admin/users/actions";
import { withAuth } from "../server/auth/withAuth";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    user: null as User | null,
  });
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const pageSize = 12;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      const data = await fetchUsersAPI(page, pageSize);
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDeleteUser = (user: User) => {
    setDeleteConfirmation({ isOpen: true, user });
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUserAPI(userId);
      setUsers(users.filter((user) => user.userId !== userId));
      setDeleteConfirmation({ isOpen: false, user: null });
    } catch (error) {
      setIsErrorModalOpen(true);
    }
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
                handleDeleteUser(deleteConfirmation.user.userId)
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
            <p>
              Nie można usunąć użytkownika, ponieważ jest powiązany z
              innymi danymi.
            </p>
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

export default withAuth(Users, ['ROLE_ADMIN']);
