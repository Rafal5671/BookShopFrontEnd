import Head from "next/head";
import ProductList from "@/components/client/product/ProductList";
import { Product } from "@/types/types";
import { fetchProducts } from "@/components/server/product/FetchProducts";
import ImageCarousel from "@/components/client/slider/Carousel";

// Funkcja pomocnicza do pobierania książek według typu

export async function getServerSideProps() {
  try {
    // Pobieramy 12 książek dla każdej sekcji
    const novelties = await fetchProducts();
    console.log(novelties);
    const bestsellers = await fetchProducts();
    const recommended = await fetchProducts();

    return {
      props: {
        novelties,
        bestsellers,
        recommended,
      },
    };
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    return {
      props: {
        novelties: [],
        bestsellers: [],
        recommended: [],
      },
    };
  }
}

type IndexPageProps = {
  novelties: Product[];
  bestsellers: Product[];
  recommended: Product[];
};

export default function IndexPage({ novelties, bestsellers, recommended }: IndexPageProps) {
  return (
    <div>
      <Head>
        <title>Online Bookstore</title>
        <meta name="description" content="Welcome to our online bookstore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Dodano klasę px-4 dla poziomego paddingu */}
      <main className="min-h-screen container mx-auto py-8 px-4">
        <ImageCarousel />
        {/* Sekcja nowości */}
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">Nowości</h2>
          <ProductList products={novelties} />
        </section>

        {/* Sekcja bestsellerów */}
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">Bestsellery</h2>
          <ProductList products={bestsellers} />
        </section>

        {/* Sekcja polecanych */}
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">Polecane</h2>
          <ProductList products={recommended} />
        </section>
      </main>
    </div>
  );
}
