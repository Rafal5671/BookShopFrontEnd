'use client';

import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Input, Button, Spacer, Card, Divider } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { handleLogin } from '../../server/auth/LoginApi';
import { useLoginSchema } from '../../server/auth/LoginSchema';
import { useTranslation } from '@/hooks/useTranslation';
import { LoginData } from '@/types/types';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  showGuestOrderButton?: boolean;
  onGuestOrder?: () => void;
  handleLoginOn?: () => void;
}

interface User {
  email: string;
  role:string;
}

const LoginForm = ({ showGuestOrderButton = false, onGuestOrder, handleLoginOn }: LoginFormProps) => {
  const { t } = useTranslation();
  const schema = useLoginSchema();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginData>({ resolver: zodResolver(schema) as Resolver<LoginData> });

  const [user, setUser] = useState<User | null>(null);
  const { login } = useAuth();
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const { userEmail, userRole, accessToken, refreshToken } = await handleLogin(data);
      
      if (accessToken && userEmail && userRole) {
        // Zapisz token i rolę w kontekście (AuthProvider zajmie się też zapisem w localStorage)
        login(accessToken, userRole);
          
        // Opcjonalnie zapisujemy refreshToken
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
  
        if (showGuestOrderButton && handleLoginOn) {
          handleLoginOn();
          router.push('/delivery');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
    }
  };
  

  return (
    <div className="h-auto flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-lg rounded-xl bg-primary-100">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <h1 className="text-3xl font-semibold text-center mb-2">{t("loginFormTitle")}</h1>
          <Input
            size="lg"
            label={t("email")}
            variant="faded"
            labelPlacement="outside"
            placeholder={t("email")}
            startContent={<FaEnvelope />}
            {...register('email')}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            size="lg"
            label={t("password")}
            variant="faded"
            labelPlacement="outside"
            type="password"
            placeholder={t("password")}
            startContent={<FaLock />}
            {...register('password')}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Spacer y={1.5} />
          <Button className="bg-primary-200" type="submit" size="lg" fullWidth>
            {t("login")}
          </Button>
          {showGuestOrderButton && (
            <>
              <Spacer y={2} />
              <Divider />
              <Spacer y={2} />
              <Button
                onPress={onGuestOrder}
                className="bg-primary-200"
                size="lg"
                fullWidth
              >
                {t("guestOrder")}
              </Button>
            </>
          )}
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
