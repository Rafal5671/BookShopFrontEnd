import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt, FaStar, FaRegStar } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Card } from "@nextui-org/react";

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
      <Card className="w-full mx-auto p-6 bg-primary-200 shadow-lg rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column with Image */}
          <div className="flex justify-center items-center">
            <Image
              alt={product.name}
              className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              height={400}
              src="/mistrz.jpg" // Dynamic image source
              width={300}
            />
          </div>

          {/* Right Column with Title, Description (Details like pages, author, etc.) and Rating */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Title */}
            <h1 className="text-3xl font-bold text-primary-800">
            The Master and Margarita
            </h1>

            {/* Book Details (e.g., publisher, page count, author) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary-100 p-4 rounded-lg shadow-lg">
                <p>
                  <strong>Publisher: </strong>
                  Świat Książki
                </p>
                <p>
                  <strong>Number of Pages:</strong> 454
                </p>
                <p>
                  <strong>Author:</strong> Mikhail Bulgakov
                </p>
                <p>
                  <strong>Original Title:</strong> Мастер и Маргарита
                </p>
                <p>
                  <strong>Release Date:</strong> 2024-11-13
                </p>
                <p>
                  <strong>First Polish Edition Date:</strong> 1969-01-01
                </p>
                <p>
                  <strong>First Edition Date:</strong> 2006-02-28
                </p>
                <p>
                  <strong>Language:</strong> Polish
                </p>

                {/* Price */}
                <div className="text-xl font-bold text-price-light dark:text-price-dark mt-4">
                  {product.discountedPrice ? (
                    <>
                      <span className="line-through">{product.price} PLN</span>{" "}
                      <span className="text-accent">
                        {product.discountedPrice} PLN
                      </span>
                    </>
                  ) : (
                    <span>{product.price} PLN</span>
                  )}
                </div>
                {/* Add to Cart Button */}
                <Button
                  className="mt-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors duration-300"
                  onClick={() => alert("Added to cart!")}
                >
                  <AiOutlineShoppingCart size={20} />
                  Add to Cart
                </Button>
              </div>
              <div className="bg-primary-100 p-4 rounded-lg shadow-lg flex flex-col items-center">
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold">Average Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500 text-4xl">
                    <FaStar />
                  </span>{" "}
                  {/* Increased size of the star */}
                  <span id="rating-value" className="text-red-500 text-5xl">
                    8.4
                  </span>{" "}
                  {/* Increased size of the rating */}
                  <span className="text-xl">/ 10</span>{" "}
                  {/* Slightly increased size of "/ 10" */}
                </div>

                <div className="text-center mt-2">
                  <span className="text-lg">3353 reviews | 52993 ratings</span>
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl font-semibold">Rate the book</span>
                </div>
                <div className="flex items-center mt-4">
                  <span className="star text-2xl" data-value="1">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="2">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="3">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="4">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="5">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="6">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="7">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="8">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="9">
                    <FaRegStar />
                  </span>
                  <span className="star text-2xl" data-value="10">
                    <FaRegStar />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 p-6 bg-primary-200 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Book Description</h2>
          <p>"Master and Margarita" is a fascinating and timeless depiction of the battle between good and evil. Woland, Behemoth, and Margarita are colorful characters with whom one can relate. The novel entertains, moves, surprises, and encourages philosophical reflection. Bulgakov masterfully intertwines the story of the love between the writer, known as the Master, and Margarita Nikolaevna with the grim and at times grotesque realities of 1930s Soviet Russia. The subplot involving Pontius Pilate sentencing the wandering philosopher Yeshua Ha-Notsri to death serves as a novel within a novel. The absurdist elements and Woland's fantastic actions were necessary to allow the book to pass through the censorship of Soviet Russia. This was the only way Bulgakov could reveal the absurdities of the country in which he was writing.</p>
        </div>
        {/* Customer Reviews Section */}
        <div className="mt-12 p-6 bg-primary-200 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
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
            <p>No reviews available.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

// Dynamic Routing Paths
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { id: "1" } }, { params: { id: "2" } }];
  return { paths, fallback: true };
};

// Fetch Product Data Based on ID
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;
  const product = {
    id: "1",
    name: "Master and Margarita",
    image: "/mnt/data/obraz.png", // Reference to the uploaded image
    price: 50.0,
    discountedPrice: 35.0,
    description: "Świat Książki, 454 pages, Mikhail Bulgakov", // Publisher, page count, and author
    detailedDescription:
      "Master and Margarita is one of the most important novels by Mikhail Bulgakov, full of magic, philosophy, and incredible adventures...",
    rating: 4.5,
    reviews: [
      {
        user: "John Kowalski",
        content:
          "An extraordinary book that combines fantastic elements with deep reflections on human nature. Highly recommended!",
      },
      {
        user: "Anna Nowak",
        content:
          "A book that draws you in from the first pages. Brilliantly written, full of mysteries that make it impossible to put down.",
      },
    ],
  };

  return {
    props: { product },
    revalidate: 60,
  };
};

export default ProductPage;
