import Head from "next/head";
import ImageCarousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
const products = [
  {
    id:1,
    name: "Mistrz i Małgorzata",
    image: "/images/mistrz-i-malgorzata.jpg",
    price: 50,
    discountedPrice: 35,
  },
  {
    id:2,
    name: "Zbrodnia i kara",
    image: "/images/zbrodnia-i-kara.jpg",
    price: 45,
    discountedPrice: 40,
  },
  {
    id:3,
    name: "Władca Pierścieni",
    image: "/images/wladca-pierscieni.jpg",
    price: 120,
  },
  {
    id:4,
    name: "Harry Potter i Kamień Filozoficzny",
    image: "/images/harry-potter.jpg",
    price: 60,
    discountedPrice: 50,
  },
  {
    id:5,
    name: "Gra o Tron",
    image: "/images/gra-o-tron.jpg",
    price: 70,
  },
  {
    id:6,
    name: "1984",
    image: "/images/1984.jpg",
    price: 30,
    discountedPrice: 25,
  },
  {
    id:7,
    name: "Hobbit",
    image: "/images/hobbit.jpg",
    price: 40,
  },
  {
    id:8,
    name: "Duma i Uprzedzenie",
    image: "/images/duma-i-uprzedzenie.jpg",
    price: 35,
  },
  {
    id:9,
    name: "Zew Cthulhu",
    image: "/images/zew-cthulhu.jpg",
    price: 55,
  },
  {
    id:10,
    name: "Wiedźmin: Ostatnie Życzenie",
    image: "/images/wiedzmin.jpg",
    price: 45,
  },
  {
    id:11,
    name: "Metro 2033",
    image: "/images/metro-2033.jpg",
    price: 50,
    discountedPrice: 42,
  },
  {
    id:12,
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
