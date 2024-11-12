import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { CartProvider } from "@/hooks/CartContext";
import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isCartPage = router.pathname === "/cart";

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <Layout>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </Layout>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
