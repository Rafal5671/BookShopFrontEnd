import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

interface Genre {
  genreId: number;
  name: string;
}

interface NavbarProductsProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  genreFilter: string;
  setGenreFilter: React.Dispatch<React.SetStateAction<string>>;
  categories: { categoryId: number; namePl: string }[];
  genres: Genre[];
  onOpen: () => void;
  onFilter: () => void;
  userRole: string | null;
}

const NavbarProducts: React.FC<NavbarProductsProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  genreFilter,
  setGenreFilter,
  categories,
  genres,
  onOpen,
  onFilter,
  userRole,
}) => {
  return (
    <Navbar shouldHideOnScroll isBlurred={false}>
      <NavbarBrand>
        <h2 className="text-xl font-bold mb-4">Produkty</h2>
      </NavbarBrand>

      <NavbarContent className="flex flex-col md:flex-row gap-2 md:gap-4">
        <NavbarItem>
          <input
            type="text"
            placeholder="Wyszukaj produkt"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-56"
          />
        </NavbarItem>

        <NavbarItem>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Wybierz kategorię</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.namePl}
              </option>
            ))}
          </select>
        </NavbarItem>

        <NavbarItem>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Wybierz gatunek</option>
            {genres.map((genre) => (
              <option key={genre.genreId} value={genre.genreId}>
                {genre.name}
              </option>
            ))}
          </select>
        </NavbarItem>

        <NavbarItem>
          <button onClick={onFilter} className="bg-blue-500 text-white px-4 py-2 rounded">
            Filtruj
          </button>
        </NavbarItem>

        {/* Przycisk "Dodaj produkt" widoczny tylko dla administratora */}
        {userRole === "ROLE_ADMIN" && (
          <NavbarItem>
            <button onClick={onOpen} className="bg-blue-500 text-white px-4 py-2 rounded">
              Dodaj produkt
            </button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarProducts;
