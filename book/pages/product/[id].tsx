import { GetServerSideProps } from 'next';
import ProductClient from '@/components/client/product/ProductClient';
import { fetchProductById } from '@/components/client/product/actions'; 
import { Product } from '@/types/types';

type ProductPageProps = {
  product: Product;
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  return <ProductClient product={product} />;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Context params:", context.params);

  try {
    const { id } = context.params!;
    const lang = context.locale || "pl"; 
    const product = await fetchProductById(id as string, lang);

    if (!product) {
      return { notFound: true };
    }

    return {
      props: { product, lang },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};

export default ProductPage;
