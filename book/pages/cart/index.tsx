import React, { useEffect } from "react";
import { Button, Image, Input } from "@nextui-org/react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "@/hooks/CartContext";
import { useRouter } from "next/router";
import { useTranslation } from "@/hooks/useTranslation";

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const { t } = useTranslation();
  const handleGoToDelivery = () => {
    router.push("/delivery"); // Przekierowanie do strony dostawy
  };
  // Obliczanie łącznej ceny
  const totalPrice = cart
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);

  // Obsługuje zwiększanie ilości
  const increaseQuantity = (id: number) => {
    const product = cart.find((product) => product.bookId === id);
    if (product) {
      updateQuantity(id, Math.min(product.quantity + 1, 99));
    }
  };

  // Obsługuje zmniejszanie ilości
  const decreaseQuantity = (id: number) => {
    const product = cart.find((product) => product.bookId === id);
    if (product && product.quantity > 1) {
      updateQuantity(id, product.quantity - 1);
    }
  };

  // Funkcja do obsługi zmiany ilości w inpucie
  const handleQuantityChange = (id: number, value: string) => {
    // Pozwól na puste pole
    if (value === "" || /^[0-9]*$/.test(value)) {
      const quantity = value === "" ? 1 : Math.min(parseInt(value, 10), 99);
      updateQuantity(id, quantity);
    }
  };

  // Funkcja do obsługi utraty focusa
  const handleBlur = (id: number, value: string) => {
    if (value === "") {
      updateQuantity(id, 1);
    } else {
      const quantity = Math.min(parseInt(value, 10), 99);
      updateQuantity(id, quantity);
    }
  };

  // Sprawdź produkty w koszyku i wyświetl je w konsoli przy renderowaniu
  useEffect(() => {
    console.log("Produkty w koszyku:");
    cart.forEach((product) => {
      console.log(`Produkt: ${product.titlePl}, Ilość: ${product.quantity}`);
      console.log(product);
    });
  }, [cart]); // useEffect wywołuje się, gdy koszyk się zmienia

  return (
    <div className="my-10 flex justify-center w-full">
      <div className="shadow-lg rounded-lg p-6 flex w-4/5 bg-primary-100">
        <div className="flex-1 pr-4">
          <h2 className="text-2xl font-bold mb-4">{t("yourProducts")}</h2>
          {cart.length === 0 ? (
            <p>{t("emptyCart")}</p>
          ) : (
            cart.map((product) => (
              <div
                key={product.bookId}
                className="flex mb-4 p-4 border-b border-gray-200 items-center"
              >
                {/* Wyświetlanie obrazu produktu */}
                <div className="flex-shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.titlePl}
                    className="w-24 h-24 object-containt"
                  />

                </div>

                {/* Szczegóły produktu */}
                <div className="flex-1 flex flex-col ml-4">
                  <span className="text-lg font-bold">{product.titlePl}</span>
                  <span className="text-lg text-gray-400">
                    {t("pricePerUnit")}: {product.price.toFixed(2)} PLN
                  </span>

                  {/* Cena i kontrolki ilości */}
                  <div className="flex items-center mt-2 justify-between">
                    <span className="text-lg">
                      {t("totalPrice")}: {(product.price * product.quantity).toFixed(2)} PLN
                    </span>
                    <div className="flex items-center">
                      {product.quantity > 1 ? (
                        <Button
                          onPress={() => decreaseQuantity(product.bookId)}
                          className="mr-2"
                          size="sm"
                        >
                          <FaMinus />
                        </Button>
                      ) : (
                        <Button
                          onPress={() => removeFromCart(product.bookId)}
                          className="mr-2"
                          size="sm"
                        >
                          <FaTrash />
                        </Button>
                      )}
                      <Input
                        type="text"
                        size="sm"
                        value={String(product.quantity)}
                        onChange={(e) =>
                          handleQuantityChange(product.bookId, e.target.value)
                        }
                        onBlur={() =>
                          handleBlur(product.bookId, String(product.quantity))
                        }
                        className="w-16 text-center border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        onPress={() => increaseQuantity(product.bookId)}
                        className="ml-2"
                        size="sm"
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col ml-4 pl-4 mt-auto">
          <div className="flex flex-col items-start mb-2">
            <span className="text-lg font-semibold">{t("totalCost")}:</span>
            <span className="text-2xl font-bold">{totalPrice} PLN</span>
          </div>
          <Button className="bg-green-500" onPress={handleGoToDelivery}>
            {t("chooseDeliveryMethod")}
          </Button>
          <Button onPress={clearCart} className="mt-2 bg-red-500">
            {t("clearCart")}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Cart;
