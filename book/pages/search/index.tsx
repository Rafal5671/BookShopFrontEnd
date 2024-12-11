import { useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { FaSort } from "react-icons/fa";
import SidebarFilters from "@/components/SidebarFilters";

export default function Search() {
  const books = [
    {
      title: "Rozdroża kruków",
      author: "Andrzej Sapkowski",
      rating: 8.3,
      reviews: 2082,
      readers: 3584,
      opinions: 71,
      cycle: "Wiedźmin",
      price: "39,99 zł",
      image: "/rozdroza.jpg",
    },
    {
      title: "Krew Elfów",
      author: "Andrzej Sapkowski",
      rating: 8.4,
      reviews: 1910,
      readers: 3306,
      opinions: 66,
      cycle: "Wiedźmin",
      price: "42,99 zł",
      image: "/krew.jpg",
    },
    {
      title: "Ostatnie Życzenie",
      author: "Andrzej Sapkowski",
      rating: 8.4,
      reviews: 285,
      readers: 536,
      opinions: 16,
      cycle: "Wiedźmin. Opowiadania (tom 1)",
      price: "29,99 zł",
      image: "/ostatnie.jpg",
    },
    {
      title: "Wiedźmin: Szpony i kły",
      author: "Andrzej J. Sawicki, Przemysław Gul",
      rating: 6.8,
      reviews: 2972,
      readers: 4175,
      opinions: 92,
      cycle: "Wiedźmin Geralt z Rivii (tom 8)",
      price: "49,99 zł",
      image: "/szpony.jpg",
    },
  ];

  const [filteredBooks, setFilteredBooks] = useState(books);
  const [sortOrder, setSortOrder] = useState(null);

  const handleSort = (sortBy, order) => {
    let sortedBooks;
    if (sortBy === "title") {
      sortedBooks = [...filteredBooks].sort((a, b) =>
        order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    } else if (sortBy === "price") {
      sortedBooks = [...filteredBooks].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(" zł", "").replace(",", "."));
        const priceB = parseFloat(b.price.replace(" zł", "").replace(",", "."));
        return order === "asc" ? priceA - priceB : priceB - priceA;
      });
    }
    setFilteredBooks(sortedBooks);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Title for the page */}
      <div className="mb-6 flex justify-between">
  <h2 className="text-2xl font-bold text-left">Treści z frazą: "WIEDŹMIN"</h2>
  <Dropdown>
    <DropdownTrigger>
      <Button startContent={<FaSort size={20} />}>Sortuj</Button>
    </DropdownTrigger>
    <DropdownMenu
      aria-label="Sortowanie"
      onAction={(key) => {
        const [sortBy, order] = key.split("-");
        handleSort(sortBy, order);
      }}
    >
      <DropdownItem key="title-asc">Tytule A-Z</DropdownItem>
      <DropdownItem key="title-desc">Tytule Z-A</DropdownItem>
      <DropdownItem key="price-asc">Cenie rosnąco</DropdownItem>
      <DropdownItem key="price-desc">Cenie malejąco</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>


      {/* Flex container to arrange sidebar and products */}
      <div className="flex items-start">
        {/* Sidebar on the left */}
        <div className="w-1/4">
          <SidebarFilters />
        </div>

        {/* Main content area with product list */}
        <div className="w-3/4 pl-6">

          <div className="space-y-6 ">
            {filteredBooks.map((book, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row bg-primary-100 border rounded-lg shadow-lg p-6 w-full mb-6"
                style={{ height: "350px" }}
              >
                {/* Image Column */}
                <div className="sm:w-1/3 mb-4 sm:mb-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    style={{ height: "300px", width: "100%", objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>

                {/* Description Column */}
                <div className="sm:w-1/3 sm:ml-4 mb-4 sm:mb-0 overflow-y-auto">
                  <h4 className="text-xl font-semibold mb-2">{book.title}</h4>
                  <p className="text-sm mb-2">{book.author}</p>
                  <p className="mb-2">
                    Średnia ocen: <span className="font-bold">{book.rating} / 10</span>
                  </p>
                  <p className="mb-2">
                    Oceny: <span className="font-bold">{book.reviews}</span>
                  </p>
                  <p className="mb-2">
                    Opinie: <span className="font-bold">{book.opinions}</span>
                  </p>
                </div>

                {/* Price and Button Column */}
                <div className="sm:w-1/3 sm:ml-4 flex flex-col justify-end">
                  <p className="text-lg font-bold">{book.price}</p>
                  <Button color="default" size="sm" className="mt-2">
                    Dodaj do Koszyka
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
