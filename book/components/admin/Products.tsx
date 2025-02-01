import React, { useState, useEffect, useCallback, useTransition } from "react";
import {
  Pagination, Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalFooter
} from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import AddProduct from "./AddProducts";
import NavbarProducts from "./ProductsNavbar";
import ProductDetails from "./ProductDetails";
import { FaEdit, FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { deleteProductServer, fetchProductsServer } from "../server/admin/products/actions";

type Author = {
  authorId: number;
  firstName: string;
  lastName: string;
};

type Publisher = {
  publisherId: number;
  name: string;
};

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
  publisher: Publisher | Publisher[];
  authors: Author[];
  originalTitle: string;
  language: string;
  category?: string; // Filtry
  species?: string;
  genres?: string[];
  stock?: number;
};

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;  // numer aktualnej strony (0-based)
  size: number;
}

const Products = () => {
  // ----------------------------------------------
  // 1. Stan i zmienne
  // ----------------------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NextUI stuff
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  // Dodatkowe stany do obsługi modali
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Liczba produktów na stronę
  const productsPerPage = 20;

  // Autoryzacja
  const { token, loading: authLoading } = useAuth();

  // Dla operacji asynchronicznych z server actions:
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------
  // 2. Pobieranie listy produktów (Server Action)
  // ----------------------------------------------
  const fetchProducts = useCallback(
    async (page: number) => {
      if (!token) return;
      setIsLoading(true);
      setError(null);

      startTransition(async () => {
        try {
          const data = await fetchProductsServer(token, page, productsPerPage);
          setProducts(data.content);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        } catch (err: any) {
          setIsLoading(false);
          setError(err.message || "Wystąpił błąd");
        }
      });
    },
    [token]
  );

  // Ładuj produkty, kiedy zmienia się currentPage
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  // ----------------------------------------------
  // 3. Usuwanie produktu
  // ----------------------------------------------
  const confirmDeleteProduct = (product: Product) => {
    setDeleteConfirmation({ isOpen: true, product });
  };

  const deleteProduct = useCallback(
    async (productId: number) => {
      if (!token) return;
      try {
        startTransition(async () => {
          await deleteProductServer(token, productId);
          setProducts((prev) => prev.filter((p) => p.bookId !== productId));
          setDeleteConfirmation({ isOpen: false, product: null });
        });
      } catch (err: any) {
        setError(err.message || "Wystąpił błąd przy usuwaniu produktu");
      }
    },
    [token]
  );

  // ----------------------------------------------
  // 4. Filtrowanie na podstawie searchTerm, categoryFilter i speciesFilter
  // ----------------------------------------------
  const filteredProducts = products.filter((product) => {
    return (
      product.titlePl.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "" || product.category === categoryFilter) &&
      (speciesFilter === "" || product.species === speciesFilter)
    );
  });

  // ----------------------------------------------
  // 5. Render
  // ----------------------------------------------
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
      <NavbarProducts
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        speciesFilter={speciesFilter}
        setSpeciesFilter={setSpeciesFilter}
        onOpen={onOpen}
      />

      <main className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.bookId}
              className="border rounded-md bg-white shadow-sm p-4"
            >
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
                  <strong>Stan:</strong> {product.stock || "Brak danych"}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Szczegóły */}
                  <Button
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex justify-center items-center"
                    onPress={() => {
                      setSelectedProduct(product);
                      detailsDisclosure.onOpen();
                    }}
                  >
                    <FaInfoCircle size={20} />
                  </Button>

                  {/* Edytuj */}
                  <Button
                    className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex justify-center items-center"
                    onPress={() => openEditModal(product)}
                  >
                    <FaEdit size={20} />
                  </Button>

                  {/* Usuń */}
                  <Button
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex justify-center items-center"
                    onPress={() => confirmDeleteProduct(product)}
                  >
                    <FaTrashAlt size={20} />
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-gray-500 mt-4">Brak produktów spełniających kryteria.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        size="5xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          <ModalBody>
            <AddProduct />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={detailsDisclosure.isOpen}
        onOpenChange={detailsDisclosure.onOpenChange}
        size="5xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? selectedProduct.titlePl : "Szczegóły produktu"}
          </ModalHeader>
          <ModalBody>
            {selectedProduct ? (
              <ProductDetails product={selectedProduct} />
            ) : (
              <p>Brak danych produktu.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={editDisclosure.isOpen}
        onOpenChange={editDisclosure.onOpenChange}
        size="5xl"
        scrollBehavior="outside"
      >
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

export default Products;
