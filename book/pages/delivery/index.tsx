"use client";

import React, {
  useState,
  useEffect,
  useTransition,
  useCallback,
  ChangeEvent,
} from "react";
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
import { createOrderServer, fetchCustomerDataServer } from "@/components/client/delivery/actions";
import { loadStripe } from "@stripe/stripe-js";
import { FormData } from "@/types/types";
import LoginForm from "@/components/client/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

type Product = {
  bookId: number;
  titlePl: string;
  price: number;
  quantity: number;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const DeliveryPage: React.FC = () => {
  const { token, loading } = useAuth();

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
  const [userData, setUserData] = useState<any>(null);
  const [orderAsGuest, setOrderAsGuest] = useState<boolean>(false);
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();
  const fetchUserData = useCallback(
    (token: string) => {
      startTransition(async () => {
        try {
          const data = await fetchCustomerDataServer();
          console.log("Fetched user data:", data);
          setUserData(data);
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
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      });
    },
    [startTransition]
  );

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token, fetchUserData]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart: Product[] = JSON.parse(storedCart);
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

  const getTotalPrice = (): number =>
    cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

  const handleOrderAsGuest = () => {
    setOrderAsGuest(true);
  };

  const handleLoginOn = () => {
    if (token) {
      fetchUserData(token);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selectedCountry: string) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
    }));
  };

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePreviousStep = () => setStep((prev) => prev - 1);
  const getProgressPercentage = (): number => (step / 3) * 100;

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
      paymentMethod: formData.paymentMethod,
    };

    startTransition(async () => {
      try {
        const result = await createOrderServer(orderData);
        console.log("createOrderServer result:", result);
        const { url } = result;
        if (!url) {
          console.warn(
            "Brak 'url' w odpowiedzi z backendu (Stripe Checkout)."
          );
        }

        if (formData.paymentMethod === "online" && url) {
          window.location.href = url;
        } else {
          alert("Zamówienie zostało złożone – płatność przy odbiorze.");
          localStorage.removeItem("cart");
          router.push("/confirm");
        }
      } catch (error: any) {
        console.error("Błąd podczas składania zamówienia:", error);
        alert(
          `Wystąpił problem podczas składania zamówienia: ${error.message ?? "Nieznany błąd"
          }`
        );
      }
    });
  };


  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!token && !orderAsGuest) {
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
      <h1 className="text-2xl font-bold mb-6 text-center">{t("delivery_order_title")}</h1>
      <div className="mb-6">
        <Progress
          value={getProgressPercentage()}
          color="primary"
          size="sm"
          aria-label="Postęp zamówienia"
        />
        <div className="flex justify-between text-sm mt-2">
          <span className={step === 1 ? "font-bold text-primary" : "text-gray-500"}>
            {t("delivery_address_data")}
          </span>
          <span className={step === 2 ? "font-bold text-primary" : "text-gray-500"}>
            {t("delivery_method_title")}
          </span>
          <span className={step === 3 ? "font-bold text-primary" : "text-gray-500"}>
            {t("order_summary_title")}
          </span>
        </div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("delivery_shipping_data")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("firstName_label")}
              placeholder={t("firstName_placeholder")}
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              readOnly={!!(token && userData?.firstName)}
            />
            <Input
              label={t("lastName_label")}
              placeholder={t("lastName_placeholder")}
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              readOnly={!!(token && userData?.lastName)}
            />
            <Input
              label={t("phone_label")}
              placeholder={t("phone_placeholder")}
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={!!(token && userData?.phone)}
            />
            <Input
              label={t("email_label")}
              placeholder={t("email_placeholder")}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={!!(token && userData?.email)}
            />

            <Select
              label={t("country_label")}
              placeholder={t("country_placeholder")}
              value={formData.country}
              onChange={(value) => handleCountryChange(value.toString())}
            >
              <SelectItem key="Polska" value="Polska">
                {t("country_poland")}
              </SelectItem>
              <SelectItem key="Niemcy" value="Niemcy">
                {t("country_germany")}
              </SelectItem>
              <SelectItem key="Czechy" value="Czechy">
                {t("country_czech")}
              </SelectItem>
              <SelectItem key="Słowacja" value="Słowacja">
                {t("country_slovakia")}
              </SelectItem>
              <SelectItem key="Litwa" value="Litwa">
                {t("country_lithuania")}
              </SelectItem>
            </Select>

            <Input
              label={t("street_label")}
              placeholder={t("street_placeholder")}
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
            <Input
              label={t("postalCode_label")}
              placeholder={t("postalCode_placeholder")}
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
            <Input
              label={t("city_label")}
              placeholder={t("city_placeholder")}
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button disabled color="default">
              {t("back")}
            </Button>
            <Button color="default" onClick={handleNextStep}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("delivery_method_title")}</h2>
          <RadioGroup
            value={formData.deliveryMethod}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({
                ...prev,
                deliveryMethod: e.target.value,
              }))
            }
            label={t("delivery_method_label")}
          >
            <Radio value="courier">{t("delivery_courier")}</Radio>
          </RadioGroup>

          <div className="mt-6">
            <RadioGroup
              value={formData.paymentMethod}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
              label="Wybierz metodę płatności"
            >
              <Radio value="online">{t("payment_online")}</Radio>
              <Radio value="cash">{t("payment_cash")}</Radio>
            </RadioGroup>
          </div>

          <div className="flex justify-between mt-6">
            <Button color="default" onClick={handlePreviousStep}>
              {t("back")}
            </Button>
            <Button color="default" onClick={handleNextStep}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("order_summary_title")}</h2>

          <div className="mb-4">
            <h3 className="font-semibold">{t("cart_products")}</h3>
            {cart.map((product) => (
              <div key={product.bookId} className="flex justify-between mt-2">
                <span>{product.title}</span>
                <span>
                  {product.quantity} x {product.price} PLN
                </span>
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <span>
                <strong>{t("total")}</strong>
              </span>
              <span>
                <strong>{getTotalPrice()} PLN</strong>
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">{t("delivery_address")}</h3>
            <p>
              {formData.firstName} {formData.lastName}
            </p>
            <p>
              {formData.street}, {formData.postalCode} {formData.city}
            </p>

            <p>{formData.phone}</p>
            <p>{formData.email}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">{t("pickup_method")}</h3>
            <p>{t("delivery_courier")}</p>
            <h3 className="font-semibold">{t("payment_method")}</h3>
            <p>{formData.paymentMethod}</p>
          </div>

          <Checkbox
            className="mt-4"
            color="success"
            isSelected={formData.agreement}
            onChange={(isSelected) =>
              setFormData((prev) => ({ ...prev, agreement: !!isSelected }))
            }
          >
            {t("accept_terms")}
          </Checkbox>

          <div className="flex justify-between mt-6">
            <Button color="default" onPress={handlePreviousStep}>
              {t("back")}
            </Button>
            <Button
              color="default"
              isDisabled={!formData.agreement}
              onPress={handleOrderSubmit}
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;
