const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'primary-dark': '#0D001A', // Główne tło dla ciemnego motywu
        'primary-light': '#FFFFFF', // Główne tło dla jasnego motywu
        'secondary-dark': '#2C2C2C', // Subtelny ciemniejszy odcień dla ciemnego motywu
        'secondary-light': '#F8F8F8', // Subtelny jaśniejszy odcień dla jasnego motywu
        'darker-secondary-dark': '#1A1A1A', // Jeszcze ciemniejszy odcień
        'darker-secondary-light': '#E0E0E0', // Jeszcze jaśniejszy odcień
        'accent': '#F182F6', // Kolor akcentowy
        'price-dark': '#B8B8B8', // Cena w ciemnym motywie
        'price-light': '#3D3D3D', // Cena w jasnym motywie
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "dark": {
          colors: {
            background: "#0A1A26", // Bardzo ciemny fiolet zbliżony do czerni
            foreground: "#ffffff", // Biały tekst
            primary: {
              50: "#0D1114", // Ciemna szarość
              100: "#202E37", // Bardzo ciemna szarość
              200: "#1B2932", // Głęboka szarość
              300: "#495057", // Neutralna szarość
              400: "#6C757D", // Ciemniejsza stalowa szarość
              500: "#ADB5BD", // Jaśniejsza szarość
              600: "#999999", // Domyślny jasny szary
              700: "#414A4C", // Ciemny odcień
              800: "#090c0e", // Prawie czarny
              900: "#BFAFB2", // Neutralny odcień dla akcentów
              950: "#0B0018",
              DEFAULT: "#999999", // Domyślny neutralny szary
              foreground: "#ffffff", // Tekst biały na ciemnym tle
              test: "#070013",
            },
            secondary: {
              50: "#3B3B3B", // Neutralny odcień szarości
              DEFAULT: "#5A5A5A", // Jaśniejszy, neutralny szary
              foreground: "#ffffff", // Biały tekst
            },
            navbar: "#080010", // Bardzo ciemny fiolet
            focus: "#F182F6", // Wyrazisty fiolet dla akcentów
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
        "light": {
          colors: {
            background: "#ffffff", // Białe tło
            foreground: "#0D001A", // Bardzo ciemny fiolet, prawie czarny
            primary: {
              50: "#F5F5F5", // Bardzo jasna szarość, prawie biała
              100: "#E0E0E0", // Jasna szarość
              200: "#CCCCCC", // Neutralna szarość
              300: "#B8B8B8", // Stonowana szarość
              400: "#A3A3A3", // Chłodna szarość
              500: "#8F8F8F", // Ciemniejsza szarość
              600: "#7A7A7A", // Głęboka szarość
              700: "#666666", // Ciemniejsza szarość
              800: "#B8B8B8", // Stonowana szarość
              900: "#3D3D3D", // Ciemny odcień
              DEFAULT: "#CCCCCC", // Domyślny szary
              foreground: "#0D001A", // Bardzo ciemny fioletowy dla tekstu
            },
            secondary: {
              50: "#E3E3E3", // Bardzo jasna szarość
              DEFAULT: "#B8B8B8", // Neutralna szarość
              foreground: "#0D001A", // Tekst ciemny fioletowy
            },
            navbar: "#F0F0F0", // Bardzo jasna szarość dla nawigacji
            focus: "#A3A3A3", // Chłodna szarość dla podświetlenia
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};
