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

import { useTranslation } from "../hooks/useTranslation";
import { useCart } from "@/hooks/CartContext";
import { ThemeSwitch } from "./theme-switch";
import LanguageSwitcher from "./LanguageSwitcher";

const Navigation = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Usuń token JWT
    //setIsLoggedIn(false);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const { cartItemCount } = useCart();
  // Determine the badge content based on cartItemCount
  let badgeContent = "";
  if (cartItemCount > 99) {
    badgeContent = "99+";
  } else if (cartItemCount > 0) {
    badgeContent = cartItemCount.toString();
  }
  const shouldShowBadge = cartItemCount > 0 && cartItemCount <= 99;
  return (
    <Navbar
      isBordered
      className="bg-primary-200 opacity-95"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarBrand className="hidden lg:flex">
      <Link href="/">
        <Image
          alt="Bookstore Logo"
          height={200}
          src="/logo3.png"
          width={200}
        />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden lg:flex">
        <Input
          color="default"
          placeholder={t("searchPlaceholder")}
          radius="md"
          startContent={<FaSearch />}
        />
      </NavbarContent>
      <NavbarContent className="hidden lg:flex items-center">
      <Link href="/cart">
          {/* Show badge if shouldShowBadge is true */}
          {shouldShowBadge ? (
            <Badge className="bg-primary-100 rounded-full" content={badgeContent} showOutline={false}>
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
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button isIconOnly>
                <FaUser size={20} />
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu>
            <DropdownItem key="login" href="/login">
              Login
            </DropdownItem>
            <DropdownItem key="register" href="/register">
              Register
            </DropdownItem>
            <DropdownItem key="logout" onClick={handleLogout}>
                  Logout
                </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <ThemeSwitch />
        <LanguageSwitcher />
      </NavbarContent>

      {/* Small Screen Layout */}
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

      {/* Mobile Dropdown Menu */}
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
              {/* Language Dropdown in Mobile Menu */}
              <Dropdown>
                <DropdownTrigger>
                  <Button />
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="en">English</DropdownItem>
                  <DropdownItem key="pl">Polski</DropdownItem>
                  {/* Add more languages as needed */}
                </DropdownMenu>
              </Dropdown>
              {/* Theme Switch */}
              <ThemeSwitch />
            </li>
          </ul>
        </div>
      )}
    </Navbar>
  );
};

export default Navigation;
