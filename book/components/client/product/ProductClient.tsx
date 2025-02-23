"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { AiOutlineStar, AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import ReviewForm from "@/components/client/product/ReviewForm";
import { deleteUserReview, fetchAllReviews, fetchUserReview, updateUserReview } from "./actions";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/hooks/CartContext";
import { Product, Review, Author } from "@/types/types";

interface ProductClientProps {
  product: Product;
}

const languageMap: { [key: string]: string } = {
  POLISH: "Polski",
  ENGLISH: "Angielski",
  FRENCH: "Francuski",
  SPANISH: "Hiszpański",
  JAPANESE: "Japoński",
};

const getLanguageName = (languageCode: string): string => {
  return languageMap[languageCode] || "Unknown Language";
};

const displayPublisherNames = (product: Product): string => {
  if (Array.isArray(product.publisher)) {
    return product.publisher.length > 0
      ? product.publisher.map((p) => p.name).join(", ")
      : "Brak wydawcy";
  }
  if (product.publisher && product.publisher.name) {
    return product.publisher.name;
  }
  return "Brak wydawcy";
};

const ProductClient: React.FC<ProductClientProps> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { t } = useTranslation();
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };


  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className=" text-2xl" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className=" text-2xl" />);
      } else {
        stars.push(<AiOutlineStar key={i} className=" text-2xl" />);
      }
    }
    return stars;
  };


  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);


  const refreshUserReview = useCallback(async () => {
    if (!token) return;
    try {
      const fetchedReview = await fetchUserReview(product.bookId.toString());
      if (!fetchedReview) {
        console.warn("Nie znaleziono recenzji użytkownika lub token wygasł.");
        return;
      }
      console.log(fetchedReview);
      setUserReview(fetchedReview);
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  }, [product.bookId, token]);


  const fetchReviewsList = useCallback(async () => {
    try {
      const fetchedReviews = await fetchAllReviews(product.bookId.toString());
      console.log(fetchedReviews);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [product.bookId]);


  useEffect(() => {
    refreshUserReview();
    fetchReviewsList();
  }, [refreshUserReview, fetchReviewsList]);


  const handleDeleteReview = async () => {
    if (!userReview || !token) return;
    try {
      setUserReview(null);
      fetchReviewsList();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

 
  const handleAddOrUpdateReview = () => {
    fetchReviewsList();
    refreshUserReview();
  };
  const { addToCart } = useCart();

  const handleAddToCart = () => {

    addToCart({
      ...product, quantity: 1
    });
  };

  const getAuthors = (authors: Author[]) => {
    return authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ");
  };

  return (
    <div className="mt-5 mb-5 px-4 md:px-12">
      <Breadcrumbs variant="solid" className="mb-4" classNames={{ list: "bg-primary-200" }}>
        <BreadcrumbItem color="primary"><Link href="/">{t("Home")}</Link></BreadcrumbItem>
        <BreadcrumbItem color="primary"><Link href={`/search?categoryId=${product.category.id}`}> {product.category.name}</Link></BreadcrumbItem>
        <BreadcrumbItem>
          <span>
            {product.genres && product.genres.length > 0 ? (
              product.genres.map((genre, index) => {
                return (
                  <>
                    <Link href={`/search?genreId=${genre.genreId}`}>
                      {genre.name}
                    </Link>
                    {index < product.genres.length - 1 && ", "}
                  </>
                );
              })
            ) : (
              "Gatunki"
            )}
          </span>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent={true}>{product.title}</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="w-full mx-auto p-6 bg-primary-200 shadow-lg rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center items-center">
            <img
              alt={product.title}
              className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              height={400}
              src={product.imageUrl || "/default-image.png"}
              width={300}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-primary-800">
              {product.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary-100 p-4 rounded-lg shadow-lg">
                <p>
                  <strong>{t("description")}:</strong>
                </p>
                <p>
                  <strong>{t("authors")}:</strong> {getAuthors(product.authors)}
                </p>
                <p>
                  <strong>{t("publisher")}:</strong> {displayPublisherNames(product)}
                </p>
                <p>
                  <strong>{t("originalTitle")}:</strong>{" "}
                  {product.originalTitle || "Brak tytułu oryginału"}
                </p>
                <p>
                  <strong>{t("releaseDate")}:</strong>{" "}
                  {formatDate(product.releaseDate)}
                </p>
                <p>
                  <strong>{t("language")}:</strong> {getLanguageName(product.language)}
                </p>
                <p>
                  <strong>{t("pages")}:</strong> {product.pagesCount}
                </p>
              </div>

              <div className="bg-primary-100 p-4 rounded-lg shadow-lg flex flex-col items-center">
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold">{t("averageRating")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500 text-4xl">
                    <FaStar />
                  </span>
                  <span id="rating-value" className="text-2xl">
                    {product.averageRating}
                  </span>
                  <span className="text-xl">/ 10</span>
                </div>
                <p className="mt-4">
                  {product.discountPrice ? (
                    <>
                      <span className="line-through">{product.price} PLN</span>{" "}
                      <span className="text-accent">
                        {product.discountPrice} PLN
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl">{product.price} PLN</span>
                  )}
                </p>

                <Button
                  className="mt-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors duration-300"
                  onPress={handleAddToCart}
                >
                  <AiOutlineShoppingCart size={20} />
                  {t("addToCart")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-primary-200 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{t("detailedDescription")}</h2>
          <p>{product.description}</p>
        </div>

        {/* Formularz recenzji */}
        <div className="mt-6">
          <ReviewForm
            bookId={product.bookId}
            review={userReview}
            onAddReview={handleAddOrUpdateReview}
            deleteReview={handleDeleteReview}
          />
        </div>

        {/* Lista wszystkich recenzji */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">{t("reviews")}</h2>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <Card key={r.reviewId} className="mb-4 bg-primary-100">
                <CardHeader className="flex flex-col items-start pb-2">
                  {/* Imię użytkownika + gwiazdki w jednej linii */}
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg mr-2">{r.name}</h3>
                    <div className="flex items-center">{renderStars(r.rating)}</div>
                  </div>
                </CardHeader>
                <CardBody>
                  {/* Treść recenzji pod spodem */}
                  <p>{r.content}</p>
                </CardBody>
              </Card>
            ))
          ) : (
            <p>{t("no_reviews")}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductClient;
