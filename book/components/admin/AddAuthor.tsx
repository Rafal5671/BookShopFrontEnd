"use client";

import React, { useState, useTransition } from "react";
import { addAuthor } from "../server/admin/authors/actions";
import { useAuth } from "@/hooks/useAuth";

interface AddAuthorProps {
  onAuthorAdded?: () => void;
}

export default function AddAuthor({ onAuthorAdded }: AddAuthorProps)  {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const result = await addAuthor(firstName, lastName);
        setMessage(`Dodano autora: ${result.firstName} ${result.lastName}`);
        setFirstName("");
        setLastName("");
        onAuthorAdded?.();
      } catch (error: any) {
        setMessage(`Błąd: ${error.message}`);
      }
    });
  }

  return (
    <div>
      <h2>Dodaj nowego autora</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Imię</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label>Nazwisko</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie..." : "Zapisz"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
