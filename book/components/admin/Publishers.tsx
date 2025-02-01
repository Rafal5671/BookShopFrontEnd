import React, { useState, useEffect, useCallback, useTransition } from "react";
import {
  Pagination,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from "@nextui-org/react";

import PublishersNavbar from "./PublisherNavbar";
import AddPublisher from "./AddPublisher";
import { useAuth } from "@/hooks/useAuth";
import { deletePublisherServer, fetchPublishersServer } from "../server/admin/publishers/actions";

export interface Publisher {
  publisherId: number;
  name: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // numer aktualnej strony (0-based)
  size: number;
}

const Publishers: React.FC = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    publisher: Publisher | null;
  }>({ isOpen: false, publisher: null });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const { token } = useAuth();
  const pageSize = 12;

  // Dla operacji asynchronicznych (server actions):
  const [isPending, startTransition] = useTransition();

  // -----------------------------------------
  // 1. Pobieranie wydawców (server action)
  // -----------------------------------------
  const fetchPublishers = useCallback(
    async (page: number) => {
      if (!token) return;

      startTransition(async () => {
        try {
          const data = await fetchPublishersServer(token, page, pageSize);
          setPublishers(data.content);
          setTotalPages(data.totalPages);
        } catch (err: any) {
          console.error("Błąd podczas pobierania wydawców:", err);
        }
      });
    },
    [token]
  );

  // Wywołanie fetchPublishers przy zmianie currentPage
  useEffect(() => {
    fetchPublishers(currentPage);
  }, [currentPage, fetchPublishers]);

  // -----------------------------------------
  // 2. Usuwanie wydawcy (server action)
  // -----------------------------------------
  const confirmDeletePublisher = (publisher: Publisher) => {
    setDeleteConfirmation({ isOpen: true, publisher });
  };

  const deletePublisher = useCallback(
    async (publisherId: number) => {
      if (!token) return;

      startTransition(async () => {
        try {
          await deletePublisherServer(token, publisherId);
          // Usuń z listy w stanie
          setPublishers((prev) =>
            prev.filter((p) => p.publisherId !== publisherId)
          );
          // Zamknij modal
          setDeleteConfirmation({ isOpen: false, publisher: null });
        } catch (err) {
          console.error(err);
          setIsErrorModalOpen(true);
        }
      });
    },
    [token]
  );

  // -----------------------------------------
  // Render
  // -----------------------------------------

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <PublishersNavbar
        searchTerm=""
        setSearchTerm={() => { }}
        onOpen={() => setIsAddModalOpen(true)} // Otwieranie modala do dodawania wydawcy
      />

      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista Wydawców</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishers.map((publisher) => (
            <div
              key={publisher.publisherId}
              className="border rounded-lg bg-white shadow-md p-6 flex flex-col justify-between"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {publisher.name}
              </h2>
              <p className="text-sm text-gray-600">
                ID: {publisher.publisherId}
              </p>
              <Button
                className="mt-4 bg-red-500 font-semibold"
                onPress={() => confirmDeletePublisher(publisher)}
              >
                Usuń
              </Button>
            </div>
          ))}
        </div>

        {publishers.length === 0 && (
          <p className="text-gray-500 mt-4">
            Brak wydawców do wyświetlenia. Spróbuj dodać nowego wydawcę.
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
          setDeleteConfirmation({ isOpen: false, publisher: null })
        }
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Potwierdzenie usunięcia</ModalHeader>
          <ModalBody>
            Czy na pewno chcesz usunąć wydawcę{" "}
            <strong>{deleteConfirmation.publisher?.name}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() =>
                deleteConfirmation.publisher &&
                deletePublisher(deleteConfirmation.publisher.publisherId)
              }
            >
              Tak
            </Button>
            <Button
              color="default"
              onPress={() =>
                setDeleteConfirmation({ isOpen: false, publisher: null })
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
            <p>Nie można usunąć wydawcy, ponieważ jest powiązany z książkami.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setIsErrorModalOpen(false)}>
              Zamknij
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal dodawania wydawcy */}
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={() => setIsAddModalOpen(false)}
        size="lg"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            <AddPublisher
              onPublisherAdded={() => {
                fetchPublishers(currentPage); // Odśwież listę wydawców po dodaniu
                setIsAddModalOpen(false); // Zamknij modal
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Publishers;
