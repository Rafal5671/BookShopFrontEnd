import { FC, useState, useContext } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaBook,
  FaUser,
  FaBuilding,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaTags,
  FaKey,
} from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext"; // Upewnij się, że ścieżka jest poprawna

// Definicja typów dla sekcji i elementów menu
export type SectionType =
  | "dashboard"
  | "orders"
  | "products"
  | "authors"
  | "publishers"
  | "users"
  | "categories"
  | "tokens";

interface MenuItem {
  key: SectionType;
  label: string;
  roles: string[];
  icon: React.ElementType;
}

interface SidebarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const authContext = useContext(AuthContext);
  const userRole = authContext?.userRole;

  // Lista elementów menu z przypisanymi rolami oraz ikonami
  const menuItems: MenuItem[] = [
    { key: "dashboard", label: "Dashboard", roles: ["ROLE_ADMIN", "ROLE_EMPLOYEE"], icon: FaHome },
    { key: "orders", label: "Zamówienia", roles: ["ROLE_ADMIN", "ROLE_EMPLOYEE"], icon: FaShoppingCart },
    { key: "products", label: "Produkty", roles: ["ROLE_ADMIN", "ROLE_EMPLOYEE"], icon: FaBook },
    { key: "authors", label: "Autorzy", roles: ["ROLE_ADMIN"], icon: FaUser },
    { key: "categories", label: "Kategorie", roles: ["ROLE_ADMIN"], icon: FaTags },
    { key: "publishers", label: "Wydawcy", roles: ["ROLE_ADMIN"], icon: FaBuilding },
    { key: "users", label: "Użytkownicy", roles: ["ROLE_ADMIN"], icon: FaUsers },
    { key: "tokens", label: "Tokeny", roles: ["ROLE_ADMIN"], icon: FaKey },
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
        {menuItems.map((item) => {
          // Jeśli użytkownik nie jest zalogowany lub nie ma odpowiedniej roli, nie renderujemy pozycji menu
          if (!userRole || !item.roles.includes(userRole)) {
            return null;
          }
          const Icon = item.icon;
          return (
            <li
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`
                flex items-center gap-x-4 rounded-md p-2 mt-2 text-white text-sm cursor-pointer
                hover:bg-blue-500
                ${activeSection === item.key ? "bg-blue-500" : ""}
              `}
            >
              <Icon className="text-xl" />
              <span
                className={`
                  origin-left duration-200
                  ${!isExpanded && "hidden"}
                `}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Przycisk wylogowania */}
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
