import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/CartContext";
import { useTranslation } from "@/hooks/useTranslation";

import { Product } from "@/types/types";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { imageUrl, price, discountPrice, bookId } = product;
  const { locale } = useRouter();
  const router = useRouter();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return ""; // Return an empty string if text is null or undefined
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };


  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const navigateToProductPage = () => {
    router.push(`/product/${bookId}`);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-primary-100 flex flex-col relative">
      {discountPrice && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-lg font-bold px-3 py-2 rounded-md z-10">
          {t("promotion")}
        </div>
      )}
      <CardHeader
        className="flex justify-center items-center h-64 mt-4" // Increased height
        onClick={navigateToProductPage}
      >
        <Image
          className="w-[250px] h-[250px] object-contain transition-transform duration-300 hover:scale-110" // Increased dimensions
          src={imageUrl || "/default-image.png"}
          alt={product.title}
        />
      </CardHeader>

      <CardBody className="px-6 py-2 flex-grow flex flex-col">
        <button
          className="font-bold text-xl mb-2 text-center overflow-hidden"
          onClick={navigateToProductPage}
          aria-label="Navigate to product page"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncateText(product.title, 40)}
        </button>

        <div className="mt-auto">
          <div className="text-base text-center">
            {discountPrice ? (
              <>
                <span className="text-red-500 line-through text-lg mr-2">
                  {formatPrice(price)} PLN
                </span>
                <span className="text-green-500 font-bold text-xl">
                  {formatPrice(discountPrice)} PLN
                </span>
              </>
            ) : (
              <span className="text-price-light dark:text-price-dark font-bold text-xl">
                {formatPrice(price)} PLN
              </span>
            )}
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex justify-center pt-0 pb-4">
        <Button
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors duration-300"
          onPress={handleAddToCart}
        >
          <AiOutlineShoppingCart size={20} />
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
