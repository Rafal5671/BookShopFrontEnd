"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import ImageCarousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import { Product,fetchProducts } from "@/components/server/FetchProducts";
import { useState, useEffect } from "react";


type IndexPageProps = {
  initialProducts: Product[];
};

export default function IndexPage({ initialProducts = [] }: IndexPageProps) {
  const { locale } = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  return (
    <div>
      <Head>
        <title>Online Bookstore</title>
        <meta name="description" content="Welcome to our online bookstore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center">
        <ImageCarousel />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.bookId} product={product} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
