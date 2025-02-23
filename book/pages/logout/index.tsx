"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Card, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };
  const {t} = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          {t("logoutSuccessTitle")}
        </h2>
        <p className="mb-6 text-center">
          {t("logoutSuccessMessage")}
        </p>
        <Button color="success" onPress={handleBackToHome}>
          {t("backToHome")}
        </Button>
      </Card>
    </div>

  );
}
