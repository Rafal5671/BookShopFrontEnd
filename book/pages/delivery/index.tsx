"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import {
  Input,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  SelectItem,
  Progress,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { createOrderServer, fetchCustomerDataServer } from "@/components/client/delivery/actions";
import { loadStripe } from "@stripe/stripe-js";

import { FormData } from "@/types/types";

type Product = {
  bookId: number;
  titlePl: string;
  price: number;
  quantity: number;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
export default function DeliveryPage() {
  // -----------------------------
  // 1. Stan i router
  // -----------------------------
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    street: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    country: "Polska",
    deliveryMethod: "courier",
    paymentMethod: "online",
    agreement: false,
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [orderAsGuest, setOrderAsGuest] = useState<boolean>(false);

  const [cart, setCart] = useState<Product[]>([]); 

  const router = useRouter();

  // Server Actions w React 18 – useTransition
  const [isPending, startTransition] = useTransition();

  // -----------------------------
  // 2. Odczyt koszyka z localStorage
  // -----------------------------
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCart([]);
      }
    } else {
      console.log("Cart is empty in localStorage.");
      setCart([]);
    }
  }, []);

  // Pomocnicza funkcja do sumy koszyka
  const getTotalPrice = (): number => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  // -----------------------------
  // 3. Autoryzacja – sprawdzanie tokena
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token wygasł
          setIsLoggedIn(false);
          localStorage.removeItem("authToken");
        } else {
          // Token jest ważny
          setIsLoggedIn(true);
          // Pobierz dane użytkownika z server action:
          fetchUserData(token);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // -----------------------------
  // 4. Pobieranie danych użytkownika z server action
  // -----------------------------
  const fetchUserData = useCallback((token: string) => {
    startTransition(async () => {
      try {
        const data = await fetchCustomerDataServer(token);
        console.log("Fetched user data:", data);

        setUserData(data);
        // Uzupełnij formData danymi z bazy, jeśli istnieją:
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phone: data.phone || prev.phone,
          email: data.email || prev.email,
          street: data.address?.street || prev.street,
          postalCode: data.address?.postalCode || prev.postalCode,
          city: data.address?.city || prev.city,
          country: data.address?.country || prev.country,
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    });
  }, []);

  // Obsługa zamówienia jako gość
  const handleOrderAsGuest = () => {
    setOrderAsGuest(true);
  };

  // Po zalogowaniu z LoginForm
  const handleLoginOn = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem("authToken");
    if (token) fetchUserData(token);
  };

  // -----------------------------
  // 5. Obsługa formularza i kroków
  // -----------------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (selectedCountry: string) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
    }));
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  // Pasek postępu
  const getProgressPercentage = (): number => {
    return (step / 3) * 100;
  };

  // -----------------------------
  // 6. Tworzenie zamówienia (Server Action)
  // -----------------------------
  const handleOrderSubmit = async () => {
    const orderData = {
      address: {
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
      },
      items: cart.map((p) => ({
        bookId: p.bookId,
        quantity: p.quantity,
      })),
      amount: getTotalPrice(),
    };
  
    const token = localStorage.getItem("authToken") || "";
  
    startTransition(async () => {
      try {
        // Wywołujemy funkcję tworzącą zamówienie i CheckoutSession na backendzie
        const result = await createOrderServer(token, orderData);
        console.log("createOrderServer result:", result);
  
        // Zakładamy, że backend zwraca { orderId, url }
        const { orderId, url } = result;
        if (!url) {
          console.warn("Brak 'url' w odpowiedzi z backendu (Stripe Checkout).");
        }
  
        // Jeśli paymentMethod = "online", przekierowujemy na URL Stripe Checkout:
        if (formData.paymentMethod === "online") {
          // 1. Usuwamy z kodu confirmCardPayment i płatność kartą u siebie,
          //    bo teraz wszystko dzieje się na stronie Stripe.
          window.location.href = url; // przenosi na Stripe Checkout
        } else {
          // Płatność gotówką/przy odbiorze, itp.
          alert("Zamówienie zostało złożone – płatność przy odbiorze.");
          localStorage.removeItem("cart");
          router.push("/confirmation");
        }
      } catch (error: any) {
        console.error("Błąd podczas składania zamówienia:", error);
        alert(`Wystąpił problem podczas składania zamówienia: ${error.message ?? "Nieznany błąd"}`);
      }
    });
  };
  

  // -----------------------------
  // 7. Jeśli użytkownik nie jest zalogowany i nie wybrał opcji gościa, pokaż formularz logowania
  // -----------------------------
  if (!isLoggedIn && !orderAsGuest) {
    return (
      <div>
        {/* 
          W Twoim kodzie to jest <LoginForm showGuestOrderButton onGuestOrder={handleOrderAsGuest} ... />
          Tu tylko symbolicznie.
        */}
        <p>Tu będzie LoginForm lub przycisk „Zamawiam jako gość”.</p>
        <Button onPress={handleOrderAsGuest}>Zamawiam jako gość</Button>
      </div>
    );
  }

  // -----------------------------
  // 8. Render wieloetapowego formularza
  // -----------------------------
  return (
    <div className="max-w-4xl mt-10 mb-10 mx-auto p-8 bg-primary-200 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Zamówienie</h1>

      {/* Pasek postępu */}
      <div className="mb-6">
        <Progress
          value={getProgressPercentage()}
          color="primary"
          size="sm"
          aria-label="Postęp zamówienia"
        />
        <div className="flex justify-between text-sm mt-2">
          <span
            className={step === 1 ? "font-bold text-primary" : "text-gray-500"}
          >
            Dane Adresowe
          </span>
          <span
            className={step === 2 ? "font-bold text-primary" : "text-gray-500"}
          >
            Metoda Odbioru
          </span>
          <span
            className={step === 3 ? "font-bold text-primary" : "text-gray-500"}
          >
            Podsumowanie Zamówienia
          </span>
        </div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Dane do wysyłki</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Imię"
              placeholder="Wpisz swoje imię"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              readOnly={isLoggedIn && userData?.firstName}
            />
            <Input
              label="Nazwisko"
              placeholder="Wpisz swoje nazwisko"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              readOnly={isLoggedIn && userData?.lastName}
            />
            <Input
              label="Numer telefonu"
              placeholder="Wpisz swój numer telefonu"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={isLoggedIn && userData?.phone}
            />
            <Input
              label="Email"
              placeholder="Wpisz swój email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={isLoggedIn && userData?.email}
            />

            <Select
              label="Kraj"
              placeholder="Wybierz kraj"
              value={formData.country}
              onChange={(value) => handleCountryChange(value.toString())}
            >
              <SelectItem key="Polska" value="Polska">
                Polska
              </SelectItem>
              <SelectItem key="Niemcy" value="Niemcy">
                Niemcy
              </SelectItem>
              <SelectItem key="Czechy" value="Czechy">
                Czechy
              </SelectItem>
              <SelectItem key="Słowacja" value="Słowacja">
                Słowacja
              </SelectItem>
              <SelectItem key="Litwa" value="Litwa">
                Litwa
              </SelectItem>
            </Select>

            <Input
              label="Ulica"
              placeholder="Wpisz swoją ulicę"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
            <Input
              label="Kod pocztowy"
              placeholder="00-000"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
            <Input
              label="Miasto"
              placeholder="Wpisz miasto"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button disabled color="default">
              Wróć
            </Button>
            <Button color="default" onClick={handleNextStep}>
              Dalej
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Metoda wysyłki</h2>
          <RadioGroup
            value={formData.deliveryMethod}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, deliveryMethod: e.target.value });
            }}
            label="Wybierz metodę dostawy"
          >
            <Radio value="courier">Kurier</Radio>
            <Radio value="pickup">Odbiór osobisty</Radio>
            <Radio value="parcel">Paczkomat</Radio>
          </RadioGroup>

          <div className="mt-6">
            <RadioGroup
              value={formData.paymentMethod}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, paymentMethod: e.target.value });
              }}
              label="Wybierz metodę płatności"
            >
              <Radio value="online">Płatność online (Stripe)</Radio>
              <Radio value="cash">Gotówka</Radio>
            </RadioGroup>
          </div>

          <div className="flex justify-between mt-6">
            <Button color="default" onClick={handlePreviousStep}>
              Wróć
            </Button>
            <Button color="default" onClick={handleNextStep}>
              Dalej
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Podsumowanie Zamówienia</h2>

          <div className="mb-4">
            <h3 className="font-semibold">Produkty w koszyku:</h3>
            {cart.map((product) => (
              <div key={product.bookId} className="flex justify-between mt-2">
                <span>{product.titlePl}</span>
                <span>
                  {product.quantity} x {product.price} PLN
                </span>
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <span>
                <strong>Suma:</strong>
              </span>
              <span>
                <strong>{getTotalPrice()} PLN</strong>
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Adres dostawy:</h3>
            <p>
              {formData.firstName} {formData.lastName}
            </p>
            <p>
              {formData.street}, {formData.postalCode} {formData.city}
            </p>
            <p>{formData.country}</p>
            <p>{formData.phone}</p>
            <p>{formData.email}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Metoda odbioru:</h3>
            <p>{formData.deliveryMethod}</p>
            <h3 className="font-semibold">Metoda płatności:</h3>
            <p>{formData.paymentMethod}</p>
          </div>

          <Checkbox
            className="mt-4"
            isSelected={formData.agreement}
            onChange={(isSelected) =>
              setFormData({ ...formData, agreement: !!isSelected })
            }
          >
            Akceptuję regulamin zakupów
          </Checkbox>

          <div className="flex justify-between mt-6">
            <Button color="default" onPress={handlePreviousStep}>
              Wróć
            </Button>
            <Button
              color="default"
              isDisabled={!formData.agreement}
              onPress={handleOrderSubmit}
            >
              Potwierdź
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
