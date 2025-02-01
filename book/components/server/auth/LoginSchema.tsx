'use client';

import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';

export const useLoginSchema = () => {
  const { t, locale, translations } = useTranslation();

  return z.object({
    email: z.string().email(translations[locale].invalidEmail),
    password: z.string().min(6, translations[locale].passwordLength),
  });
};