"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pagination, Button, Input } from "@nextui-org/react";

import { PageResponse } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchRefreshTokensServer,
  RefreshTokenItem,
  revokeRefreshTokenServer,
} from "../server/admin/tokens/actions";
import { withAuth } from "../server/auth/withAuth";

// Funkcja pomocnicza do skracania tokenu
const shortenToken = (token: string, startLength: number = 10, endLength: number = 10) => {
  if (token.length > startLength + endLength) {
    return token.slice(0, startLength) + "..." + token.slice(-endLength);
  }
  return token;
};

function RefreshTokens() {
  const [tokens, setTokens] = useState<RefreshTokenItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchEmail, setSearchEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { token } = useAuth();

  const loadTokens = useCallback(
    async (page: number, email?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Wystarczy jedna funkcja, która obsłuży i pusty email i niepusty
        const data: PageResponse<RefreshTokenItem> =
          await fetchRefreshTokensServer(page, pageSize, email);

        setTokens(data.content);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "Wystąpił błąd przy pobieraniu tokenów.");
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    loadTokens(currentPage, submittedEmail);
  }, [currentPage, submittedEmail, loadTokens]);

  const handleRevoke = async (id: number) => {
    try {
      await revokeRefreshTokenServer(id);
      setTokens((prev) =>
        prev.map((t) => (t.id === id ? { ...t, revoked: true } : t))
      );
    } catch (err: any) {
      setError(err.message || "Błąd przy unieważnianiu tokenu.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  const handleSearch = () => {
    setSubmittedEmail(searchEmail);
    setCurrentPage(0);
  };

  if (isLoading) {
    return <p className="text-center mt-10">Ładowanie tokenów...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Błąd: {error}</p>;
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Refresh Tokeny</h1>

      <div className="flex justify-center mb-6">
        <div className="flex gap-2 w-full max-w-md">
          <Input
            fullWidth
            placeholder="Szukaj po email..."
            value={searchEmail}
            onChange={handleEmailChange}
          />
          <Button onPress={handleSearch}>Szukaj</Button>
        </div>
      </div>

      {tokens.length === 0 && (
        <p className="text-center">Brak tokenów do wyświetlenia.</p>
      )}

      <div className="grid gap-4">
        {tokens.map((tokenObj) => (
          <div
            key={tokenObj.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                <strong>ID:</strong> {tokenObj.id}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                <strong>Email:</strong> {tokenObj.token}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Token:</strong> {shortenToken(tokenObj.email)}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Wygasa:</strong>{" "}
                {new Date(tokenObj.expiryDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Revoked:</strong> {tokenObj.revoked ? "Tak" : "Nie"}
              </p>
            </div>
            {!tokenObj.revoked && (
              <Button color="warning" onPress={() => handleRevoke(tokenObj.id)}>
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            disableCursorAnimation
            showControls
            color="warning"
            initialPage={currentPage + 1}
            total={totalPages}
            onChange={(page) => setCurrentPage(page - 1)}
          />
        </div>
      )}
    </div>
  );
}

export default withAuth(RefreshTokens, ["ROLE_ADMIN"]);
