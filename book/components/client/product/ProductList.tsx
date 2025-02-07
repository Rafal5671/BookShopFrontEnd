'use client';  // Komponent klientowy

import { useState, useEffect } from "react";
import ProductCard from "@/components/client/product/ProductCard"; // Komponent karty produktu
import { useTranslation } from "@/hooks/useTranslation";
import { Product } from "@/types/types";
import { Spinner } from "@nextui-org/react";
type ProductListProps = {
  products: Product[];
};

export default function ProductList({ products }: ProductListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const {t} = useTranslation();
  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [products]);

  return (
    <div>
      {loading ? (
        <>
        <Spinner/>
        <p>Loading products...</p>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.bookId} product={product}/>
            ))
          ) : (
            <p>{t("noProductsAvailable")}</p>
          )}
        </div>
      )}
    </div>
  );
}
