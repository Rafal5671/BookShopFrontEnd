import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/CartContext";

type Product = {
  bookId: number;
  titlePl: string;
  titleEn: string;
  image?: string;
  pages_count: number;
  relese_year: number;
  price: number;
  discountedPrice?: number;
    staticImage?: string;
};
type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
}: ProductCardProps) => {
  const { image, price, discountedPrice, bookId } = product;
  const { locale } = useRouter();
  const title = locale === "en" ? product.titleEn : product.titlePl;
  const router = useRouter();
  const { addToCart } = useCart(); // Use the cart context to add items to the cart

  const imageUrl = "/mistrz.jpg";

  const navigateToProductPage = () => {
    router.push(`/product/${bookId}`);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 }); // Add product to cart with quantity 1
  };

  return (
    <Card className="w-[300px] shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-primary-100">
      <CardHeader
        className="flex justify-center items-center h-48 mt-4"
        onClick={navigateToProductPage}
      >
        {product.staticImage ? (
     <Image
     className="w-[200px] h-[200px] object-contain"
     src={product.staticImage}
     alt={title}
   />
      ) : (
        <Image
          className="w-[200px] h-[200px] object-contain"
          src={imageUrl}
          alt={title}
        />
      )}
      </CardHeader>

      <CardBody className="px-6 py-2">
        <button
          className="font-bold text-xl mb-2 text-center"
          onClick={navigateToProductPage}
          aria-label="Navigate to product page"
        >
          {title}
        </button>

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
