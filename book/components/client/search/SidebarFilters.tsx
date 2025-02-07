import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Slider,
} from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";
import { Genre, Category, Author, Filters } from "@/types/types";

type SidebarFiltersProps = {
  genres: Genre[];
  categories: Category[];
  authors: Author[];
  currentFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  maxPrice: number;
};

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  genres,
  categories,
  authors,
  currentFilters,
  onApplyFilters,
  maxPrice,
}) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>(currentFilters.selectedGenres);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(currentFilters.selectedCategories);
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>(currentFilters.selectedAuthors);
  const [promotion, setPromotion] = useState<boolean>(currentFilters.freeShipping);
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentFilters.priceRange[0],
    maxPrice,
  ]);

  // Nowy stan do wyszukiwania autorów
  const [authorSearchTerm, setAuthorSearchTerm] = useState<string>("");

  useEffect(() => {
    setSelectedGenres(currentFilters.selectedGenres);
    setSelectedCategories(currentFilters.selectedCategories);
    setSelectedAuthors(currentFilters.selectedAuthors);
    setPromotion(currentFilters.freeShipping);
    setPriceRange([currentFilters.priceRange[0], maxPrice]);
  }, [currentFilters, maxPrice]);

  const handleApplyFilters = () => {
    onApplyFilters({ selectedGenres, selectedCategories, selectedAuthors, freeShipping: promotion, priceRange });
  };

  const handleResetFilters = () => {
    const defaultFilters: Filters = {
      selectedGenres: [],
      selectedCategories: [],
      selectedAuthors: [],
      freeShipping: false,
      priceRange: [0, maxPrice],
    };

    setSelectedGenres([]);
    setSelectedCategories([]);
    setSelectedAuthors([]);
    setPromotion(false);
    setPriceRange([0, maxPrice]);

    onApplyFilters(defaultFilters);
  };

  // Filtrowanie autorów na podstawie wpisanego tekstu
  const filteredAuthors = authors.filter((author) => {
    const fullName = `${author.firstName} ${author.lastName}`.toLowerCase();
    return fullName.includes(authorSearchTerm.toLowerCase());
  });

  return (
    <div className="w-[320px] p-6 bg-primary-100 rounded-2xl shadow-lg border border-gray-200">
      {/* Gatunki */}
      <Accordion variant="light" selectionMode="multiple">
        <AccordionItem title={t("genres")} className="py-2">
          <CheckboxGroup
            value={selectedGenres.map(String)}
            onChange={(values) => setSelectedGenres(values.map(Number))}
          >
            {genres.map((genre) => (
              <Checkbox
                key={genre.genreId}
                value={genre.genreId.toString()}
                color="warning"
                className="py-1"
              >
                {genre.name}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
        <AccordionItem title={t("categories")} className="py-2">
          <CheckboxGroup
            value={selectedCategories.map(String)}
            onChange={(values) => setSelectedCategories(values.map(Number))}
          >
            {categories.map((category) => (
              <Checkbox key={category.id} value={category.id.toString()} className="py-1" color="warning">
                {category.name}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
        <AccordionItem title={t("authorsss")} className="py-2">
          {/* Pole wyszukiwania autorów */}
          <div style={{ marginBottom: "8px" }}>
            <Input
              type="text"
              placeholder={t("Szukaj autora")}
              value={authorSearchTerm}
              onChange={(e) => setAuthorSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "4px" }}
            />
          </div>
          {/* Scrollowalny kontener z listą autorów */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <CheckboxGroup
              value={selectedAuthors.map(String)}
              onChange={(values) => setSelectedAuthors(values.map(Number))}
            >
              {filteredAuthors.map((author) => (
                <Checkbox
                  key={author.authorId}
                  value={author.authorId.toString()}
                  className="py-1"
                  color="warning"
                >
                  {author.firstName} {author.lastName}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </AccordionItem>
      </Accordion>

      {/* Darmowa dostawa */}
      <div className="mt-4">
        <Checkbox
          isSelected={promotion}
          onChange={() => setPromotion(!promotion)}
          icon={<FaCheck />}
          className="font-semibold"
          color="warning"
        >
          {t("promotion")}
        </Checkbox>
      </div>

      {/* Zakres cen */}
      <div className="mt-4">
        <p className="mb-2 font-semibold">{t("price")}</p>
        <Slider
          value={priceRange}
          step={10}
          minValue={0}
          maxValue={maxPrice}
          color="primary"
          onChange={(value) => setPriceRange(value as [number, number])}
        />
        <div className="flex justify-between text-sm">
          <span>{priceRange[0]} PLN</span>
          <span>{priceRange[1]} PLN</span>
        </div>
      </div>

      {/* Przyciski */}
      <div className="mt-6 flex space-x-3">
        <Button color="success" onPress={handleApplyFilters} className="w-full font-semibold">
          {t("apply")}
        </Button>
        <Button color="danger" variant="bordered" onPress={handleResetFilters} className="w-full font-semibold">
          {t("reset")}
        </Button>
      </div>
    </div>
  );
};

export default SidebarFilters;
