"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pagination, Button, Input } from "@nextui-org/react";

import { PageResponse } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import { fetchRefreshTokensByEmailServer, fetchRefreshTokensServer, RefreshTokenItem, revokeRefreshTokenServer } from "../server/admin/tokens/actions";
import { withAuth } from "../server/auth/withAuth";

function RefreshTokens() {
  const [tokens, setTokens] = useState<RefreshTokenItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchEmail, setSearchEmail] = useState(""); // Wartość wpisywana przez użytkownika
  const [submittedEmail, setSubmittedEmail] = useState(""); // Email, który faktycznie wywoła zapytanie

  const { token } = useAuth();

  const loadTokens = useCallback(
    async (page: number, email?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        let data: PageResponse<RefreshTokenItem>;
        if (email) {
          data = await fetchRefreshTokensByEmailServer(email, page, pageSize);
        } else {
          data = await fetchRefreshTokensServer(page, pageSize);
        }
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

  // Załaduj tokeny przy starcie lub zmianie strony
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
    return <p>Ładowanie tokenów...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Refresh Tokeny</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Szukaj po email..."
          value={searchEmail}
          onChange={handleEmailChange}
        />
        <Button onPress={handleSearch}>Szukaj</Button>
      </div>

      {tokens.length === 0 && <p>Brak tokenów do wyświetlenia.</p>}

      {tokens.map((tokenObj) => (
        <div key={tokenObj.id} className="border rounded-md p-4 mb-2 flex justify-between items-center">
          <div>
            <p><strong>ID:</strong> {tokenObj.id}</p>
            <p><strong>Email:</strong> {tokenObj.email}</p>
            <p><strong>Token:</strong> {tokenObj.token}</p>
            <p><strong>Wygasa:</strong> {new Date(tokenObj.expiryDate).toLocaleString()}</p>
            <p><strong>Revoked:</strong> {tokenObj.revoked ? "Tak" : "Nie"}</p>
          </div>
          {!tokenObj.revoked && (
            <Button color="warning" onPress={() => handleRevoke(tokenObj.id)}>
              Revoke
            </Button>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            disableCursorAnimation
            showControls
            initialPage={currentPage + 1}
            total={totalPages}
            onChange={(page) => setCurrentPage(page - 1)}
          />
        </div>
      )}
    </div>
  );
}
export default withAuth(RefreshTokens, ['ROLE_ADMIN']);