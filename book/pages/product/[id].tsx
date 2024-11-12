import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { AiOutlineStar } from 'react-icons/ai';
import { FaStarHalfAlt, FaStar } from 'react-icons/fa';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Card } from '@nextui-org/react';

type Product = {
  id: string;
  name: string;
  image?: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  detailedDescription?: string;
  rating: number;
  reviews: { user: string; content: string }[];
};

type ProductPageProps = {
  product: Product;
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center text-foreground">Loading...</div>;
  }

  const { reviews = [] } = product;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-accent text-2xl" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="text-accent text-2xl" />);
      } else {
        stars.push(<AiOutlineStar key={i} className="text-accent text-2xl" />);
      }
    }
    return stars;
  };

  return (
    <div className="mt-5 mb-5 px-4 md:px-12">
      <Card className="w-full mx-auto p-6 bg-primary-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column with Book Image */}
          <div className="flex justify-center items-center">
            <Image
              src={'https://via.placeholder.com/500x600.png?text=Brak+zdjęcia'}
              alt={product.name}
              width={400}
              height={500}
              className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Column with Book Details */}
          <div className="flex flex-col gap-4 justify-center">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-secondary-light dark:text-secondary-dark">{product.rating} na 5</span>
            </div>
            {/* Display Description as Bullet Points */}
            <ul className="text-secondary-light dark:text-secondary-dark">
              {product.description?.split(',').map((item, index) => (
                <li key={index} className="mb-2">• {item.trim()}</li>
              ))}
            </ul>
            <div className="text-xl font-bold text-price-light dark:text-price-dark">
              {product.discountedPrice ? (
                <>
                  <span className="line-through">{product.price} PLN</span>{' '}
                  <span className="text-accent">{product.discountedPrice} PLN</span>
                </>
              ) : (
                <span>{product.price} PLN</span>
              )}
            </div>
            <Button
              className="mt-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors duration-300"
              onClick={() => alert('Dodano do koszyka!')}
            >
              <AiOutlineShoppingCart size={20} />
              Dodaj do koszyka
            </Button>
          </div>
        </div>

        {/* Detailed Description Section */}
        <div className="mt-12 p-6 bg-primary-200 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Szczegółowy Opis</h2>
          <p>
            {product.detailedDescription || 'Brak szczegółowego opisu.'}
          </p>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 p-6 bg-primary-200 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Recenzje klientów</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-lg">{review.user}</h3>
                  <p>{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Brak recenzji.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

// Dynamic Routing Paths
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { id: '1' } }, { params: { id: '2' } }];
  return { paths, fallback: true };
};

// Fetch Product Data Based on ID
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;
  const product = {
    id: 1,  // Unique identifier for the product
    name: 'Mistrz i Małgorzata',  // Title of the book
    image: 'https://via.placeholder.com/300x400.png?text=Książka',  // Placeholder image for the book cover
    price: 50.00,  // Original price of the book
    discountedPrice: 35.00,  // Price after discount
    description: 'Liczba stron: 448, Wydawnictwo: Muza, Oprawa: Twarda, Data wydania: 1967',  // Basic details about the book
    detailedDescription: 'Mistrz i Małgorzata to jedna z najważniejszych powieści Michaiła Bułhakowa, która łączy elementy realizmu, magii i filozoficznych rozważań na temat władzy, wolności, miłości oraz religii. Historia rozgrywa się w Moskwie lat 30. XX wieku, gdzie tajemniczy Woland, przedstawiciel sił nadprzyrodzonych, wraz ze swoją świtą, wywołuje chaos. Główne postacie to Mistrz, pisarz, który stworzył książkę o Piłacie, oraz jego ukochana Małgorzata, która za pomocą nadprzyrodzonych mocy stara się uratować Mistrza. Powieść jest pełna symboliki i niezwykłych wydarzeń, które zmuszają do głębokich refleksji nad naturą ludzką i światem.' ,  // More detailed description of the book
    rating: 4.5,  // Average rating from readers
    reviews: [
      { user: 'Jan Kowalski', content: 'Niezwykła książka, która łączy elementy fantastyczne z głębokimi refleksjami na temat ludzkiej natury. Polecam!' },  // Review by Jan Kowalski
      { user: 'Anna Nowak', content: 'Książka, która wciąga od pierwszych stron. Świetnie napisana i pełna tajemnic, które sprawiają, że nie można się od niej oderwać.' },  // Review by Anna Nowak
    ],
  };

  return {
    props: { product },
    revalidate: 60,
  };
};

export default ProductPage;
