import React from 'react';

const CartOnlyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default CartOnlyLayout;
