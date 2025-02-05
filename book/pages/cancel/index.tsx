"use client";

import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function PaymentFailed() {
  const router = useRouter();

  const handleBackToShop = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          Płatność nieudana
        </h2>
        <p className="mb-6 text-center">
          Niestety, Twoja płatność nie została zakończona sukcesem. Prosimy o ponowienie próby lub kontakt z naszym działem wsparcia.
        </p>
        <Button  color="danger" onPress={handleBackToShop}>
          Powrót do sklepu
        </Button>
      </Card>
    </div>
  );
}
