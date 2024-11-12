import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from 'next/router';
import { useCart } from "@/hooks/CartContext";

type Product = {
  id: number;
  name: string;
  image?: string;
  price: number;
  discountedPrice?: number;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, image, price, discountedPrice, id } = product;
  const router = useRouter();
  const { addToCart } = useCart(); // Use the cart context to add items to the cart

  const imageUrl = image || "https://via.placeholder.com/300x200.png?text=Brak+zdjęcia";

  const navigateToProductPage = () => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 }); // Add product to cart with quantity 1
  };

  return (
    <Card className="max-w-sm shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-primary-100">
      <CardHeader className="flex justify-center items-center h-48 mt-4" onClick={navigateToProductPage}>
        <Image
          className="w-full h-full object-contain"
          src={imageUrl}
          alt={name}
        />
      </CardHeader>

      <CardBody className="px-6 py-2">
        <div className="font-bold text-xl mb-2 text-center" onClick={navigateToProductPage}>{name}</div>
        <p className="text-base text-center">
          <span
            className={`${
              discountedPrice
                ? "line-through text-gray-500"
                : "text-price-light dark:text-price-dark"
            }`}
          >
            {price} PLN
          </span>
          {discountedPrice && (
            <span className="ml-2 text-red-500 font-bold">
              {discountedPrice} PLN
            </span>
          )}
        </p>
      </CardBody>

      <CardFooter className="flex justify-center pt-0 pb-4">
        <Button
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors duration-300"
          onClick={handleAddToCart}
        >
          <AiOutlineShoppingCart size={20} />
          Dodaj do koszyka
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
