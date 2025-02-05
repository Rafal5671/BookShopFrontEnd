import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  Badge,
  Image
} from "@nextui-org/react";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
} from "react-icons/fa";

import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/hooks/CartContext";
import { ThemeSwitch } from "@/components/util/theme-switch";
import LanguageSwitcher from "@/components/util/LanguageSwitcher";
import { useRouter } from "next/router";
import MegaMenu from "@/components/CategoryNav";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const { t } = useTranslation();
  const { cartItemCount } = useCart();
  const router = useRouter();
  const { token, logout } = useAuth();
  const isLoggedIn = !!token;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  let badgeContent = "";
  if (cartItemCount > 99) {
    badgeContent = "99+";
  } else if (cartItemCount > 0) {
    badgeContent = cartItemCount.toString();
  }
  const shouldShowBadge = cartItemCount > 0 && cartItemCount <= 99;

  const handleSearch = (query: string) => {
    if (query.trim() !== "") {
      router.push({
        pathname: "/search",
        query: { search: query },
      });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchQuery);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/logout");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleMegaMenu = () => setIsMegaMenuOpen((prev) => !prev);

  return (
    <>
      <Navbar
        isBordered
        className="bg-primary-200 opacity-95"
        maxWidth="xl"
        position="sticky"
      >
        {/* LOGO (widoczne tylko na dużych ekranach) */}
        <NavbarBrand className="hidden lg:flex">
          <Link href="/">
            <Image alt="Bookstore Logo" src="/logo3.png" width={200} height={70} />
          </Link>
        </NavbarBrand>

        {/* CENTRUM: SEARCH (widoczne tylko na dużych ekranach) */}
        <NavbarContent className="hidden lg:flex">
          <Input
            color="default"
            placeholder={t("searchPlaceholder")}
            radius="md"
            startContent={<FaSearch />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </NavbarContent>

        {/* PRAWA STRONA: IKONY, PRZYCISKI (widoczne tylko na dużych ekranach) */}
        <NavbarContent className="hidden lg:flex items-center space-x-2">
          {/* PRZYCISK OTWIERAJĄCY MEGA-MENU */}
          <Button variant="ghost" onPress={toggleMegaMenu}>
            {t("allCategories")}
          </Button>

          {/* KOSZYK */}
          <Link href="/cart">
            {shouldShowBadge ? (
              <Badge className="bg-primary-100 rounded-full" content={badgeContent}>
                <Button isIconOnly>
                  <FaShoppingCart size={20} />
                </Button>
              </Badge>
            ) : (
              <Button isIconOnly>
                <FaShoppingCart size={20} />
              </Button>
            )}
          </Link>

          {/* UŻYTKOWNIK (LOGIN/LOGOUT) */}
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button isIconOnly>
                  <FaUser size={20} />
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
              {isLoggedIn ? (
                <>
                  <DropdownItem key="profile" href="/profile">
                    {t("profile")}
                  </DropdownItem>
                  <DropdownItem key="logout" onPress={handleLogout}>
                    {t("signOut")}
                  </DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem key="login" href="/login">
                    {t("login")}
                  </DropdownItem>
                  <DropdownItem key="register" href="/register">
                    {t("register")}
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>

          {/* ZMIANA MOTYWU & JĘZYKA */}
          <ThemeSwitch />
          <LanguageSwitcher />
        </NavbarContent>

        {/* SMALL SCREEN (MOBILE) */}
        <NavbarContent className="flex lg:hidden w-full justify-between items-center px-2">
          <Input
            className="flex-grow mr-2"
            placeholder={t("searchPlaceholder")}
            radius="md"
            startContent={<FaSearch />}
          />
          <Button isIconOnly onPress={toggleMenu}>
            <FaBars />
          </Button>
        </NavbarContent>

        {/* MOBILE Dropdown Menu */}
        {isMenuOpen && (
          <div className="fixed top-16 left-0 w-full md:w-auto border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 p-4 shadow-md z-50">
            <ul className="flex flex-col font-medium px-4">
              <li className="w-full mb-2 flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t("cart")}</span>
                <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                  5
                </span>
              </li>
              <li className="w-full mb-2">
                <a
                  className="block py-2 px-4 text-gray-900 rounded bg-gray-50 hover:bg-gray-100 md:bg-transparent md:hover:bg-transparent md:hover:text-blue-700 md:text-gray-900 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  href="/login"
                >
                  {t("login")}
                </a>
              </li>
              <li className="w-full mb-2">
                <a
                  className="block py-2 px-4 text-gray-900 rounded bg-gray-50 hover:bg-gray-100 md:bg-transparent md:hover:bg-transparent md:hover:text-blue-700 md:text-gray-900 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  href="/register"
                >
                  {t("register")}
                </a>
              </li>
              <li className="w-full mt-2 flex justify-between">
                <Dropdown>
                  <DropdownTrigger>
                    <Button>Lang</Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="en">English</DropdownItem>
                    <DropdownItem key="pl">Polski</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <ThemeSwitch />
              </li>
            </ul>
          </div>
        )}
      </Navbar>

      {/* TUŻ POD NAVBAREM – MEGA MENU (pokazujemy tylko, gdy isMegaMenuOpen === true) */}
      {isMegaMenuOpen && (
        <div className="sticky top-16 z-50 bg-white shadow-md">
          <MegaMenu />
        </div>
      )}
    </>
  );
};

export default Navigation;
