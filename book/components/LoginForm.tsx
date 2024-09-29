import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Input, Button, Spacer, Card } from '@nextui-org/react';
import { useTranslation } from '../hooks/useTranslation';
import { useEffect, useState } from 'react';

const LoginForm: React.FC = () => {
  const { t, locale, translations } = useTranslation();

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

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Here you can add login logic
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
          <Button className="bg-gray-500" type="submit" size="lg" fullWidth>
            {t('login')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
