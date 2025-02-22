"use client"; // ten plik działa w przeglądarce

import React, { useState, useEffect, useTransition, useCallback } from "react";
import {
  Pagination,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from "@nextui-org/react";
import NavbarAuthors from "./NavbarAuthors";
import AddAuthor from "./AddAuthor";
import { useAuth } from "@/hooks/useAuth";
import { fetchAuthorsServer, deleteAuthorServer } from "../server/admin/authors/actions";
import { withAuth } from "../server/auth/withAuth";

export type Author = {
  authorId: number;
  firstName: string;
  lastName?: string | null;
};

const Authors: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const { token, sessionExpired, setSessionExpired } = useAuth();

  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);

  // Stan, który odzwierciedla aktualną wartość wpisaną w input
  const [searchTerm, setSearchTerm] = useState("");
  // Stan, który jest używany do wyszukiwania – aktualizowany dopiero po wciśnięciu Enter
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    author: Author | null;
  }>({ isOpen: false, author: null });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // W React 18 do operacji asynchronicznych "na żądanie" używamy useTransition:
  const [isPending, startTransition] = useTransition();

  // Funkcja pobierająca autorów – wykorzystujemy appliedSearchTerm
  const fetchAuthors = useCallback(() => {
    if (!token) return;

    startTransition(async () => {
      try {
        const data = await fetchAuthorsServer(currentPage, appliedSearchTerm);
        console.log("Wyszukiwanie dla:", appliedSearchTerm);
        // data zawiera obiekt zwrócony przez backend (np. { content, totalPages })
        setAuthors(data.content);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        if (error.message === "SESSION_EXPIRED") {
          setSessionExpired(true);
        } else {
          console.error(error);
        }
      }
    });
  }, [token, currentPage, appliedSearchTerm, setSessionExpired]);

  // Efekt pobierający autorów przy zmianie currentPage lub appliedSearchTerm
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Funkcja wywoływana po naciśnięciu Enter – aktualizuje appliedSearchTerm i resetuje stronę do 1
  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedSearchTerm(searchTerm);
  };

  const confirmDeleteAuthor = (author: Author) => {
    setDeleteConfirmation({ isOpen: true, author });
  };

  const deleteAuthor = useCallback(
    (authorId: number) => {
      if (!token) return;
      startTransition(async () => {
        try {
          await deleteAuthorServer(authorId);
          setAuthors((prev) => prev.filter((a) => a.authorId !== authorId));
          setDeleteConfirmation({ isOpen: false, author: null });
        } catch (err) {
          console.error(err);
        }
      });
    },
    [token]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar z możliwością wyszukiwania oraz przyciskiem "Dodaj autora" */}
      <NavbarAuthors
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpen={() => setIsAddModalOpen(true)}
        onSearch={handleSearch}
      />

      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista Autorów</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div
              key={author.authorId}
              className="border rounded-lg bg-white shadow-md p-6 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-full w-12 h-12 text-lg font-bold">
                  {author.firstName.charAt(0)}
                  {author.lastName?.charAt(0) || ""}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {author.firstName} {author.lastName || ""}
                  </h2>
                  <p className="text-sm text-gray-600">ID: {author.authorId}</p>
                </div>
              </div>
              <Button
                className="mt-4 bg-red-500 font-semibold"
                onPress={() => confirmDeleteAuthor(author)}
              >
                Usuń
              </Button>
            </div>
          ))}
        </div>

        {authors.length === 0 && (
          <p className="text-gray-500 mt-4">
            Brak autorów do wyświetlenia. Spróbuj dodać nowego autora.
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              disableCursorAnimation
              showControls
              color="warning"
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
          setDeleteConfirmation({ isOpen: false, author: null })
        }
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Potwierdzenie usunięcia</ModalHeader>
          <ModalBody>
            Czy na pewno chcesz usunąć autora{" "}
            <strong>
              {deleteConfirmation.author?.firstName}{" "}
              {deleteConfirmation.author?.lastName || ""}
            </strong>
            ?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() =>
                deleteConfirmation.author &&
                deleteAuthor(deleteConfirmation.author.authorId)
              }
            >
              Tak
            </Button>
            <Button
              color="default"
              onPress={() =>
                setDeleteConfirmation({ isOpen: false, author: null })
              }
            >
              Nie
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal dodawania autora */}
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={() => setIsAddModalOpen(false)}
        size="lg"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            <AddAuthor
              onAuthorAdded={() => {
                fetchAuthors();
                setIsAddModalOpen(false);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withAuth(Authors, ['ROLE_ADMIN', 'ROLE_EMPLOYEE']);
