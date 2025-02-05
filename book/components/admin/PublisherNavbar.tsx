import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

interface PublishersNavbarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void;           // Funkcja otwierająca modal dodawania wydawcy
  onSearch: () => void;         // Funkcja wywoływana po naciśnięciu Enter
}

const PublishersNavbar: React.FC<PublishersNavbarProps> = ({
  searchTerm,
  setSearchTerm,
  onOpen,
  onSearch,
}) => {
  return (
    <Navbar shouldHideOnScroll isBlurred={false}>
      <NavbarBrand>
        <h2 className="text-xl font-bold mb-4">Wydawcy</h2>
      </NavbarBrand>

      <NavbarContent className="flex flex-col md:flex-row gap-2 md:gap-4">
        <NavbarItem>
          <input
            type="text"
            placeholder="Wyszukaj wydawcę"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="border px-2 py-1 rounded w-full md:w-56"
          />
        </NavbarItem>

        <NavbarItem>
          <button
            onClick={onOpen}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Dodaj wydawcę
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default PublishersNavbar;
