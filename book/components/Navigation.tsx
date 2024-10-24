import React, { useState, useEffect } from 'react';
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
  Switch,
  
} from "@nextui-org/react";
import { FaShoppingCart, FaUser, FaSearch, FaBars,FaCog,FaGlobe } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import { ThemeSwitch } from './theme-switch';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const { t } = useTranslation(); // Added setLanguage to change language
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar
      maxWidth="xl"
      isBordered
      position="sticky"
      className="bg-primary-200 opacity-95"
    >
      {/* Large Screen Layout */}
      <NavbarBrand className="hidden lg:flex">
        <Link href="/">
          <img alt="Bookstore Logo" style={{ height: "40px" }} />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden lg:flex">
        <Input
          className="bg-primary-100" 
          radius="md"
          startContent={<FaSearch />}
          placeholder={t("searchPlaceholder")}
        />
      </NavbarContent>
      <NavbarContent className="hidden lg:flex items-center">
        <Badge content="5" color="primary" showOutline={false}>
          <Button isIconOnly>
            <FaShoppingCart />
          </Button>
        </Badge>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button isIconOnly>
                <FaUser />
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
          </DropdownMenu>
        </Dropdown>
        <ThemeSwitch />
        <LanguageSwitcher/>

        {/* Theme switch is left unchanged */}
      </NavbarContent>

      {/* Small Screen Layout */}
      <NavbarContent className="flex lg:hidden w-full justify-between items-center px-2">
        <Input
          radius="md"
          startContent={<FaSearch />}
          placeholder={t("searchPlaceholder")}
          className="flex-grow mr-2"
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
                href="/login"
                className="block py-2 px-4 text-gray-900 rounded bg-gray-50 hover:bg-gray-100 md:bg-transparent md:hover:bg-transparent md:hover:text-blue-700 md:text-gray-900 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                {t("login")}
              </a>
            </li>
            <li className="w-full mb-2">
              <a
                href="/register"
                className="block py-2 px-4 text-gray-900 rounded bg-gray-50 hover:bg-gray-100 md:bg-transparent md:hover:bg-transparent md:hover:text-blue-700 md:text-gray-900 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                {t("register")}
              </a>
            </li>
            <li className="w-full mt-2 flex justify-between">
              {/* Language Dropdown in Mobile Menu */}
              <Dropdown>
                <DropdownTrigger>
                  <Button>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="en">
                    English
                  </DropdownItem>
                  <DropdownItem key="pl">
                    Polski
                  </DropdownItem>
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
