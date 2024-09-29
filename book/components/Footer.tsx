import { Link } from "@nextui-org/react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sekcja o księgarni */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">O naszej księgarni</h4>
            <p className="text-gray-400">
              Jesteśmy pasjonatami książek, oferujemy szeroki wybór literatury, od klasyków po nowości. Znajdziesz tu książki dla każdego.
            </p>
          </div>

          {/* Sekcja z linkami */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Przydatne linki</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" color="primary">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link href="/about" color="primary">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/contact" color="primary">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/policy" color="primary">
                  Polityka prywatności
                </Link>
              </li>
            </ul>
          </div>

          {/* Sekcja kontaktowa */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Kontakt</h4>
            <p className="text-gray-400">
              <strong>Email:</strong> info@ksiegarnia.pl
              <br />
              <strong>Telefon:</strong> +48 123 456 789
              <br />
              <strong>Adres:</strong> ul. Książkowa 123, 00-001 Warszawa
            </p>
          </div>
        </div>

        <div className="mt-10 text-center border-t border-gray-700 pt-4">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Księgarnia. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
