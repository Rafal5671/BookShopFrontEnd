import React, { useEffect, useState, useTransition } from "react";
import {
  Button,
  Card,
  Input,
  Textarea,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAuth } from "@/hooks/useAuth";
import { createProductServer, fetchAuthorsServer, fetchPublishersServer, updateProductServer } from "../server/admin/products/actions";

/** Typy */
interface Publisher {
  publisherId: number;
  name: string;
}

interface Author {
  authorId: number;
  firstName: string;
  lastName: string;
}

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // numer aktualnej strony (0-based)
  size: number;
}

type Product = {
  bookId: number;
  titlePl: string;
  titleEn: string;
  imageUrl?: string;
  pagesCount: number;
  releaseDate: string;
  price: number;
  descriptionPl?: string;
  descriptionEn?: string;
  discountPrice?: number;
  staticImage?: string;
  rating: number;
  reviews: { reviewId: number; user: string; content: string; rating: number }[];
  publisher: Publisher;
  authors: Author[];
  originalTitle: string;
  language: string;
  category?: string; // Filtry
  species?: string;
  genres?: string[];
  stock?: number;
};

interface OptionType {
  label: string;
  value: number;
}

interface AddProductProps {
  initialData?: Product;
  onSubmit: (data: any) => void; // Dostosuj typ w zależności od potrzeb
}

