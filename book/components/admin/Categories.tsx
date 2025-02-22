import React, { useState, useEffect, useCallback, useTransition } from "react";
import {
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import { FaEdit, FaInfoCircle, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import AddCategory from "./AddCategory";
import { addCategoryServer, deleteCategoryServer, fetchCategoriesServer, updateCategoryServer } from "../server/admin/categories/actions";
import { withAuth } from "../server/auth/withAuth";

export type Category = {
    Id: number;
    nameEn: string;
    namePl: string;
    createdAt: string; // ISO string
  };
  
  export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number; // current page (0-based)
    size: number;
  }
const Categories = () => {
  // ----------------------------------------------
  // 1. Stan i zmienne
  // ----------------------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NextUI stuff
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  // Dodatkowe stany do obsługi modali
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Liczba kategorii na stronę
  const categoriesPerPage = 10;

  // Autoryzacja
  const { token, loading: authLoading } = useAuth();

  // Dla operacji asynchronicznych z server actions:
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------
  // 2. Pobieranie listy kategorii (Server Action)
  // ----------------------------------------------
  const fetchCategories = useCallback(
    async (page: number) => {
      if (!token) return;
      setIsLoading(true);
      setError(null);

      startTransition(async () => {
        try {
          const data = await fetchCategoriesServer(page, categoriesPerPage);
          setCategories(data.content);
          console.log(categories);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        } catch (err: any) {
          setIsLoading(false);
          setError(err.response?.data?.message || err.message || "Wystąpił błąd");
        }
      });
    },
    [token]
  );

  // Ładuj kategorie, kiedy zmienia się currentPage
  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage, fetchCategories]);

  // ----------------------------------------------
  // 3. Dodawanie nowej kategorii
  // ----------------------------------------------
  const addCategory = useCallback(
    async (nameEn: string, namePl: string) => {
      if (!token) return;
      try {
        const newCategory = await addCategoryServer(nameEn, namePl);
        setCategories((prev) => [newCategory, ...prev]);
        onOpen(false);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Wystąpił błąd przy dodawaniu kategorii");
      }
    },
    [token, onOpen]
  );

  // ----------------------------------------------
  // 4. Edytowanie kategorii
  // ----------------------------------------------
  const editCategory = useCallback(
    async (categoryId: number, nameEn: string, namePl: string) => {
      console.log(`Editing category with ID: ${categoryId}`);
      if (!token) return;
      try {
        const updatedCategory = await updateCategoryServer(categoryId, nameEn, namePl);
        setCategories((prev) =>
          prev.map((cat) => (cat.Id === categoryId ? updatedCategory : cat))
        );
        editDisclosure.onOpenChange(false);
      } catch (err: any) {
        setError(err.message || "Wystąpił błąd przy edytowaniu kategorii.");
      }
    },
    [token, editDisclosure]
  );

  // ----------------------------------------------
  // 5. Usuwanie kategorii
  // ----------------------------------------------
  const confirmDeleteCategory = (category: Category) => {
    setDeleteConfirmation({ isOpen: true, category });
  };

  const deleteCategory = useCallback(
    async (categoryId: number) => {
      if (!token) return;
      try {
        await deleteCategoryServer(categoryId);
        setCategories((prev) => prev.filter((cat) => cat.Id !== categoryId));
        setDeleteConfirmation({ isOpen: false, category: null });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Wystąpił błąd przy usuwaniu kategorii");
      }
    },
    [token]
  );

  // ----------------------------------------------
  // 6. Filtrowanie na podstawie searchTerm
  // ----------------------------------------------
  const filteredCategories = categories.filter((category) => {
    return (
      category.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.namePl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ----------------------------------------------
  // 7. Render
  // ----------------------------------------------
  if (isLoading) {
    return <p>Ładowanie kategorii...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">

      <main className="p-4">
        <div className="flex justify-end mb-4">
          <Button
            className="bg-blue-500"
            onPress={onOpen}
          >
            Dodaj Kategorię
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.Id}
              className="border rounded-md shadow-sm p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {category.namePl} / {category.nameEn}
                </h3>
                <p className="text-sm text-gray-500">
                  Utworzono: {new Date(category.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {/* Szczegóły */}
                <Button
                  size="sm"
                  color="secondary"
                  onPress={() => {
                    setSelectedCategory(category);
                    detailsDisclosure.onOpen();
                  }}
                >
                  <FaInfoCircle />
                </Button>

                {/* Edytuj */}
                <Button
                  size="sm"
                  color="success"
                  onPress={() => {
                    setEditingCategory(category);
                    editDisclosure.onOpen();
                  }}
                >
                  <FaEdit />
                </Button>

                {/* Usuń */}
                <Button
                  size="sm"
                  onPress={() => confirmDeleteCategory(category)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <p className="text-gray-500 mt-4">Brak kategorii spełniających kryteria.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              disableCursorAnimation
              showControls
              color="warning"
              initialPage={currentPage + 1} // NextUI jest 1-based
              total={totalPages}
              onChange={(page) => setCurrentPage(page - 1)} // Konwertuj na 0-based
            />
          </div>
        )}
      </main>

      {/* Modal Dodawania Kategorii */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Dodaj Nową Kategorię</ModalHeader>
          <ModalBody>
            <AddCategory onSubmit={addCategory} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Edycji Kategorii */}
      <Modal
        isOpen={editDisclosure.isOpen}
        onOpenChange={editDisclosure.onOpenChange}
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Edycja Kategorii</ModalHeader>
          <ModalBody>
            {editingCategory && (
              <AddCategory
                initialData={editingCategory}
                onSubmit={(nameEn, namePl) =>
                  editCategory(editingCategory.Id, nameEn, namePl)
                }
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Potwierdzenia Usunięcia */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={() => setDeleteConfirmation({ isOpen: false, category: null })}
        size="sm"
        isDismissable
      >
        <ModalContent>
          <ModalHeader>Potwierdzenie usunięcia</ModalHeader>
          <ModalBody>
            Czy na pewno chcesz usunąć kategorię "{deleteConfirmation.category?.namePl}"?
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => deleteCategory(deleteConfirmation.category!.Id)}
            >
              Tak
            </Button>
            <Button
              variant="light"
              onPress={() => setDeleteConfirmation({ isOpen: false, category: null })}
            >
              Nie
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withAuth(Categories, ['ROLE_ADMIN', 'ROLE_EMPLOYEE']);
