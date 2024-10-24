import React from "react";
import Navigation from "./Navigation"; // Import komponentu Navigation
import Footer from "./Footer"; // Import komponentu Footer

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Nawigacja dostępna na wszystkich stronach */}
      <Navigation />
      {/* Dynamiczna zawartość strony */}
      <main className="flex-grow">{children}</main>
      {/* Stopka dostępna na wszystkich stronach */}
      <Footer />
    </div>
  );
};

export default Layout;
