import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

interface NavbarProductsProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  speciesFilter: string;
  setSpeciesFilter: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void; // Dodane do obsługi modala
}

const NavbarProducts: React.FC<NavbarProductsProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  speciesFilter,
  setSpeciesFilter,
  onOpen,
}) => {
  return (
    <Navbar shouldHideOnScroll isBlurred={false} >
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
            <option value="Kategoria 1">Kategoria 1</option>
            <option value="Kategoria 2">Kategoria 2</option>
          </select>
        </NavbarItem>

        <NavbarItem>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Wybierz gatunek</option>
            <option value="Gatunek A">Gatunek A</option>
            <option value="Gatunek B">Gatunek B</option>
            <option value="Gatunek C">Gatunek C</option>
          </select>
        </NavbarItem>

        <NavbarItem>
        <button
          onClick={onOpen}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dodaj produkt
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarProducts;
