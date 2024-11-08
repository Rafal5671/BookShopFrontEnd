import React, { useState } from "react";
import { Button, Image, Input } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function Cart() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product 1", price: 10.0, quantity: 1, imageUrl: "https://via.placeholder.com/100" },
    { id: 2, name: "Product 2", price: 20.0, quantity: 2, imageUrl: "https://via.placeholder.com/100" },
    { id: 3, name: "Product 3", price: 30.0, quantity: 1, imageUrl: "https://via.placeholder.com/100" },
  ]);
  const totalPrice = products
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);

  const increaseQuantity = (id: number) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.min(product.quantity + 1, 99) } // Ensure max is 99
          : product
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setProducts(
      products.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleQuantityChange = (id: number, value: string) => {
    // Allow empty input
    if (value === '' || /^[0-9]*$/.test(value)) {
      const quantity = value === '' ? 1 : Math.min(parseInt(value, 10), 99); // Allow empty, set to 1, cap at 99
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, quantity } // Keep quantity as number
            : product
        )
      );
    }
  };

  const handleBlur = (id: number, value: string) => {
    // If the input is empty, set the quantity to 1
    if (value === '') {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, quantity: 1 } // Ensure quantity is a number
            : product
        )
      );
    } else {
      const quantity = Math.min(parseInt(value, 10), 99); // Ensure it does not exceed 99
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, quantity } // Ensure quantity is a number
            : product
        )
      );
    }
  };

  return (
    <div className="my-10 flex justify-center w-full">
      <div className="shadow-lg rounded-lg p-6 flex w-4/5 bg-primary-100">
        <div className="flex-1 pr-4">
          <h2 className="text-2xl font-bold mb-4">Twoje produkty</h2>
          {products.length === 0 ? (
            <p>Twój koszyk jest pusty</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex mb-4 p-4 border-b border-gray-200 items-center">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover" />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 flex flex-col ml-4">
                  {/* Product Name */}
                  <span className="text-lg font-bold">{product.name}</span>
                
                  {/* Price and Quantity Controls */}
                  <div className="flex items-center mt-2 justify-between">
                    <span className="text-lg">{(product.price * product.quantity).toFixed(2)} zł</span>
                    {/* Quantity Controls */}
                    <div className="flex items-center">
                      {product.quantity > 1 ? (
                        <>
                          <Button onClick={() => decreaseQuantity(product.id)} className="mr-2" size="sm">-</Button>
                        </>
                      ) : (
                        <Button onClick={() => removeProduct(product.id)} className="mr-2" size="sm">
                          <span role="img" aria-label="trash"><FaTrash/></span> {/* Trash icon */}
                        </Button>
                      )}
                      <Input
                        type="text"
                        size="sm"
                        value={String(product.quantity)}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        onBlur={() => handleBlur(product.id, String(product.quantity))}
                        className="w-16 text-center border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          // Prevent non-numeric input
                          if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                            e.preventDefault();
                          }
                        }}
                      />
                      <Button onClick={() => increaseQuantity(product.id)} className="ml-2" size="sm">+</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col justify-between ml-4 pl-4">
          <span className="text-lg font-semibold">Łączna cena:</span>
          <span className="text-2xl font-bold mb-4">{totalPrice} zł</span>
          <Button className="mt-4 bg-green-500">Wybierz sposób dostawy</Button>
        </div>
      </div>
    </div>
  );
}
