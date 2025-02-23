import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

import { Product } from "@/types/types";

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartItemCount:number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingProduct = updatedCart.find((p) => p.bookId === product.bookId);

      if (existingProduct) {

        existingProduct.quantity += 1;
      } else {

        updatedCart.push({ ...product, quantity: 1 });
      }


      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((product) => product.bookId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {

    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((product) =>
        product.bookId === productId ? { ...product, quantity } : product
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); 
  };

  const cartItemCount = cart.reduce((total, product) => total + product.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartItemCount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