export default function AddProduct({ initialData, onSubmit }: AddProductProps) {
  const [formData, setFormData] = useState({
    titlePL: "",
    titleEN: "",
    descriptionPL: "",
    descriptionEN: "",
    releaseDate: "",
    originalTitle: "",
    price: "",
    salePrice: "",
    publisherId: "",
    authorsIds: [] as number[],
  });

  // Stan list:
  const [allPublishers, setAllPublishers] = useState<Publisher[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);

  // Stan ładowania:
  const [loadingPublishers, setLoadingPublishers] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedPublisherName, setSelectedPublisherName] = useState("");

  // Import z hooka autoryzacji
  const { token } = useAuth();

  // Reakcyjna obsługa transition (async operacje):
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------------------------
  // 1. Wczytanie initialData (edycja produktu)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!initialData) return;

    // Formatowanie daty do YYYY-MM-DD
    const formattedDate = initialData.releaseDate
      ? initialData.releaseDate.split("T")[0]
      : "";

    setFormData({
      titlePL: initialData.titlePl || "",
      titleEN: initialData.titleEn || "",
      descriptionPL: initialData.descriptionPl || "",
      descriptionEN: initialData.descriptionEn || "",
      releaseDate: formattedDate,
      originalTitle: initialData.originalTitle || "",
      price: initialData.price ? initialData.price.toString() : "",
      salePrice: initialData.discountPrice
        ? initialData.discountPrice.toString()
        : "",
      publisherId: initialData.publisher?.publisherId?.toString() || "",
      authorsIds: initialData.authors?.map((a) => a.authorId) || [],
    });

    setSelectedAuthors(initialData.authors || []);
    setImageUrl(initialData.imageUrl || "");
    setSelectedPublisherName(initialData.publisher?.name || "");
  }, [initialData]);

  // ----------------------------------------------------------------
  // 2. Pobranie wydawnictw z użyciem Server Action
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!token) {
      console.error("Brak tokenu uwierzytelniającego (publishers).");
      return;
    }

    // startTransition => nie blokuje interfejsu w czasie fetchu
    startTransition(async () => {
      setLoadingPublishers(true);
      try {
        const data = await fetchPublishersServer();
        setAllPublishers(data.content);
      } catch (err) {
        console.error("Error fetching publishers:", err);
        alert("Wystąpił błąd podczas pobierania wydawnictw.");
      } finally {
        setLoadingPublishers(false);
      }
    });
  }, [token]);

  // ----------------------------------------------------------------
  // 3. Pobranie autorów z użyciem Server Action
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!token) {
      console.error("Brak tokenu uwierzytelniającego (authors).");
      return;
    }

    startTransition(async () => {
      setLoadingAuthors(true);
      try {
        const data = await fetchAuthorsServer();
        setAllAuthors(data.content);
      } catch (err) {
        console.error("Error fetching authors:", err);
        alert("Wystąpił błąd podczas pobierania autorów.");
      } finally {
        setLoadingAuthors(false);
      }
    });
  }, [token]);

  // ----------------------------------------------------------------
  // 4. Obsługa zmian w formularzu
  // ----------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------------
  // 5. Wybór wydawnictwa (Autocomplete)
  // ----------------------------------------------------------------
  const handlePublisherSelect = (selectedLabel: string) => {
    const pub = allPublishers.find((p) => p.name === selectedLabel);
    if (pub) {
      setFormData((prev) => ({
        ...prev,
        publisherId: pub.publisherId.toString(),
      }));
    }
  };

  // ----------------------------------------------------------------
  // 6. Autorzy
  // ----------------------------------------------------------------
  const handleAuthorSelect = (selectedLabel: string) => {
    const author = allAuthors.find(
      (a) => `${a.firstName} ${a.lastName}` === selectedLabel
    );
    if (author && !selectedAuthors.some((a) => a.authorId === author.authorId)) {
      // Dodaj do stanu
      setSelectedAuthors((prev) => [...prev, author]);
      setFormData((prev) => ({
        ...prev,
        authorsIds: [...prev.authorsIds, author.authorId],
      }));
    }
  };

  const handleAuthorRemove = (authorId: number) => {
    setSelectedAuthors((prev) => prev.filter((a) => a.authorId !== authorId));
    setFormData((prev) => ({
      ...prev,
      authorsIds: prev.authorsIds.filter((id) => id !== authorId),
    }));
  };

  // ----------------------------------------------------------------
  // 7. Upload pliku (wciąż w kodzie klienckim)
  // ----------------------------------------------------------------
  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);

    const response = await fetch("http://localhost:3005/upload", {
      method: "POST",
      body: fd,
    });

    if (!response.ok) {
      throw new Error("Nie udało się przesłać zdjęcia");
    }

    const data = await response.json();
    return data.url;
  };

  // ----------------------------------------------------------------
  // 8. Submit formularza => create/ update
  // ----------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Brak tokenu, zaloguj się!");
      return;
    }
    if (!formData.publisherId) {
      alert("Proszę wybrać wydawnictwo.");
      return;
    }
    if (formData.authorsIds.length === 0) {
      alert("Proszę wybrać co najmniej jednego autora.");
      return;
    }

    try {
      let uploadedImageUrl = imageUrl; // jeśli już mamy link, zostawiamy
      if (selectedFile) {
        uploadedImageUrl = await uploadImage(selectedFile);
        setImageUrl(uploadedImageUrl);
      }

      const requestBody = {
        ...formData,
        publisherId: Number(formData.publisherId),
        authorsIds: formData.authorsIds,
        imageUrl: uploadedImageUrl,
      };

      startTransition(async () => {
        let updatedData;

        if (initialData) {
          // Aktualizacja istniejącego produktu (PUT)
          updatedData = await updateProductServer(
            initialData.bookId,
            requestBody
          );
          alert("Produkt został zaktualizowany!");
        } else {
          // Tworzenie nowego produktu (POST)
          updatedData = await createProductServer(requestBody);
          alert("Produkt został dodany!");
          // Resetuj formularz
          setFormData({
            titlePL: "",
            titleEN: "",
            descriptionPL: "",
            descriptionEN: "",
            releaseDate: "",
            originalTitle: "",
            price: "",
            salePrice: "",
            publisherId: "",
            authorsIds: [],
          });
          setSelectedAuthors([]);
          setSelectedFile(null);
          setImageUrl("");
          setSelectedPublisherName("");
        }

        // Wywołaj callback, jeśli jest
        onSubmit?.(updatedData);
      });
    } catch (error) {
      console.error(
        `Error ${initialData ? "updating" : "submitting"} product:`,
        error
      );
      alert(
        `Wystąpił błąd podczas ${
          initialData ? "aktualizacji" : "dodawania"
        } produktu.`
      );
    }
  };

  // ----------------------------------------------------------------
  // Gotowe – render
  // ----------------------------------------------------------------
  const publisherOptions = allPublishers.map((pub) => ({
    label: pub.name,
    value: pub.publisherId.toString(),
  }));

  const authorOptionsLabels = allAuthors.map(
    (author) => `${author.firstName} ${author.lastName}`
  );


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {initialData ? "Edytuj produkt" : "Dodaj produkt"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tytuł (PL) */}
          <Input
            label="Tytuł (PL)"
            name="titlePL"
            value={formData.titlePL}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Tytuł (EN) */}
          <Input
            label="Tytuł (EN)"
            name="titleEN"
            value={formData.titleEN}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Tytuł oryginalny */}
          <Input
            label="Tytuł oryginalny"
            name="originalTitle"
            value={formData.originalTitle}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Opis (PL) */}
          <Textarea
            label="Opis (PL)"
            name="descriptionPL"
            value={formData.descriptionPL}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Opis (EN) */}
          <Textarea
            label="Opis (EN)"
            name="descriptionEN"
            value={formData.descriptionEN}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Data wydania */}
          <Input
            label="Data wydania"
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Wybór pliku */}
          <Input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            fullWidth
          />

          {/* Wydawca (Autocomplete) */}
          <div>
            {loadingPublishers ? (
              <Spinner size="sm" />
            ) : (
              <Autocomplete
                placeholder="Wpisz nazwę wydawnictwa..."
                value={selectedPublisherName}
                onValueChange={(val) => {
                  setSelectedPublisherName(val);
                  handlePublisherSelect(val);
                }}
              >
                {allPublishers.map((pub) => (
                  <AutocompleteItem
                    key={pub.publisherId}
                    value={pub.name}
                    onPress={() => {
                      setSelectedPublisherName(pub.name);
                      handlePublisherSelect(pub.name);
                    }}
                  >
                    {pub.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            )}
          </div>

          {selectedPublisherName && (
            <div className="mt-2">
              <Chip>{selectedPublisherName}</Chip>
            </div>
          )}

          {/* Autorzy (Autocomplete) */}
          <div>
            {loadingAuthors ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Autocomplete placeholder="Wpisz nazwisko autora...">
                  {authorOptionsLabels.map((label, index) => (
                    <AutocompleteItem
                      key={index}
                      value={label}
                      onPress={() => handleAuthorSelect(label)}
                    >
                      {label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedAuthors.map((author) => (
                    <Chip
                      key={author.authorId}
                      onClose={() => handleAuthorRemove(author.authorId)}
                    >
                      {`${author.firstName} ${author.lastName}`}
                    </Chip>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cena */}
          <Input
            label="Cena"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
            min="0"
            step="0.01"
          />

          {/* Cena promocyjna */}
          <Input
            label="Cena promocyjna"
            type="number"
            name="salePrice"
            value={formData.salePrice}
            onChange={handleChange}
            fullWidth
            required
            min="0"
            step="0.01"
          />

          <Button type="submit" color="success" fullWidth>
            {initialData ? "Zapisz zmiany" : "Dodaj produkt"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
