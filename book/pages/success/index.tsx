"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Card, Button } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const { t } = useTranslation();
  const handleBackToShop = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          {t("payment.success.title")}
        </h2>
        <p className="mb-6 text-center">
          {t("payment.success.message")}
        </p>
        {sessionId && (
          <p className="mb-6 text-center">
            {t("payment.success.sessionNumber")}{" "}
            <span className="font-mono">{sessionId}</span>
          </p>
        )}
        <Button color="success" onPress={handleBackToShop}>
          {t("payment.success.backToStore")}
        </Button>
      </Card>
    </div>
  );
}
