import { useState, useEffect, FC } from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useTranslation } from '@/hooks/useTranslation';
import { Category,Genre } from '@/types/types';


const categoryHeaders = [
    { id: 1, label: "GATUNKI KSIĄŻEK" },
    { id: 2, label: "SPECJALNE GATUNKI" },
    { id: 3, label: "LITERATURA I WIĘCEJ" },
    { id: 4, label: "POPULARNE GATUNKI" },
    { id: 5, label: "KLASYKA LITERATURY" },
];
const MegaMenu: FC = () => {
    const [open, setOpen] = useState(false);
    const [activeCatIndex, setActiveCatIndex] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingGenres, setLoadingGenres] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const router = useRouter();
    const lang = router.locale || "pl";
    // Fetch categories from the backend
    useEffect(() => {
        setLoading(true);
        
        fetch("http://localhost:8080/api/categories/categories", {
            headers: {
                "Accept-Language": lang, // Przekazujemy język do backendu
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch categories");
                return res.json();
            })
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [lang]); // Przeładowujemy po zmianie języka

    const fetchGenres = (categoryId: number) => {
        setLoadingGenres(true);
        fetch(`http://localhost:8080/api/categories/genres/${categoryId}`, {
            headers: {
                "Accept-Language": lang,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch genres");
                return res.json();
            })
            .then((data) => {
                setGenres(data);
                setLoadingGenres(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoadingGenres(false);
            });
    };

    const toggleMenu = () => {
        setOpen((prev) => !prev);
        if (open) {
            setActiveCatIndex(null);
            setGenres([]);
        }
    };

    const handleCategoryClick = (index: number, categoryId: number) => {
        if (activeCatIndex === index) {
            setActiveCatIndex(null);
            setGenres([]);
        } else {
            setActiveCatIndex(index);
            fetchGenres(categoryId); // Fetch genres for the selected category
        }
    };
    // Helper function to split genres into chunks of 10
    const chunkGenres = (genres: Genre[], size: number) => {
        const chunks = [];
        for (let i = 0; i < genres.length; i += size) {
            chunks.push(genres.slice(i, i + size));
        }
        return chunks;
    };
    const handleGenreClick = (genreId: number) => {
        // Redirect to search page with the genre ID as a query parameter
        router.push(`/search?genreId=${genreId}`);
        setOpen(false);
        setActiveCatIndex(null);
        setGenres([]);
    };
    return (
        <div className="bg-black text-white relative">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
                {/* Left Column: "All Categories" Button */}
                <div className="relative">
                    <Button
                        onPress={toggleMenu}
                        className="flex items-center space-x-2 font-semibold hover:opacity-80 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={open}
                    >
                        <span>{t("allCategories")}</span>
                        {open ? (
                            <FaChevronDown className="w-4 h-4 ml-2 transition-transform duration-200" />
                        ) : (
                            <FaChevronRight className="w-4 h-4 ml-2 transition-transform duration-200" />
                        )}
                    </Button>

                    {open && (
                        <div className="absolute left-0 top-full z-50 mt-2 bg-white text-black shadow-lg rounded-lg transition-all duration-300">
                            <div className="flex relative p-2">
                                {/* Categories List */}
                                <div className="p-4 w-[200px] flex-none flex flex-col rounded-lg">
                                    {loading && <p className="text-sm text-gray-600">{t("loading")}...</p>}
                                    {error && <p className="text-sm text-red-600">{t("error")}: {error}</p>}

                                    {!loading && !error &&
                                        categories.map((cat, index) => (
                                            <div
                                                key={cat.id}
                                                className={`flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded transition-all duration-200 ${activeCatIndex === index ? 'bg-gray-100' : ''
                                                    }`}
                                                onClick={() => handleCategoryClick(index, cat.id)}
                                            >
                                                <span className="text-sm font-medium text-gray-900">
                                                    {cat.name}
                                                </span>
                                                <FaChevronRight className="w-4 h-4 text-gray-600 ml-2" />
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* Genres Submenu */}
                                {activeCatIndex !== null && (
                                    <div className="absolute left-full z-50 top-0 ml-2 min-w-[600px] max-w-[800px] bg-white text-black p-6 shadow-lg rounded-lg transition-all duration-300">
                                        {loadingGenres && <p className="text-sm text-gray-600">{t("loadingGenres")}...</p>}
                                        {error && <p className="text-sm text-red-600">{t("error")}: {error}</p>}
                                        {!loadingGenres && genres.length > 0 && (
                                            <>
                                                {/* Dynamic Header */}
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {categoryHeaders[activeCatIndex]?.label || "GATUNKI"}
                                                </h3>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {chunkGenres(genres, 17).map((chunk, colIndex) => (
                                                        <div key={colIndex} className="space-y-2">
                                                            {chunk.map((genre) => (
                                                                <div
                                                                    key={genre.genreId}
                                                                    onClick={() => handleGenreClick(genre.genreId)}
                                                                    className="text-sm text-gray-600 hover:underline cursor-pointer"
                                                                >
                                                                    {genre.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Example Links */}
                <ul className="flex items-center space-x-6 text-sm font-medium">
                    <li>
                        <Link href="#" className="hover:opacity-80 transition-opacity duration-200">
                            Prezent
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:opacity-80 transition-opacity duration-200">
                            {t("promotion")}
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:opacity-80 transition-opacity duration-200">
                            Top 100
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:opacity-80 transition-opacity duration-200">
                            {t("new")}
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:opacity-80 transition-opacity duration-200">
                            Outlet
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MegaMenu;
