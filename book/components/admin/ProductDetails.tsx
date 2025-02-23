// ProductDetails.tsx
import { Button, Card, CardBody, Input, Spacer, Textarea,Image } from "@nextui-org/react";
import React, { useState } from "react";
type Author = {
    authorId: number;
    firstName: string;
    lastName: string;
  };
  
  type Publisher = {
    publisherId: number;
    name: string;
  };
  
  type Genre = {
    genreId: number;
    name: string;
  };
  
  type Review = {
    reviewId: number;
    user: string;
    content: string;
    rating: number;
  };
  
  export enum CoverType {
    HARDCOVER = "HARDCOVER",
    PAPERBACK = "PAPERBACK",
  }
  
  export enum LanguageBook {
    POLISH = "POLISH",
    ENGLISH = "ENGLISH",

  }
  
  type Product = {
    bookId: number;
    titlePl: string;
    titleEn: string;
    originalTitle: string;
    imageUrl?: string;
    pagesCount: number;
    releaseDate: string; 
    price: number;
    discountPrice?: number;
    descriptionPl?: string;
    descriptionEn?: string;
    stock?: number;
    createdAt?: string;
    coverType?: CoverType;
    language?: LanguageBook;
    category?: { categoryId: number; name: string };
    species?: string;
    authors: Author[];
    publisher?: Publisher;
    genres?: Genre[];
    reviews: Review[];
  };
  
interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {

    console.log("Zapisano zmiany:", editedProduct);
    setIsEditing(false);
  };

  const renderDisplayMode = () => (
    <Card className="shadow-lg p-6 max-w-full">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-1/3">
          <Image
            src={product.imageUrl}
            alt={product.titlePl}
            className="object-cover rounded"
            width={400}
            height={300}
          />
        </div>
        <div className="sm:w-2/3 space-y-2">
          <h2 className="text-2xl font-bold">{product.titlePl}</h2>
          <p><strong>ID:</strong> {product.bookId}</p>
          <p><strong>Tytuł oryginalny:</strong> {product.originalTitle}</p>
          <p><strong>Tytuł EN:</strong> {product.titleEn}</p>
          <p><strong>Cena:</strong> {product.price} zł</p>
          {product.discountPrice && (
            <p><strong>Cena promocyjna:</strong> {product.discountPrice} zł</p>
          )}
          <p><strong>Kategoria:</strong> {product.category?.name || "Brak danych"}</p>
          <p><strong>Opis PL:</strong> {product.descriptionPl || "Brak danych"}</p>
          <p><strong>Opis EN:</strong> {product.descriptionEn || "Brak danych"}</p>
          <p><strong>Ilość w magazynie:</strong> {product.stock ?? "Brak danych"}</p>
          <p><strong>Data utworzenia:</strong> {product.createdAt || "Brak danych"}</p>
          <p>
            <strong>Autorzy:</strong>{" "}
            {product.authors.length > 0
              ? product.authors.map(a => `${a.firstName} ${a.lastName}`).join(", ")
              : "Brak danych"}
          </p>
          <p><strong>Wydawnictwo:</strong> {product.publisher?.name || "Brak danych"}</p>
          <p><strong>Liczba stron:</strong> {product.pagesCount}</p>
          <p><strong>Typ okładki:</strong> {product.coverType || "Brak danych"}</p>
          <p><strong>Język książki:</strong> {product.language || "Brak danych"}</p>
          <p><strong>Data wydania:</strong> {product.releaseDate || "Brak danych"}</p>
          <p>
            <strong>Gatunki:</strong>{" "}
            {product.genres && product.genres.length > 0
              ? product.genres.map(g => g.name).join(", ")
              : "Brak danych"}
          </p>
          <Spacer y={1} />
          <div>
            <strong>Opinie:</strong>
            {product.reviews && product.reviews.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                {product.reviews.map(review => (
                  <li key={review.reviewId}>
                    <em>{review.user}:</em> {review.content} (ocena: {review.rating})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak opinii</p>
            )}
          </div>
          <Spacer y={1} />
          <Button onClick={handleEditClick}>Edytuj</Button>
        </div>
      </div>
    </Card>
  );

  const renderEditMode = () => (
    <Card className="shadow-lg p-6 max-w-full">
      <form className="space-y-4">
        <Input
          label="Tytuł (PL)"
          value={editedProduct.titlePl}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, titlePl: e.target.value })
          }
          fullWidth
        />
        <Input
          label="Tytuł (EN)"
          value={editedProduct.titleEn}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, titleEn: e.target.value })
          }
          fullWidth
        />
        <Input
          label="Tytuł oryginalny"
          value={editedProduct.originalTitle}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, originalTitle: e.target.value })
          }
          fullWidth
        />
        <Textarea
          label="Opis (PL)"
          value={editedProduct.descriptionPl}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, descriptionPl: e.target.value })
          }
          fullWidth
        />
        <Textarea
          label="Opis (EN)"
          value={editedProduct.descriptionEn}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, descriptionEn: e.target.value })
          }
          fullWidth
        />
        {/* Dodaj kolejne pola formularza w razie potrzeby */}
        <Button onClick={handleSaveClick} color="success">
          Zapisz
        </Button>
      </form>
    </Card>
  );

  return (
    <div className="p-8">
      {isEditing ? renderEditMode() : renderDisplayMode()}
    </div>
  );
};

export default ProductDetails;