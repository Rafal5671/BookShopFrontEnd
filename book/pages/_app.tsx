import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { CartProvider } from "@/hooks/CartContext";
import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import Layout from "../components/util/Layout";
import AdminLayout from "@/components/AdminLayout";
import { AuthProvider } from "@/context/AuthContext";
import GlobalSessionModal from "@/components/GlobalSessionModal";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  const LayoutToUse = isAdminRoute ? AdminLayout : Layout;

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <CartProvider>
          <AuthProvider>
            <LayoutToUse>
              <Component {...pageProps} />
              <GlobalSessionModal />
            </LayoutToUse>
          </AuthProvider>
        </CartProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
