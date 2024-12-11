import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Input, Button, Spacer, Card,Divider } from '@nextui-org/react';
import { useTranslation } from '../hooks/useTranslation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

interface LoginFormProps {
  showGuestOrderButton?: boolean;
  onGuestOrder?: () => void;
  handleLoginOn?:() => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ showGuestOrderButton = false, onGuestOrder,handleLoginOn}) => {
  const { t, locale, translations } = useTranslation();
  const router = useRouter();
  const [schema, setSchema] = useState(
    () =>
      z.object({
        email: z.string().email(t('invalidEmail')),
        password: z.string().min(6, t('passwordLength')),
      })
  );

  useEffect(() => {
    setSchema(
      () =>
        z.object({
          email: z.string().email(translations[locale as 'en' | 'pl'].invalidEmail),
          password: z.string().min(6, translations[locale as 'en' | 'pl'].passwordLength),
        })
    );
  }, [locale, translations]);

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  useEffect(() => {
    reset();
  }, [locale, reset]);

  const [user, setUser] = useState<any>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:8080/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Logowanie nie powiodło się');
      }

      const result = await response.json();

      // Oczekujemy, że serwer zwróci token JWT w polu 'token'
      const token = result.token;

      if (token) {
        // Zapisz token w localStorage
        localStorage.setItem('authToken', token);
        console.log('Użytkownik zalogowany, token JWT zapisany:', token);

        // Dekodowanie tokenu JWT
        const decodedToken = jwtDecode(token);
        console.log('Zdekodowany token:', decodedToken); // Zawartość tokenu

        // Jeśli token zawiera dane takie jak sub (subject), możemy je wydobyć
        const userEmail = decodedToken.sub;

        console.log('Email użytkownika:', userEmail);

        // Zapisz dane użytkownika w stanie
        setUser({ email: userEmail});

        // Po zalogowaniu możesz przekierować użytkownika
        if (showGuestOrderButton) {
          if (handleLoginOn) {
            handleLoginOn();
          }
          router.push('/delivery');
          
        } else {
          router.push('/');
        }
      } else {
        console.error('Brak tokenu w odpowiedzi');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      // Możesz wyświetlić komunikat o błędzie użytkownikowi
    }
};

  return (
    <div className="h-auto flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-lg rounded-xl bg-primary-100">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <h1 className="text-3xl font-semibold text-center mb-2">{t('loginFormTitle')}</h1>
          <div>
            <Input
              size="lg"
              label={t('email')}
              variant="faded"
              labelPlacement="outside"
              placeholder={t('email')}
              startContent={<FaEnvelope />}
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email ? errors.email.message : ''}
            />
          </div>
          <div>
            <Input
              size="lg"
              label={t('password')}
              variant="faded"
              labelPlacement="outside"
              type="password"
              placeholder={t('password')}
              startContent={<FaLock />}
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password ? errors.password.message : ''}
            />
          </div>
          <Spacer y={1.5} />
          <Button className="bg-primary-200" type="submit" size="lg" fullWidth>
            {t('login')}
          </Button>
          {showGuestOrderButton && (
            <>
            <Spacer y={2} /> {/* Space before the Divider */}
            <Divider /> {/* Divider line */}
            <Spacer y={2} /> {/* Space after the Divider */}
            <Button onClick={onGuestOrder}  className="bg-primary-200" size="lg" fullWidth>
              Zamów bez rejestracji
            </Button>
          </>
          )}
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
