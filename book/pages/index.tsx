import Head from "next/head";
import {fetchProducts } from "@/components/server/product/FetchProducts";
import ImageCarousel from "@/components/client/slider/Carousel";
import ProductList from "@/components/client/product/ProductList";
import { Product } from "@/types/types";
export async function getServerSideProps() {
  const products: Product[] = await fetchProducts();
  return {
    props: {
      products,
    },
  };
}
type IndexPageProps = {
  products: Product[];
};

export default function IndexPage({ products }: IndexPageProps) {
  return (
    <div>
      <Head>
        <title>Online Bookstore</title>
        <meta name="description" content="Welcome to our online bookstore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center">
        <ImageCarousel />
        <ProductList products={products} />
      </main>
    </div>
  );
}
