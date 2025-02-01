// src/components/AddCategory.tsx

import React, { useState, useEffect } from "react";
import { Input, Button, Spacer } from "@nextui-org/react";
export type Category = {
    categoryId: number;
    nameEn: string;
    namePl: string;
    createdAt: string; // ISO string
  };
interface AddCategoryProps {
  initialData?: Category | null;
  onSubmit: (nameEn: string, namePl: string) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ initialData = null, onSubmit }) => {
  const [nameEn, setNameEn] = useState(initialData?.nameEn || "");
  const [namePl, setNamePl] = useState(initialData?.namePl || "");

  useEffect(() => {
    if (initialData) {
      setNameEn(initialData.nameEn);
      setNamePl(initialData.namePl);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nameEn, namePl);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nazwa (EN)"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        required
      />
      <Input
        label="Nazwa (PL)"
        value={namePl}
        onChange={(e) => setNamePl(e.target.value)}
        required
      />
      <Spacer y={1} />
      <Button type="submit" color="primary">
        {initialData ? "Aktualizuj Kategorię" : "Dodaj Kategorię"}
      </Button>
    </form>
  );
};

export default AddCategory;
