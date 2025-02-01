import React from "react";
import Navigation from "../client/navbar/Navigation";
import Footer from "../client/navbar/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
