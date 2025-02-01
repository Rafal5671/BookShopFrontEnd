import { useRouter } from 'next/router';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locale, locales, pathname, query } = router;

  const changeLanguage = (lang: string) => {
    const scrollPosition = window.scrollY;

    router.push(
      {
        pathname: pathname,
        query: query,
      },
      undefined,
      { locale: lang, shallow: true }
    ).then(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          <FaGlobe className="mr-2" />
          {locale === 'en' ? 'English' : 'Polski'}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language Menu"
        onAction={(key) => changeLanguage(key as string)}
      >
        <DropdownItem key="en" className="hover:bg-blue-500 hover:text-white">
          English
        </DropdownItem>
        <DropdownItem key="pl" className="hover:bg-blue-500 hover:text-white">
          Polski
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
