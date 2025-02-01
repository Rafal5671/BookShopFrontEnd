import Head from "next/head";
import { Product, fetchProducts } from "@/components/server/product/FetchProducts";
import ImageCarousel from "@/components/client/slider/Carousel";
import ProductList from "@/components/client/product/ProductList";
import MegaMenu from "@/components/CategoryNav";

export async function getServerSideProps() {
  const products: Product[] = await fetchProducts();
  return {
    props: {
      products,
    },
  };
}
// data/categories.ts

export interface SubMenuColumn {
  heading: string;
  items: string[];
}

export interface MegaSubMenu {
  columns: SubMenuColumn[];
}

export interface Category {
  name: string;
  recommended?: boolean; // "polecamy" etykieta
  subMenu?: MegaSubMenu; // jeśli istnieje, wyświetlamy wielokolumnowy panel
}

export const categories: Category[] = [
  {
    name: 'Książki',
    subMenu: {
      columns: [
        {
          heading: 'KSIĄŻKI ⇒',
          items: [
            'Biografie',
            'Biznes, ekonomia',
            'Fantastyka',
            'Science Fiction',
            'Kryminał, sensacja, thriller',
            'Kuchnia i diety',
            'Literatura faktu',
            'Literatura obyczajowa',
          ],
        },
      ],
    },
  },
  {
    name: 'Podręczniki ',
    subMenu: {
      columns: [
        {
          heading: 'PODRĘCZNIKI SZKOLNE ⇒',
          items: [
            'Liceum i technikum',
            'Szkoła podstawowa',
            'Lektury, pomoce szkolne',
          ],
        },
        {
          heading: 'POMOCE DO SZKOŁY ⇒',
          items: [
            'Repetytoria',
            'Repetytoria maturalne',
            'Repetytoria ósmoklasisty',
            'Oblicza Geografii',
            'To jest chemia',
            'W centrum uwagi',
          ],
        },
      ],
    },
  },
];

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
