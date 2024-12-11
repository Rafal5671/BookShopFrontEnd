import { useState } from "react";
import { Checkbox, Slider, Accordion, Button, AccordionItem, CheckboxGroup } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";

export default function SidebarFilters() {
  const [priceRange, setPriceRange] = useState([0, 2999]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [freeShipping, setFreeShipping] = useState(false);

  const handleCategoryChange = (category) => {
    // handle category change logic here
  };

  return (
    <div className="w-[250px] p-4 bg-primary-100 rounded-md shadow-md">
      {/* Kategoria */}
      <Accordion>
  <AccordionItem title="Kategorie" className="py-2">
    <CheckboxGroup value={selectedCategories} onChange={handleCategoryChange}>
      <Checkbox value="Literatura">Literatura</Checkbox>
      <Checkbox value="Książki dla dzieci">Książki dla dzieci</Checkbox>
      <Checkbox value="Podręczniki">Podręczniki</Checkbox>
      <Checkbox value="Ebooki">Ebooki</Checkbox>
      <Checkbox value="Audiobooki">Audiobooki</Checkbox>
      <Checkbox value="Sztuka i kultura">Sztuka i kultura</Checkbox>
      <Checkbox value="Literatura obca">Literatura obca</Checkbox>
      <Checkbox value="Biografie">Biografie</Checkbox>
    </CheckboxGroup>
  </AccordionItem>
</Accordion>


      {/* Darmowa dostawa */}
      <div className="mt-4">
        <Checkbox
          isChecked={freeShipping}
          onChange={() => setFreeShipping(!freeShipping)}
          icon={<FaCheck />}
        >
          Darmowa dostawa
        </Checkbox>
      </div>

      {/* Zakres cen */}
      <div className="mt-4">
        <p>Cena</p>
        <Slider
          value={priceRange}
          onChange={setPriceRange}
          min={0}
          max={2999}
          step={1}
          color="primary"
        />
        <div className="flex justify-between text-sm">
          <span>{priceRange[0]} zł</span>
          <span>{priceRange[1]} zł</span>
        </div>
      </div>

      {/* Przyciski filtrów */}
      <div className="mt-6">
        <Button fullWidth color="secondary">
          Zastosuj filtry
        </Button>
      </div>
    </div>
  );
}
