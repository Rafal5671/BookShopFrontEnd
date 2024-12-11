import { useRouter } from "next/router";

import en from "../public/locales/en/common.json";
import pl from "../public/locales/pl/common.json";

const translations = { en, pl };

type TranslationKeys = keyof typeof en;

export const useTranslation = () => {
  const { locale } = useRouter();
  const t = (key: TranslationKeys): string => {
    return translations[locale as "en" | "pl"][key] || key;
  };

  return { t, locale, translations };
};
