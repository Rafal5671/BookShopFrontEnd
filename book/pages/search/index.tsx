import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination
} from "@nextui-org/react";
import { FaSort, FaStar } from "react-icons/fa";
import SidebarFilters from "@/components/client/search/SidebarFilters";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/hooks/CartContext";


import { Filters, PaginatedResponse, Product, Review, Author, Genre, Category } from "@/types/types";

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { search: searchQuery } = router.query;
  const { t } = useTranslation();
  const [books, setBooks] = useState<Product[]>([]);
  const [currentSort, setCurrentSort] = useState<string>("titlePl-asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);

  const genresLoaded = useRef(false);
  const categoriesLoaded = useRef(false);
  const authorsLoaded = useRef(false);
  const maxPriceLoaded = useRef(false);

  const [maxPrice, setMaxPrice] = useState<number>(5000);
  // Główny stan filtrów, który jest aktualizowany po kliknięciu "Zastosuj"
  const [filters, setFilters] = useState<Filters>({
    selectedGenres: [],
    selectedCategories: [],
    selectedAuthors: [],
    freeShipping: false,
    priceRange: [0, 5000],
  });
  const prevLocale = useRef(router.locale);
  useEffect(() => {
    if (!router.isReady) return;

    setFilters((prevFilters) => {
      const newFilters = {
        selectedGenres: router.query.genreId ? String(router.query.genreId).split(",").map(Number) : prevFilters.selectedGenres,
        selectedCategories: router.query.categoryId ? String(router.query.categoryId).split(",").map(Number) : prevFilters.selectedCategories,
        selectedAuthors: router.query.authorId ? String(router.query.authorId).split(",").map(Number) : prevFilters.selectedAuthors,
        priceRange: [
          router.query.priceMin ? Number(router.query.priceMin) : prevFilters.priceRange[0],
          router.query.priceMax ? Number(router.query.priceMax) : prevFilters.priceRange[1],
        ] as [number, number],
        freeShipping: router.query.onSale === "true" ? true : prevFilters.freeShipping,
      };

      // ✅ Sprawdzamy, czy stan rzeczywiście się zmienił, zanim go nadpiszemy
      if (JSON.stringify(newFilters) !== JSON.stringify(prevFilters)) {
        return newFilters;
      }

      return prevFilters;
    });
  }, [router.query, router.isReady]);

  // Inicjalizacja filtrów na podstawie parametrów URL
  useEffect(() => {
    const initializeFilters = () => {
      const newFilters: Filters = { ...filters };

      if (router.query.genreId) {
        const genreIds = Array.isArray(router.query.genreId)
          ? router.query.genreId
          : [router.query.genreId];
        newFilters.selectedGenres = genreIds.flatMap((id) => id.split(",").map(Number));
      }

      if (router.query.categoryId) {
        const categoryIds = Array.isArray(router.query.categoryId)
          ? router.query.categoryId
          : [router.query.categoryId];
        newFilters.selectedCategories = categoryIds.flatMap((id) => id.split(",").map(Number));
      }

      if (router.query.authorId) {
        const authorIds = Array.isArray(router.query.authorId)
          ? router.query.authorId
          : [router.query.authorId];
        newFilters.selectedAuthors = authorIds.flatMap((id) => id.split(",").map(Number));
      }

      if (router.query.onSale === "true") {
        newFilters.freeShipping = true;
      }

      if (router.query.priceMin) {
        newFilters.priceRange[0] = Number(router.query.priceMin);
      }

      if (router.query.priceMax) {
        newFilters.priceRange[1] = Number(router.query.priceMax);
      }

      setFilters(newFilters);
    };

    initializeFilters();
  }, [router.query]);

  // Funkcja do zastosowania filtrów
  // Funkcja do zastosowania filtrów
  const handleApplyFilters = useCallback((appliedFilters: Filters) => {
    setFilters(appliedFilters);
    setCurrentPage(1);

    // Aktualizacja URL z nowymi filtrami oraz zachowanie parametru 'search' i 'lang'
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("search", searchQuery as string);
    }

    if (appliedFilters.selectedGenres.length > 0) {
      params.append("genreId", appliedFilters.selectedGenres.join(","));
    }

    if (appliedFilters.selectedCategories.length > 0) {
      params.append("categoryId", appliedFilters.selectedCategories.join(","));
    }

    if (appliedFilters.selectedAuthors.length > 0) { // Upewniamy się, że selectedAuthors istnieje
      params.append("authorId", appliedFilters.selectedAuthors.join(","));
    }

    if (appliedFilters.freeShipping) {
      params.append("onSale", "true");
    }

    if (appliedFilters.priceRange[0] > 0) {
      params.append("priceMin", appliedFilters.priceRange[0].toString());
    }

    if (appliedFilters.priceRange[1] < maxPrice) {
      params.append("priceMax", appliedFilters.priceRange[1].toString());
    }

    // Sortowanie
    const [sortBy, order] = currentSort.split("-");
    params.append("sortBy", sortBy);
    params.append("order", order);

    // Paginacja
    params.append("page", "1"); // Resetowanie strony przy zastosowaniu filtrów
    params.append("limit", itemsPerPage.toString());

    // Dodanie aktualnego języka do parametrów
    const lang = router.locale || "pl";
    params.append("lang", lang);

    // Aktualizacja URL bez przeładowania strony
    router.push(
      {
        pathname: "/search",
        query: Object.fromEntries(params.entries()),
      },
      undefined,
      { shallow: true }
    );
  }, [searchQuery, currentSort, itemsPerPage, router, maxPrice]);


  useEffect(() => {
    if (!router.isReady) return;

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery as string);
        if (filters.selectedGenres.length > 0) params.append("genreId", filters.selectedGenres.join(","));
        if (filters.selectedAuthors.length > 0) params.append("authorId", filters.selectedAuthors.join(","));
        if (filters.selectedCategories.length > 0) params.append("categoryId", filters.selectedCategories.join(","));
        if (filters.freeShipping) params.append("onSale", "true");

        if (filters.priceRange[0] > 0) params.append("priceMin", filters.priceRange[0].toString());
        if (filters.priceRange[1] < maxPrice) params.append("priceMax", filters.priceRange[1].toString());
        params.append("page", currentPage.toString());
        params.append("limit", itemsPerPage.toString());

        // Dodanie języka do parametrów API na podstawie router.locale
        const lang = router.locale || "pl";
        params.append("lang", lang);

        const response = await fetch(`http://localhost:8080/api/books?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch books");

        const data: PaginatedResponse = await response.json();

        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);

        if (!genresLoaded.current) {
          setAvailableGenres(data.availableGenres);
          genresLoaded.current = true;
        }

        if (!categoriesLoaded.current) {
          setAvailableCategories(data.availableCategories);
          categoriesLoaded.current = true;
        }

        if (!authorsLoaded.current) {
          setAvailableAuthors(data.availableAuthors);
          authorsLoaded.current = true;
        }

        if (!maxPriceLoaded.current && data.maxAvailablePrice) {
          console.log("Nowe maxPrice:", data.maxAvailablePrice);
          setMaxPrice(data.maxAvailablePrice);
          setFilters((prev) => ({
            ...prev,
            priceRange: [0, data.maxAvailablePrice],
          }));
          maxPriceLoaded.current = true;
        }
      } catch (err: any) {
        setError(err.message);
        setBooks([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [
    filters.selectedGenres,
    filters.selectedCategories,
    filters.selectedAuthors,
    filters.freeShipping,
    currentSort,
    currentPage,
    searchQuery,
    router.isReady,
    router.locale // Dodanie locale do zależności
  ]);
  // Sortowanie książek
  const handleSort = useCallback((sortBy: keyof Product, order: "asc" | "desc") => {
    setCurrentSort(`${sortBy}-${order}`);
    setCurrentPage(1);

    // Aktualizacja URL z nowym sortowaniem oraz zachowanie innych parametrów
    const params = new URLSearchParams(router.query as any);
    params.set("sortBy", sortBy);
    params.set("order", order);
    params.set("page", "1"); // Resetowanie strony przy sortowaniu

    router.push(
      {
        pathname: "/search",
        query: Object.fromEntries(params.entries()),
      },
      undefined,
      { shallow: true }
    );
  }, [router]);

  // Obsługa zmiany strony
  const handlePageChange = useCallback((pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);

    // Aktualizacja URL z nową stroną oraz zachowanie innych parametrów
    const params = new URLSearchParams(router.query as any);
    params.set("page", pageNumber.toString());

    router.push(
      {
        pathname: "/search",
        query: Object.fromEntries(params.entries()),
      },
      undefined,
      { shallow: true }
    );
  }, [totalPages, router]);

  // Pobieranie autorów jako string
  const getAuthors = (authors: Author[]): string => {
    return authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ");
  };
  const { addToCart } = useCart();
  const displayPublisherNames = (product: Product): string => {
    if (Array.isArray(product.publisher)) {
      return product.publisher.length > 0
        ? product.publisher.map((p) => p.name).join(", ")
        : "Brak wydawcy";
    }
    if (product.publisher && product.publisher.name) {
      return product.publisher.name;
    }
    return "Brak wydawcy";
  };
  // Funkcja do obsługi dodawania do koszyka (placeholder)
  const handleAddToCart = (book: Product) => {
    // Implementacja logiki dodawania do koszyka
    addToCart({
      ...book, quantity: 1,
      titlePl: "",
      titleEn: "",
      pages_count: 0,
      relese_year: 0
    });
  };
  // Funkcja do obliczania średniej ocen
  const getAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Nagłówek */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold text-left mb-4 sm:mb-0">
          {searchQuery ? `${t("searchResultsFor")}: "${searchQuery}"` : t("allBooks")}
        </h2>

        {/* Dropdown sortowania */}
        <Dropdown>
          <DropdownTrigger>
            <Button startContent={<FaSort size={20} />}>
              {t("sortBy")}: {currentSort.replace("-", " ")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label={t("sorting")}
            onAction={(key) => {
              const [sortBy, order] = String(key).split("-") as [keyof Product, "asc" | "desc"];
              handleSort(sortBy, order);
            }}
          >
            <DropdownItem key="titlePl-asc">{t("titleAsc")}</DropdownItem>
            <DropdownItem key="titlePl-desc">{t("titleDesc")}</DropdownItem>
            <DropdownItem key="price-asc">{t("priceAsc")}</DropdownItem>
            <DropdownItem key="price-desc">{t("priceDesc")}</DropdownItem>
          </DropdownMenu>
        </Dropdown>

      </div>

      {/* Obsługa błędów */}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Wyświetlanie książek */}
      {!error && !loading && (
        <div className="flex items-start">
          {/* Sidebar Filtry */}
          <SidebarFilters
            genres={availableGenres}
            categories={availableCategories}
            authors={availableAuthors} // Przekazujemy autorów do SidebarFilters
            currentFilters={filters} // Przekazujemy aktualne filtry
            onApplyFilters={handleApplyFilters}
            maxPrice={maxPrice}
          />

          {/* Lista książek */}
          <div className="w-3/4 pl-6">
            <div className="space-y-6">
              {books.map((book) => (
                <div
                  key={book.bookId}
                  className="flex flex-col sm:flex-row bg-primary-100 border rounded-lg shadow-lg p-6 w-full mb-6"
                  style={{ height: "350px" }}
                >
                  {/* Obrazek książki */}
                  <div className="sm:w-1/3 mb-4 sm:mb-0">
                    <Link href={`/product/${book.bookId}`}>
                      <img
                        src={book.imageUrl || "/placeholder.jpg"}
                        alt={book.title}
                        style={{ height: "300px", width: "100%", objectFit: "contain" }}
                        className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  </div>

                  {/* Szczegóły książki */}
                  <div className="sm:w-1/3 sm:ml-4 mb-4 sm:mb-0 overflow-y-auto">
                    <Link href={`/product/${book.bookId}`}>
                      <h4 className="text-xl font-semibold mb-2 cursor-pointer hover:underline">
                        {book.title}
                      </h4>
                    </Link>
                    <p className="text-sm mb-2">{getAuthors(book.authors)}</p>

                    {/* Dodatkowe informacje */}
                    <p className="text-sm mb-2">
                      <strong>{t("publisher")}:</strong> {displayPublisherNames(book)}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>{t("numberOfPages")}:</strong> {book.pagesCount}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>{t("language")}:</strong> {book.language}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>{t("coverType")}:</strong> {book.coverType}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>{t("releaseDate")}:</strong>{" "}
                      {new Date(book.releaseDate).toLocaleDateString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </p>
                  </div>

                  {/* Akcje książki */}
                  <div className="sm:w-1/3 sm:ml-4 flex flex-col justify-end">
                    {/* Blok średniej oceny */}
                    <div className="bg-primary-100 p-4 rounded-lg  flex flex-col items-center mb-4">
                      <div className="text-center mt-4">
                        <span className="text-lg font-semibold">{t("averageRating")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-red-500 text-4xl">
                          <FaStar />
                        </span>
                        <span id="rating-value" className="text-2xl">
                          {getAverageRating(book.reviews)}
                        </span>
                        <span className="text-xl">/ 10</span>
                      </div>
                    </div>

                    {/* Cena książki */}
                    <p className="text-lg font-bold">
                      {book.discountPrice ? (
                        <>
                          <span className="line-through text-gray-500 mr-2">{book.price} PLN</span>
                          <span className="text-red-500">{book.discountPrice} PLN</span>
                        </>
                      ) : (
                        `${book.price} PLN`
                      )}
                    </p>
                    {/* Przycisk dodawania do koszyka */}
                    <Button
                      color="default"
                      size="sm"
                      className="mt-2"
                      onPress={() => handleAddToCart(book)}
                    >
                      {t("addToCart")}
                    </Button>
                  </div>
                </div>
              ))}


              {/* Paginacja */}
              <div className="flex justify-center mt-6">
                <Pagination
                  total={totalPages}
                  initialPage={1}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ładowanie */}
      {loading && <p className="text-gray-600 text-center">{t("loading")}...</p>}
    </div>
  );
};

export default SearchPage;
