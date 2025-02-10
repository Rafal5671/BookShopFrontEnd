import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ProductClient from '@/components/client/product/ProductClient';
import { fetchProductById } from '@/components/client/product/actions'; 
import { Product } from '@/types/types';

type ProductPageProps = {
  product: Product;
};

const ProductPage: React.FC<ProductPageProps> = ({ product: initialProduct }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    if (!router.isReady || !router.query.id) return;

    const fetchData = async () => {
      const lang = router.locale || 'pl';
      const { id } = router.query;
      const updatedProduct = await fetchProductById(id as string, lang);
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
    };

    fetchData();
  }, [router.locale, router.query.id]);

  return <ProductClient product={product} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params!;
    const lang = context.locale || "pl"; 
    const product = await fetchProductById(id as string, lang);
    if (!product) {
      return { notFound: true };
    }

    return {
      props: { product },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};

export default ProductPage;
