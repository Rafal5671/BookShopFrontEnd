import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";

interface AddPublisherProps {
  onPublisherAdded: () => void;
}

const AddPublisher: React.FC<AddPublisherProps> = ({ onPublisherAdded }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { token, loading, logout } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Brak tokenu. Zaloguj się.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/publishers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      setMessage(`Dodano wydawcę: ${name}`);
      setName("");
      onPublisherAdded();
    } catch (error) {
      setMessage("Wystąpił błąd podczas dodawania wydawcy.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Dodaj nowego wydawcę</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <label htmlFor="name">Nazwa wydawcy:</label>
          <input
            id="name"
            className="border p-1 rounded w-full"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Zapisz
        </button>
      </form>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default AddPublisher;
