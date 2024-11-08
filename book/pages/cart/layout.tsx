// app/cart/layout.tsx
import React from 'react';

const CartOnlyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Optionally, you could add a header specific to the cart */}
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Twój Koszyk</h1>
      </header>
      <main className="flex-grow">
        {children} {/* This is where the cart page content will be rendered */}
      </main>
    </div>
  );
};

export default CartOnlyLayout;
