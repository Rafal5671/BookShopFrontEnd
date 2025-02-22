"use client";

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
import AddProduct from "./AddProducts";
import NavbarProducts from "./ProductsNavbar";
import ProductDetails from "./ProductDetails";
import { FaEdit, FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import {
  deleteProductServer,
  fetchCategories,
  fetchGenres,
  fetchProductsServer,
} from "../server/admin/products/actions";
import { withAuth } from "../server/auth/withAuth";

interface Genre {
  genreId: number;
  name: string;
}

type Product = {
  bookId: number;
  titlePl: string;
  titleEn: string;
  imageUrl?: string;
  pagesCount: number;
  releseYear: number;
  price: number;
  descriptionPl?: string;
  descriptionEN?: string;
  discountPrice?: number;
  staticImage?: string;
  rating: number;
  reviews: { reviewId: number; user: string; content: string; rating: number }[];
  releaseDate: string;
  // Przyjmujemy, że kategoria i gatunki są zwracane jako string (możesz to dostosować do własnych potrzeb)
  category?: string;
  genres?: string[];
  stock?: number;
};

const Products = () => {
  // Stany pól filtrowania (inputy)
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  // Stany zastosowanych filtrów (aplikowanych po kliknięciu "Filtruj")
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState("");
  const [appliedGenreFilter, setAppliedGenreFilter] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NextUI – kontrola modali
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  // Modal potwierdzenia usunięcia
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Liczba produktów na stronę
  const productsPerPage = 20;

  // Uwierzytelnianie – pobieramy token oraz rolę użytkownika
  const { token, userRole } = useAuth();

  // Dla operacji asynchronicznych
  const [isPending, startTransition] = useTransition();

  // Funkcja pobierająca produkty z serwera – korzystamy z zastosowanych filtrów
  const fetchProducts = useCallback(
    async (page: number) => {
      if (!token) return;
      setIsLoading(true);
      setError(null);

      startTransition(async () => {
        try {
          const data = await fetchProductsServer(
            page,
            productsPerPage,
            appliedSearchTerm,
            appliedCategoryFilter ? parseInt(appliedCategoryFilter) : undefined,
            appliedGenreFilter ? parseInt(appliedGenreFilter) : undefined
          );
          setProducts(data.content);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        } catch (err: any) {
          setIsLoading(false);
          setError(err.message || "Wystąpił błąd");
        }
      });
    },
    [token, appliedSearchTerm, appliedCategoryFilter, appliedGenreFilter]
  );

  // Pobieramy produkty i filtry przy zmianie strony lub po zastosowaniu nowych filtrów
  useEffect(() => {
    fetchProducts(currentPage);
    async function loadFilters() {
      try {
        const categoriesData = await fetchCategories();
        const genresData = await fetchGenres();
        // Jeśli genresData to tablica stringów, przekształcamy ją do obiektów
        if (genresData.length > 0 && typeof genresData[0] === "string") {
          const formattedGenres = genresData.map((genre: string, index: number) => ({
            genreId: index + 1,
            name: genre,
          }));
          setGenres(formattedGenres);
        } else {
          setGenres(genresData);
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error("Błąd ładowania filtrów:", error);
      }
    }
    loadFilters();
  }, [currentPage, fetchProducts]);

  // Obsługa usuwania produktu
  const confirmDeleteProduct = (product: Product) => {
    setDeleteConfirmation({ isOpen: true, product });
  };

  const deleteProduct = useCallback(
    async (productId: number) => {
      if (!token) return;
      try {
        startTransition(async () => {
          await deleteProductServer(productId);
          setProducts((prev) => prev.filter((p) => p.bookId !== productId));
          setDeleteConfirmation({ isOpen: false, product: null });
        });
      } catch (err: any) {
        setError(err.message || "Wystąpił błąd przy usuwaniu produktu");
      }
    },
    [token]
  );

  // Funkcja wywoływana przy kliknięciu przycisku "Filtruj"
  const handleFilter = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedCategoryFilter(categoryFilter);
    setAppliedGenreFilter(genreFilter);
    setCurrentPage(1);
  };

  // Stany dla filtrów (selecty)
  const [categories, setCategories] = useState<{ categoryId: number; namePl: string }[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  if (isLoading) {
    return <p>Ładowanie produktów...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    editDisclosure.onOpen();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Przekazujemy do NavbarProducts również userRole, aby tam ukryć przycisk dodawania produktu, jeśli użytkownik to employee */}
      <NavbarProducts
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        categories={categories}
        genres={genres}
        onOpen={onOpen}
        onFilter={handleFilter}
        userRole={userRole} // Dodajemy userRole
      />

      <main className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div key={product.bookId} className="border rounded-md bg-white shadow-sm p-4">
              <div className="grid grid-cols-8 gap-4 items-center text-base text-gray-800">
                <div className="flex justify-center">
                  <img
                    src={product.imageUrl || "default-image.png"}
                    alt={product.titlePl}
                    className="w-24 h-32 object-cover rounded"
                  />
                </div>

                <div className="text-center">
                  <strong>ID:</strong> {product.bookId}
                </div>

                <div className="text-center">
                  <strong>Nazwa:</strong> {product.titlePl}
                </div>

                <div className="text-center">
                  <strong>Kategoria:</strong> {product.category || "Brak danych"}
                </div>

                <div className="text-center">
                  <strong>Gatunek:</strong> {product.genres?.join(", ") || "Brak danych"}
                </div>

                <div className="text-center">
                  <strong>Cena:</strong> {product.price}
                </div>

                <div className="text-center">
                  <strong>Stan:</strong> {product.stockQuantity || "Brak danych"}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Przycisk podglądu szczegółów – widoczny dla wszystkich */}
                  <Button
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex justify-center items-center"
                    onPress={() => {
                      setSelectedProduct(product);
                      detailsDisclosure.onOpen();
                    }}
                  >
                    <FaInfoCircle size={20} />
                  </Button>

                  {/* Przycisk edycji – renderowany tylko, gdy rola to ROLE_ADMIN */}
                  {userRole === "ROLE_ADMIN" && (
                    <Button
                      className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex justify-center items-center"
                      onPress={() => openEditModal(product)}
                    >
                      <FaEdit size={20} />
                    </Button>
                  )}

                  {/* Przycisk usuwania – renderowany tylko, gdy rola to ROLE_ADMIN */}
                  {userRole === "ROLE_ADMIN" && (
                    <Button
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex justify-center items-center"
                      onPress={() => confirmDeleteProduct(product)}
                    >
                      <FaTrashAlt size={20} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-gray-500 mt-4">Brak produktów spełniających kryteria.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
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

      {/* Modal dodawania produktu */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size="5xl" scrollBehavior="outside">
        <ModalContent>
          <ModalBody>
            <AddProduct />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal szczegółów produktu */}
      <Modal isOpen={detailsDisclosure.isOpen} onOpenChange={detailsDisclosure.onOpenChange} size="5xl" scrollBehavior="outside">
        <ModalContent>
          <ModalHeader>{selectedProduct ? selectedProduct.titlePl : "Szczegóły produktu"}</ModalHeader>
          <ModalBody>
            {selectedProduct ? (
              <ProductDetails product={selectedProduct} />
            ) : (
              <p>Brak danych produktu.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal edycji produktu */}
      <Modal isOpen={editDisclosure.isOpen} onOpenChange={editDisclosure.onOpenChange} size="5xl" scrollBehavior="outside">
        <ModalContent>
          <ModalBody>
            {editingProduct && (
              <AddProduct
                initialData={editingProduct}
                onSubmit={async (data) => {
                  editDisclosure.onOpenChange(false);
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal potwierdzenia usunięcia */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={() => setDeleteConfirmation({ isOpen: false, product: null })}
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Potwierdzenie usunięcia</ModalHeader>
          <ModalBody>
            Czy na pewno chcesz usunąć produkt "{deleteConfirmation.product?.titlePl}"?
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onPress={() => deleteProduct(deleteConfirmation.product?.bookId)}
            >
              Tak
            </Button>
            <Button
              className="bg-gray-300 text-black hover:bg-gray-400"
              onPress={() => setDeleteConfirmation({ isOpen: false, product: null })}
            >
              Nie
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withAuth(Products, ["ROLE_ADMIN", "ROLE_EMPLOYEE"]);
