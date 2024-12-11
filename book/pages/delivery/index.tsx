import React, { useState, useEffect } from "react";
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
import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

type FormData = {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  country: string;
  deliveryMethod: string;
  paymentMethod: string;
  agreement: boolean;
};
type Product = {
  bookId: number;
  titlePl: string;
  titleEn: string;
  image?: string;
  pages_count: number;
  relese_year: number;
  price: number;
  discountedPrice?: number;
  quantity: number;
};
const DeliveryPage: React.FC = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleOrderSubmit = async () => {
    try {
      // Przygotowanie danych zamówienia
      const orderData = {
        address: {
          street: formData.street,
          postalCode: formData.postalCode,
          city: formData.city,
        },
        items: cart.map((product) => ({
          bookId: product.bookId,
          quantity: product.quantity,
        })),
        amount: getTotalPrice(),
      };

      console.log("Dane zamówienia:", orderData);

      // Wysłanie żądania do API
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify(orderData),
      });

      // Obsługa odpowiedzi
      if (response.ok) {
        alert("Zamówienie zostało złożone!");
        router.push("/confirmation");
      } else {
        const errorMessage = await response.text(); // Pobierz komunikat błędu (jeśli dostępny)
        console.error("Błąd API:", errorMessage || "Nieznany błąd");
        alert(
          `Wystąpił problem podczas składania zamówienia: ${
            errorMessage || "Nieznany błąd API"
          }`
        );
      }
    } catch (error) {
      console.error("Błąd podczas składania zamówienia:", error);
      alert(
        "Wystąpił problem podczas składania zamówienia. Spróbuj ponownie później."
      );
    }
  };

  const handleCountryChange = (selectedCountry: string) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
    }));
  };

  const handleNextStep = () => {
    console.log(
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.email
    );
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  // Oblicz procent ukończenia
  const getProgressPercentage = (): number => {
    return (step / 3) * 100;
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const [orderAsGuest, setOrderAsGuest] = useState<boolean>(false);

  const [cart, setCart] = useState<Product[]>([]); // Stan do przechowywania produktów z koszyka

  // Odczyt danych koszyka z localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const getTotalPrice = (): number => {
    return cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };
  // Sprawdzenie, czy użytkownik jest zalogowany
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
          // Token ważny
          setIsLoggedIn(true);
          fetchCustomerData(token); // Pobierz dane użytkownika
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Funkcja pobierająca dane użytkownika z API
  const fetchCustomerData = (token: string) => {
    fetch("http://localhost:8080/api/customers/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched user data:", data);
        setUserData(data);
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phone: data.phone || prev.phone,
          email: data.email || prev.email,
          street: data.address?.street || prev.street, // Jeśli dane są w obiekcie address
          postalCode: data.address?.postalCode || prev.postalCode,
          city: data.address?.city || prev.city,
          country: data.address?.country || prev.country,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };
  // Funkcja obsługująca zamówienie jako gość
  const handleOrderAsGuest = () => {
    console.log("Guest order selected");
    setOrderAsGuest(true);
  };
  const handleLoginOn = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem("authToken") as string;
    fetchCustomerData(token);
  };
  if (!isLoggedIn && !orderAsGuest) {
    return (
      <div>
        <LoginForm
          showGuestOrderButton={true}
          onGuestOrder={handleOrderAsGuest}
          handleLoginOn={handleLoginOn}
        />
      </div>
    );
  }

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
              value={isLoggedIn ? userData?.firstName : formData.firstName}
              onChange={handleInputChange}
              readOnly={isLoggedIn}
            />
            <Input
              label="Nazwisko"
              placeholder="Wpisz swoje nazwisko"
              name="lastName"
              value={isLoggedIn ? userData?.lastName : formData.lastName}
              onChange={handleInputChange}
              readOnly={isLoggedIn}
            />
            <Input
              label="Numer telefonu"
              placeholder="Wpisz swój numer telefonu"
              name="phone"
              value={isLoggedIn ? userData?.phone : formData.phone}
              onChange={handleInputChange}
              readOnly={isLoggedIn}
            />
            <Input
              label="Email"
              placeholder="Wpisz swój email"
              name="email"
              value={isLoggedIn ? userData?.email : formData.email}
              onChange={handleInputChange}
              readOnly={isLoggedIn}
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
              readOnly={false}
            />

            <Input
              label="Kod pocztowy"
              placeholder="00-000"
              name="postalCode"
              value={formData.postalCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e)
              }
              readOnly={false}
            />

            <Input
              label="Miasto"
              placeholder="Wpisz miasto"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              readOnly={false}
            />
          </div>
          <div className="flex justify-between mt-6">
            <Button disabled color="default" onClick={handlePreviousStep}>
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
              <Radio value="online">Płatność online</Radio>
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
          <h2 className="text-xl font-semibold mb-4">
            Podsumowanie Zamówienia
          </h2>

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
              {formData.street} {formData.postalCode} {formData.city}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, agreement: e.target.checked })
            }
          >
            Akceptuję regulamin zakupów
          </Checkbox>

          <div className="flex justify-between mt-6">
            <Button color="default" onClick={handlePreviousStep}>
              Wróć
            </Button>
            <Button
              color="default"
              isDisabled={!formData.agreement}
              onClick={handleOrderSubmit}
            >
              Potwierdź
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;
