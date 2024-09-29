// pages/product/[id].tsx

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { FaStarHalfAlt, FaStar } from 'react-icons/fa';
import { AiOutlineShoppingCart } from "react-icons/ai";

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

  // Ustawienie domyślnej wartości dla reviews, jeśli nie jest zdefiniowana
  const { reviews = [] } = product;

  // Funkcja renderująca gwiazdki na podstawie oceny
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-accent text-4xl" />); // Powiększone gwiazdki
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="text-accent text-4xl" />); // Powiększone pół-gwiazdki
      } else {
        stars.push(<AiOutlineStar key={i} className="text-accent text-4xl" />); // Powiększone puste gwiazdki
      }
    }
    return stars;
  };

  return (
    <div className="py-12 px-4 md:px-12 bg-primary-dark text-primary-light dark:bg-primary-light dark:text-primary-dark">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Obrazek książki */}
        <div className="flex justify-center items-center">
          <Image
            src={product.image || 'https://via.placeholder.com/300x400.png?text=Brak+zdjęcia'}
            alt={product.name}
            width={300}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
        
        {/* Informacje o książce */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-secondary-light dark:text-secondary-dark">
              {product.rating} na 5
            </span>
          </div>
          <p className="text-secondary-light dark:text-secondary-dark">
            {product.description || 'Brak opisu dla tej książki.'}
          </p>
          <div className="text-xl font-bold text-price-light dark:text-price-dark">
            {product.discountedPrice ? (
              <>
                <span className="line-through text-secondary-light dark:text-secondary-dark">{product.price} PLN</span>{' '}
                <span className="text-accent">{product.discountedPrice} PLN</span>
              </>
            ) : (
              <span>{product.price} PLN</span>
            )}
          </div>
          <Button className="mt-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors duration-300"
          onClick={() => alert('Dodano do koszyka!')}>
            <AiOutlineShoppingCart size={20} />
            Dodaj do koszyka
          </Button>
        </div>
      </div>

      {/* Sekcja ze szczegółowym opisem */}
      <div className="mt-12 p-6 bg-darker-secondary-dark dark:bg-darker-secondary-light rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Szczegółowy Opis
        </h2>
        <p className="text-primary-light dark:text-primary-dark">
          {product.detailedDescription || 'Brak szczegółowego opisu.'}
        </p>
      </div>

      {/* Sekcja recenzji klientów */}
      <div className="mt-12 p-6 bg-primary-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Recenzje klientów
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-secondary-light dark:border-secondary-dark pb-4 mb-4 text-primary-light dark:text-primary-dark">
                <h3 className="font-semibold text-lg">
                  {review.user}
                </h3>
                <p>{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-primary-light dark:text-primary-dark">Brak recenzji.</p>
        )}
      </div>
    </div>
  );
};

// Pobieranie ścieżek dla dynamicznego routingu
export const getStaticPaths: GetStaticPaths = async () => {
  // Przykładowe dane ścieżek produktów, zamień na swoje dane
  const paths = [{ params: { id: '1' } }, { params: { id: '2' } }];

  return { paths, fallback: true };
};

// Pobieranie danych produktu na podstawie ID
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;

  // Przykładowe dane produktu, zamień na rzeczywiste zapytanie do API lub bazy danych
  const product = {
    id,
    name: 'Przykładowa Książka',
    image: 'https://via.placeholder.com/300x400.png?text=Książka',
    price: 49.99,
    discountedPrice: 39.99,
    description: 'To jest przykładowy opis książki.',
    detailedDescription: 'To jest bardziej szczegółowy opis książki, w którym można dodać więcej informacji, takich jak historia powstawania, opinie krytyków literackich, czy ogólne wrażenia z lektury.',
    rating: 4.5,
    reviews: [
      { user: 'Jan Kowalski', content: 'Świetna książka, bardzo polecam!' },
      { user: 'Anna Nowak', content: 'Bardzo ciekawa, wciągnęła mnie od pierwszych stron.' },
    ],
  };

  return {
    props: { product },
    revalidate: 60, // Rewalidacja danych co 60 sekund
  };
};

export default ProductPage;
