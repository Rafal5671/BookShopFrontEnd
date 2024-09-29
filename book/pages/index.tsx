import Head from "next/head";
import Navigation from "../components/Navigation";
import ImageCarousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
const products = [
  {
    name: "Mistrz i Małgorzata",
    image: "/images/mistrz-i-malgorzata.jpg",
    price: 50,
    discountedPrice: 35,
  },
  {
    name: "Zbrodnia i kara",
    image: "/images/zbrodnia-i-kara.jpg",
    price: 45,
    discountedPrice: 40,
  },
  {
    name: "Władca Pierścieni",
    image: "/images/wladca-pierscieni.jpg",
    price: 120,
  },
  {
    name: "Harry Potter i Kamień Filozoficzny",
    image: "/images/harry-potter.jpg",
    price: 60,
    discountedPrice: 50,
  },
  {
    name: "Gra o Tron",
    image: "/images/gra-o-tron.jpg",
    price: 70,
  },
  {
    name: "1984",
    image: "/images/1984.jpg",
    price: 30,
    discountedPrice: 25,
  },
  {
    name: "Hobbit",
    image: "/images/hobbit.jpg",
    price: 40,
  },
  {
    name: "Duma i Uprzedzenie",
    image: "/images/duma-i-uprzedzenie.jpg",
    price: 35,
  },
  {
    name: "Zew Cthulhu",
    image: "/images/zew-cthulhu.jpg",
    price: 55,
  },
  {
    name: "Wiedźmin: Ostatnie Życzenie",
    image: "/images/wiedzmin.jpg",
    price: 45,
  },
  {
    name: "Metro 2033",
    image: "/images/metro-2033.jpg",
    price: 50,
    discountedPrice: 42,
  },
  {
    name: "Bracia Karamazow",
    image: "/images/bracia-karamazow.jpg",
    price: 60,
  },
];
export default function IndexPage() {
  return (
    <div>
    <Head>
      <title>Online Bookstore</title>
      <meta name="description" content="Welcome to our online bookstore" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="min-h-screen flex flex-col items-center justify-center ">
      <ImageCarousel />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </main>
  </div>
  );
}
