import { FC, useState } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaBook,
  FaUser,
  FaBuilding,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

type SectionType = "dashboard" | "orders" | "products" | "editproducts" | "authors" | "publishers" | "users" | "categories";

interface SidebarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: FaHome, label: "Dashboard", section: "dashboard" },
    { icon: FaShoppingCart, label: "Zamówienia", section: "orders" },
    { icon: FaBook, label: "Produkty", section: "products" },
    { icon: FaUser, label: "Autorzy", section: "authors" },
    { icon: FaBuilding, label: "Wydawnictwo", section: "publishers" },
    { icon: FaUser, label: "Użytkownicy", section: "users" },
    { icon: FaUser, label: "Kategorie", section: "categories" },
  ];

  return (
    <div
      className={`
        ${isExpanded ? "w-64" : "w-20"}
        h-screen bg-gradient-to-b from-blue-600 to-blue-800
        p-5 pt-8 duration-300 relative
      `}
    >
      {/* Przycisk do zwijania/rozwijania sidebaru */}
      <button
        className="absolute -right-3 top-9 w-7 h-7 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <FaChevronLeft className="text-blue-600" />
        ) : (
          <FaChevronRight className="text-blue-600" />
        )}
      </button>

      {/* Logo / Nagłówek */}
      <div className="flex gap-x-4 items-center justify-center">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">KS</span>
        </div>
        <h1
          className={`
            text-white origin-left font-medium text-xl duration-300
            ${!isExpanded && "scale-0"}
          `}
        >
          Księgarnia
        </h1>
      </div>

      {/* Lista linków */}
      <ul className="pt-6">
        {menuItems.map((item) => (
          <li
            key={item.section}
            onClick={() => setActiveSection(item.section as SectionType)}
            className={`
              flex items-center gap-x-4 rounded-md p-2 mt-2 text-white text-sm cursor-pointer
              hover:bg-blue-500
              ${activeSection === item.section ? "bg-blue-500" : ""}
            `}
          >
            <item.icon className="text-xl" />
            <span
              className={`
                origin-left duration-200
                ${!isExpanded && "hidden"}
              `}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Przykładowy przycisk wylogowania na dole sidebaru */}
      <div className="absolute bottom-4 w-full left-0 px-5">
        <div
          className={`
            flex items-center gap-x-4 rounded-md p-2 text-white text-sm cursor-pointer
            hover:bg-blue-500
          `}
        >
          <FaSignOutAlt className="text-xl" />
          <span
            className={`
              origin-left duration-200
              ${!isExpanded && "hidden"}
            `}
          >
            Wyloguj
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
