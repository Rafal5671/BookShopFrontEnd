import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

interface NavbarAuthorsProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void; // Funkcja otwierająca modal dodawania autora
}

const NavbarAuthors: React.FC<NavbarAuthorsProps> = ({
  searchTerm,
  setSearchTerm,
  onOpen,
}) => {
  return (
    <Navbar shouldHideOnScroll isBlurred={false}>
      <NavbarBrand>
        <h2 className="text-xl font-bold mb-4">Autorzy</h2>
      </NavbarBrand>

      <NavbarContent className="flex flex-col md:flex-row gap-2 md:gap-4">
        <NavbarItem>
          <input
            type="text"
            placeholder="Wyszukaj autora"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-56"
          />
        </NavbarItem>

        <NavbarItem>
          <button
            onClick={onOpen}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Dodaj autora
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarAuthors;
