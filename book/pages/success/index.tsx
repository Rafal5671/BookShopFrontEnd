"use client";

import { Card, Button } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  const handleBackToShop = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          Płatność zakończona sukcesem!
        </h2>
        <p className="mb-6 text-center">
          Dziękujemy za dokonanie płatności. Twoja transakcja została pomyślnie zrealizowana.
        </p>
        {sessionId && (
          <p className="mb-6 text-center">
            Numer sesji: <span className="font-mono">{sessionId}</span>
          </p>
        )}
        <Button  color="success" onPress={handleBackToShop}>
          Powrót do sklepu
        </Button>
      </Card>
    </div>
  );
}
