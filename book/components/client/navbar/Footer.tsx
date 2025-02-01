import { Link } from "@nextui-org/react";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary-200 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sekcja o księgarni */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t("aboutBookstoreTitle")}</h4>
            <p className="text-white">
              {t("aboutBookstoreDescription")}
            </p>
          </div>

          {/* Sekcja z linkami */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t("usefulLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white">
                  {t("homePage")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-white">
                  {t("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Sekcja kontaktowa */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t("contactTitle")}</h4>
            <p className="text-white">
              <strong>{t("email")}:</strong> info@ksiegarnia.pl
              <br />
              <strong>{t("phone")}:</strong> +48 123 456 789
              <br />
              <strong>{t("address")}:</strong> ul. Książkowa 123, 00-001 Warszawa
            </p>
          </div>
        </div>

        <div className="mt-10 text-center border-t border-gray-700 pt-4">
          <p className="text-white">
            © {new Date().getFullYear()} {t("bookstoreName")}. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
