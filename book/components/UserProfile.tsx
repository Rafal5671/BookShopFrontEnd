import { useState, useEffect } from "react";
import { Card, Avatar } from "@nextui-org/react";

const UserProfile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Nie znaleziono tokenu. Użytkownik nie jest zalogowany.");
        setLoading(false); // Ustawiamy loading na false, bo tokenu brak
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/customers/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Upewnij się, że token jest w formacie Bearer <token>
          },
        });

        console.log(response); // Logowanie odpowiedzi, aby sprawdzić status

        if (!response.ok) {
          // Logowanie statusu odpowiedzi, aby sprawdzić kod błędu
          const errorText = await response.text();
          throw new Error(
            `Błąd przy pobieraniu danych użytkownika: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log(result);
        setUserData(result); // Ustaw dane użytkownika w stanie
        setLoading(false); // Zakończono ładowanie
      } catch (error: unknown) {
        // Logowanie błędu
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        setError("Wystąpił błąd podczas ładowania danych użytkownika");
        setLoading(false); // Zakończono ładowanie, nawet w przypadku błędu
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Brak danych użytkownika</div>;
  }

  return (
    <Card className="p-4 mb-4 bg-primary-100">
      <div className="flex items-center">
        <Avatar
          size="lg"
          src={userData.avatarUrl || "https://i.pravatar.cc/150"} // Użyj URL z danych użytkownika lub domyślnego avatara
          alt="User avatar"
          className="mr-4"
          disableAnimation
        />
        <div>
          <h3 className="text-lg font-semibold">
            {`${userData.firstName || "User"} ${userData.lastName || "Name"}`}
          </h3>

          <p>{userData.email || "user@example.com"}</p>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
