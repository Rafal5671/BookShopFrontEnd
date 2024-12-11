
export type Product = {
  bookId: number;
  titlePl: string;
  titleEn: string;
  pages_count: number;
  relese_year: number;
  price: number;
};

// Fetch data server-side
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch("http://localhost:8080/api/books", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const products: Product[] = await res.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getServerSideProps = async () => {
  const products = await fetchProducts();
  return {
    props: {
      products,
    },
  };
};