import { useRouter } from 'next/router';
import { Button, ButtonGroup } from '@nextui-org/react';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <ButtonGroup>
      <Button
        color={locale === 'en' ? 'primary' : 'default'}
        onClick={() => changeLanguage('en')}
        className={`${
          locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        English
      </Button>
      <Button
        color={locale === 'pl' ? 'primary' : 'default'}
        onClick={() => changeLanguage('pl')}
        className={`${
          locale === 'pl' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        Polski
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
