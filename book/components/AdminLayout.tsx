// app/admin/layout.tsx

import React, { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import Sidebar from "@/components/admin/Sidebar";
import DashboardPage from "./admin/Dashboard";
import Orders from "./admin/Orders";
import Products from "./admin/Products";
import Authors from "./admin/Authors";
import Publishers from "./admin/Publishers";
import Users from "./admin/Users";
import Categories from "./admin/Categories";
export const metadata = {
  title: "Panel administratora",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "orders" | "products" | "authors" | "publishers" | "users" | "categories"
  >("dashboard");
  
  // Funkcja przełączająca sekcje
  function renderSection() {
    switch (activeSection) {
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      case "authors":
        return <Authors />;
      case "categories":
        return <Categories />;
      case "publishers":
        return <Publishers />;
      case "users":
        return <Users />;
      default:
        return <DashboardPage />;
    }
  }

  useEffect(() => {
    console.log("Sekcja została zmieniona na:", activeSection);
  }, [activeSection]);

  return (
    <NextUIProvider>
      {/* Główny wrapper w układzie flex */}
      <div className="flex min-h-screen">
        
        {/* Sidebar (sticky) */}
        <div className="sticky top-0 h-screen border-r border-gray-200 bg-white shadow">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Główna sekcja panelu (scroll) */}
        <main className="flex-1 p-6">
          {renderSection()}
        </main>
      </div>
    </NextUIProvider>
  );
}
