"use client";

import { Card, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          Wylogowano pomyślnie!
        </h2>
        <p className="mb-6 text-center">
          Zostałeś pomyślnie wylogowany. Możesz wrócić na stronę główną lub zalogować się ponownie.
        </p>
        <Button color="success" onPress={handleBackToHome}>
          Powrót do strony głównej
        </Button>
      </Card>
    </div>
  );
}
