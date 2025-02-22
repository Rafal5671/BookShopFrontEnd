"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function PaymentFailed() {
  const router = useRouter();
  const { t } = useTranslation();
  const handleBackToShop = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          {t("payment.failed.title")}
        </h2>
        <p className="mb-6 text-center">
          {t("payment.failed.message")}
        </p>
        <Button color="danger" onPress={handleBackToShop}>
          {t("payment.failed.backToStore")}
        </Button>
      </Card>
    </div>
  );
}
