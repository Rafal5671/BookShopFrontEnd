import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import SidebarFilters from "@/components/client/search/SidebarFilters";
import { Filters, PaginatedResponse, Product, Author, Genre, Category, Review } from "@/types/types";
import { Button, Link, Pagination } from "@nextui-org/react";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/hooks/CartContext";

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { search: searchQuery, genreId: queryGenreId } = router.query;

  // Stany na dane filtrujące i książki
  const [books, setBooks] = useState<Product[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [filters, setFilters] = useState<Filters>({
    selectedGenres: [],
    selectedCategories: [],
    selectedAuthors: [],
    freeShipping: false,
    priceRange: [0, 5000],
  });
  const { addToCart } = useCart();
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
  
  // Pobieranie danych filtrujących (aggregated data)
  useEffect(() => {
    const fetchAggregatedData = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery as string);
        if (filters.selectedGenres.length > 0) params.append("genreId", filters.selectedGenres.join(","));
        if (filters.selectedCategories.length > 0) params.append("categoryId", filters.selectedCategories.join(","));
        if (filters.selectedAuthors.length > 0) params.append("authorId", filters.selectedAuthors.join(","));
        if (filters.freeShipping) params.append("onSale", "true");
        if (filters.priceRange[0] > 0) params.append("priceMin", filters.priceRange[0].toString());
        if (filters.priceRange[1] < maxPrice) params.append("priceMax", filters.priceRange[1].toString());
        const lang = router.locale || "pl";
        params.append("lang", lang);

        const response = await fetch(`http://localhost:8080/api/books/aggregated?${params.toString()}`);
        if (!response.ok) throw new Error("Błąd pobierania danych filtrujących");
        const data = await response.json();
        setAvailableGenres(data.genres);
        setAvailableCategories(data.categories);
        setAvailableAuthors(data.authors);
        setMaxPrice(Number(data.maxAvailablePrice));
      } catch (error) {
        console.error("Błąd pobierania danych filtrujących", error);
      }
    };

    fetchAggregatedData();
  }, [
    searchQuery,
    router.locale,
  ]);
  useEffect(() => {
    if (queryGenreId) {
      let genres: number[] = [];
      
      if (Array.isArray(queryGenreId)) {
        // Jeśli queryGenreId jest tablicą stringów, konwertujemy każdy element na liczbę
        genres = queryGenreId.map((id) => Number(id));
      } else if (typeof queryGenreId === "string") {
        // Jeśli queryGenreId jest pojedynczym stringiem, dzielimy go na tablicę i konwertujemy elementy na liczby
        genres = queryGenreId.split(",").map((id) => Number(id));
      }
      
      setFilters((prevFilters) => ({
        ...prevFilters,
        selectedGenres: genres,
      }));
    }
  }, [queryGenreId]);
  
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery as string);
        if (filters.selectedGenres.length > 0) params.append("genreId", filters.selectedGenres.join(","));
        if (filters.selectedCategories.length > 0) params.append("categoryId", filters.selectedCategories.join(","));
        if (filters.selectedAuthors.length > 0) params.append("authorId", filters.selectedAuthors.join(","));
        if (filters.freeShipping) params.append("onSale", "true");
        if (filters.priceRange[0] > 0) params.append("priceMin", filters.priceRange[0].toString());
        if (filters.priceRange[1] < maxPrice) params.append("priceMax", filters.priceRange[1].toString());

        // Użycie numeru strony oraz limitu
        params.append("page", currentPage.toString());
        params.append("limit", "10");
        const lang = router.locale || "pl";
        params.append("lang", lang);

        const response = await fetch(`http://localhost:8080/api/books?${params.toString()}`);
        if (!response.ok) throw new Error("Błąd pobierania książek");
        const data: PaginatedResponse = await response.json();
        setBooks(data.books);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    fetchBooks();
  }, [searchQuery, filters, maxPrice, router.locale, currentPage]);
  const getAuthors = (authors: Author[]): string => {
    return authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ");
  };
  const { t } = useTranslation();
  // Funkcja wyświetlająca nazwy wydawców – przykładowo, gdy publisher może być tablicą lub pojedynczym obiektem
  const displayPublisherNames = (book: Product): string => {
    if (Array.isArray(book.publisher)) {
      return book.publisher.length > 0
        ? book.publisher.map((p) => p.name).join(", ")
        : t("noPublisher");
    }
    if (book.publisher && book.publisher.name) {
      return book.publisher.name;
    }
    return t("noPublisher");
  };

  // Funkcja obliczająca średnią ocenę na podstawie recenzji
  const getAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  // Inna logika pobierania książek oraz obsługi filtrów…

  const handleApplyFilters = useCallback((appliedFilters: Filters) => {
    setFilters(appliedFilters);
    // Możesz zaktualizować URL lub wykonać dodatkowe akcje
  }, []);
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-start">
        <SidebarFilters
          genres={availableGenres}
          categories={availableCategories}
          authors={availableAuthors}
          currentFilters={filters}
          onApplyFilters={handleApplyFilters}
          maxPrice={maxPrice}
        />
        <div className="w-3/4 pl-6">
          {books.map((book) => (
            <div key={book.bookId}>
              <div
                className="flex flex-col sm:flex-row bg-primary-100 border rounded-lg shadow-lg p-6 w-full mb-6"
                style={{ height: "350px" }}
              >
                {/* Okładka książki */}
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
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Akcje książki */}
                <div className="sm:w-1/3 sm:ml-4 flex flex-col justify-end">
                  {/* Blok średniej oceny */}
                  <div className="bg-primary-100 p-4 rounded-lg flex flex-col items-center mb-4">
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
                      <span className="text-xl">/ 5</span>
                    </div>
                  </div>

                  {/* Cena książki */}
                  <p className="text-lg font-bold">
                    {book.discountPrice ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          {book.price} PLN
                        </span>
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
            </div>
          ))}
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
  );
};

export default SearchPage;
