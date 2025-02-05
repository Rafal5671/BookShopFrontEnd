import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import DashboardPage from "@/components/admin/Dashboard";
import Orders from "@/components/admin/Orders";
import Products from "@/components/admin/Products";
import Authors from "@/components/admin/Authors";
import Categories from "@/components/admin/Categories";
import Publishers from "@/components/admin/Publishers";
import RefreshTokens from "@/components/admin/Tokens";
import Users from "@/components/admin/Users";
import { withAuth } from "@/components/server/auth/withAuth";

type SectionType =
  | "dashboard"
  | "orders"
  | "products"
  | "authors"
  | "publishers"
  | "users"
  | "categories"
  | "tokens";

function AdminPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("dashboard");

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
      case "tokens":
        return <RefreshTokens />;
      default:
        return <DashboardPage />;
    }
  }

  useEffect(() => {
    console.log("Sekcja została zmieniona na:", activeSection);
  }, [activeSection]);

  return (
    <div className="flex w-full">
      {/* Pasek boczny */}
      <div className="sticky top-0 h-screen border-r border-gray-200 bg-white shadow">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      {/* Główna zawartość */}
      <main className="flex-1 p-6">
        {renderSection()}
      </main>
    </div>
  );
}
export default withAuth(AdminPage, ['ROLE_ADMIN', 'ROLE_EMPLOYEE']);;