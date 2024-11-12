import { Button, Image, Input } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa";
import { useCart } from "@/hooks/CartContext";

export default function Cart() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  // Calculate the total price dynamically
  const totalPrice = cart
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);

  // Handlers for quantity change
  const increaseQuantity = (id: number) => {
  const product = cart.find((product) => product.id === id);
  if (product) {
    updateQuantity(id, Math.min(product.quantity + 1, 99)); // Safely access quantity
  }
};


  const decreaseQuantity = (id: number) => {
    const product = cart.find((product) => product.id === id);
    if (product && product.quantity > 1) {
      updateQuantity(id, product.quantity - 1);
    }
  };

  const handleQuantityChange = (id: number, value: string) => {
    // Allow empty input
    if (value === "" || /^[0-9]*$/.test(value)) {
      const quantity = value === "" ? 1 : Math.min(parseInt(value, 10), 99); // Allow empty, set to 1, cap at 99
      updateQuantity(id, quantity);
    }
  };

  const handleBlur = (id: number, value: string) => {
    // If the input is empty, set the quantity to 1
    if (value === "") {
      updateQuantity(id, 1); // Set to 1 if empty
    } else {
      const quantity = Math.min(parseInt(value, 10), 99); // Ensure it does not exceed 99
      updateQuantity(id, quantity);
    }
  };

  return (
    <div className="my-10 flex justify-center w-full">
      <div className="shadow-lg rounded-lg p-6 flex w-4/5 bg-primary-100">
        <div className="flex-1 pr-4">
          <h2 className="text-2xl font-bold mb-4">Twoje produkty</h2>
          {cart.length === 0 ? (
            <p>Twój koszyk jest pusty</p>
          ) : (
            cart.map((product) => (
              <div
                key={product.id}
                className="flex mb-4 p-4 border-b border-gray-200 items-center"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col ml-4">
                  <span className="text-lg font-bold">{product.name}</span>
                  <span className="text-lg text-gray-400">Cena za sztukę: {product.price.toFixed(2)} zł</span>

                  {/* Price and Quantity Controls */}
                  <div className="flex items-center mt-2 justify-between">
                    <span className="text-lg">
                      Cena produktów: {(product.price * product.quantity).toFixed(2)} zł
                    </span>
                    <div className="flex items-center">
                      {product.quantity > 1 ? (
                        <>
                          <Button
                            onClick={() => decreaseQuantity(product.id)}
                            className="mr-2"
                            size="sm"
                          >
                            -
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => removeFromCart(product.id)}
                          className="mr-2"
                          size="sm"
                        >
                          <span role="img" aria-label="trash">
                            <FaTrash />
                          </span>
                        </Button>
                      )}
                      <Input
                        type="text"
                        size="sm"
                        value={String(product.quantity)}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        onBlur={() =>
                          handleBlur(product.id, String(product.quantity))
                        }
                        className="w-16 text-center border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        onClick={() => increaseQuantity(product.id)}
                        className="ml-2"
                        size="sm"
                      >
                        +
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
            <span className="text-lg font-semibold">Łączna cena:</span>
            <span className="text-2xl font-bold">{totalPrice} zł</span>
          </div>
          <Button className="bg-green-500">Wybierz sposób dostawy</Button>
        </div>
      </div>
    </div>
  );
}
