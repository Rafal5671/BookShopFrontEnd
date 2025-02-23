"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Button,
  Card,
  Input,
  Textarea,
  Spinner,
  Chip,
  Select,
  Autocomplete,
  AutocompleteItem,
  SelectItem,
} from "@nextui-org/react";
import { useAuth } from "@/hooks/useAuth";
import {
  createProductServer,
  fetchAuthorsServer,
  fetchPublishersServer,
  updateProductServer,
} from "../server/admin/products/actions";
import { Genre } from "@/types/types";

interface Category {
  categoryId: number;
  namePl: string;
}

interface Publisher {
  publisherId: number;
  name: string;
}

interface Author {
  authorId: number;
  firstName: string;
  lastName: string;
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
  category?: string;
  species?: string;
  genres?: string[];
  stock?: number;
};

interface AddProductProps {
  initialData?: Product;
  onSubmit: (data: any) => void;
  categories: Category[];
  genres: Genre[];
}

export default function AddProduct({
  initialData,
  onSubmit,
  categories,
  genres,
}: AddProductProps) {
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
    category: "",
    genres: [] as string[],
    stockQuantity: "",
    pagesCount: "",
    coverType: "",
  });

  const [allPublishers, setAllPublishers] = useState<Publisher[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [loadingPublishers, setLoadingPublishers] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedPublisherName, setSelectedPublisherName] = useState("");

  const { token } = useAuth();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!initialData) return;

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
      salePrice: initialData.discountPrice ? initialData.discountPrice.toString() : "",
      publisherId: initialData.publisher?.publisherId?.toString() || "",
      authorsIds: initialData.authors?.map((a) => a.authorId) || [],
      category: initialData.category || "",
      genres:[],
      stockQuantity: initialData.stock ? initialData.stock.toString() : "",
      pagesCount: initialData.pagesCount ? initialData.pagesCount.toString() : "",
      coverType: initialData.coverType || "HARD",
    });

    setSelectedAuthors(initialData.authors || []);
    setImageUrl(initialData.imageUrl || "");
    setSelectedPublisherName(initialData.publisher?.name || "");
  }, [initialData]);

  useEffect(() => {
    if (!token) {
      console.error("Brak tokenu uwierzytelniającego (publishers).");
      return;
    }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublisherSelect = (selectedLabel: string) => {
    const pub = allPublishers.find((p) => p.name === selectedLabel);
    if (pub) {
      setFormData((prev) => ({
        ...prev,
        publisherId: pub.publisherId.toString(),
      }));
    }
  };

  const handleAuthorSelect = (selectedLabel: string) => {
    const author = allAuthors.find(
      (a) => `${a.firstName} ${a.lastName}` === selectedLabel
    );
    if (author && !selectedAuthors.some((a) => a.authorId === author.authorId)) {
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

  const handleGenreSelect = (selectedLabel: string) => {
    if (!selectedLabel || selectedLabel.trim() === "") return;
    const genre = genres.find((g) => g.name === selectedLabel);
    if (genre && !selectedGenres.some((g) => g.genreId === genre.genreId)) {
      setSelectedGenres((prev) => [...prev, genre]);
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, genre.genreId.toString()],
      }));
    }
  };

  const handleGenreRemove = (genreId: number) => {
    setSelectedGenres((prev) => prev.filter((g) => g.genreId !== genreId));
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((id) => Number(id) !== genreId),
    }));
  };

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
      let uploadedImageUrl = imageUrl;
      if (selectedFile) {
        uploadedImageUrl = await uploadImage(selectedFile);
        setImageUrl(uploadedImageUrl);
      }
      
      const cleanedGenres = formData.genres.filter((g) => g != null && g !== "");

      const requestBody = {
        ...formData,
        publisherId: Number(formData.publisherId),
        authorsIds: formData.authorsIds,
        imageUrl: uploadedImageUrl,
        category: Number(formData.category),
        genres: cleanedGenres.map(Number),
        stockQuantity: Number(formData.stockQuantity),
        pagesCount: Number(formData.pagesCount),
        coverType: formData.coverType,
      };
      console.log(requestBody);
      startTransition(async () => {
        let updatedData;
        if (initialData) {
          updatedData = await updateProductServer(initialData.bookId, requestBody);
          alert("Produkt został zaktualizowany!");
        } else {
          updatedData = await createProductServer(requestBody);
          alert("Produkt został dodany!");
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
            category: "",
            genres: [],
            coverType: "",
            stockQuantity: "",
            pagesCount: "",
          });
          setSelectedAuthors([]);
          setSelectedGenres([]);
          setSelectedFile(null);
          setImageUrl("");
          setSelectedPublisherName("");
        }
        onSubmit?.(updatedData);
      });
    } catch (error) {
      console.error(
        `Error ${initialData ? "updating" : "submitting"} product:`,
        error
      );
      alert(
        `Wystąpił błąd podczas ${initialData ? "aktualizacji" : "dodawania"} produktu.`
      );
    }
  };

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

          {/* Kategoria (NextUI Select) */}
          <div>
            <Select
              label="Kategoria"
              placeholder="Wybierz kategorię"
              selectedKeys={new Set([formData.category])}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFormData((prev) => ({ ...prev, category: selectedKey as string }));
              }}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.namePl}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Gatunki (Autocomplete + Chipy) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gatunki
            </label>
            <Autocomplete placeholder="Wpisz nazwę gatunku...">
              {genres.map((genre) => (
                <AutocompleteItem
                  key={genre.genreId}
                  value={genre.name}
                  onPress={() => handleGenreSelect(genre.name)}
                >
                  {genre.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <Chip key={genre.genreId} onClose={() => handleGenreRemove(genre.genreId)}>
                  {genre.name}
                </Chip>
              ))}
            </div>
          </div>

          {/* Okładka (NextUI Select) */}
          <Select
            label="Okładka"
            placeholder="Wybierz typ okładki"
            selectedKeys={new Set([formData.coverType])}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setFormData((prev) => ({ ...prev, coverType: selectedKey as string }));
            }}
          >
            <SelectItem key="HARD" value="HARD">
              Twarda
            </SelectItem>
            <SelectItem key="SOFT" value="SOFT">
              Miękka
            </SelectItem>
          </Select>

          {/* Ilość w magazynie */}
          <Input
            label="Ilość w magazynie"
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            fullWidth
            required
            min="0"
          />

          {/* Ilość stron */}
          <Input
            label="Ilość stron"
            type="number"
            name="pagesCount"
            value={formData.pagesCount}
            onChange={handleChange}
            fullWidth
            required
            min="1"
          />

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
