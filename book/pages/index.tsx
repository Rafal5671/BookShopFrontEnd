import Head from "next/head";
import ProductList from "@/components/client/product/ProductList";
import { Product } from "@/types/types";
import { fetchProducts } from "@/components/server/product/FetchProducts";
import ImageCarousel from "@/components/client/slider/Carousel";
import { useTranslation } from "@/hooks/useTranslation";

export async function getServerSideProps() {
  try {

    const novelties = await fetchProducts();
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
  const {t} = useTranslation();
  return (
    <div>
      <Head>
        <title>Online Bookstore</title>
        <meta name="description" content="Welcome to our online bookstore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="min-h-screen container mx-auto py-8 px-4">
        <ImageCarousel />

        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">{t("newhome")}</h2>
          <ProductList products={novelties} />
        </section>


        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">{t("best")}</h2>
          <ProductList products={bestsellers} />
        </section>


        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">{t("recom")}</h2>
          <ProductList products={recommended} />
        </section>
      </main>
    </div>
  );
}
