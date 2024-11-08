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
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "dark": {
          colors: {
            background: "#393646",
            foreground: "#ffffff",
            primary: {
              100: "#4F4557",
              200: "#6D5D6E",
              DEFAULT: "#F4EEE0",
            },
            secondary:{
              DEFAULT:"#6D5D6E"
            },
            accent:"#F4EEE0",
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
            background: "#FFDBB5",
            primary: {
              100: "#FFEAC5",
              200: "#BF9365",
              DEFAULT: "#FFEAC5",
            },
          },
          secondary:{
            DEFAULT:"#603F26"
          },
          accent:"#603F26",
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
