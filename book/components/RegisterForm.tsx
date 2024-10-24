import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEnvelope, FaLock, FaPhone, FaIdCard } from "react-icons/fa";
import { Input, Button, Spacer, Checkbox, Card } from "@nextui-org/react";
import { useTranslation } from "../hooks/useTranslation";
import { useEffect, useState } from "react";

const RegisterForm: React.FC = () => {
  const { t, locale, translations } = useTranslation();

  const [schema, setSchema] = useState(() =>
    z
      .object({
        firstName: z.string().min(1, t("requiredName")),
        lastName: z.string().min(1, t("requiredLastName")),
        phone: z.string().regex(/^\d+$/, t("invalidPhoneNumber")),
        email: z.string().email(t("invalidEmail")),
        password: z.string().min(6, t("passwordLength")),
        confirmPassword: z.string().min(6, t("passwordLength")),
        terms: z
          .literal(true, { invalid_type_error: t("termsAndConditions") })
          .refine((val) => val === true, { message: t("termsAndConditions") }),
        dataProcessing: z
          .literal(true, { invalid_type_error: t("dataProcessing") })
          .refine((val) => val === true, { message: t("dataProcessing") }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t("passwordMatch"),
        path: ["confirmPassword"],
      })
  );

  useEffect(() => {
    setSchema(() =>
      z
        .object({
          firstName: z
            .string()
            .min(1, translations[locale as "en" | "pl"].requiredName),
          lastName: z
            .string()
            .min(1, translations[locale as "en" | "pl"].requiredLastName),
          phone: z
            .string()
            .regex(
              /^\d+$/,
              translations[locale as "en" | "pl"].invalidPhoneNumber
            ),
          email: z
            .string()
            .email(translations[locale as "en" | "pl"].invalidEmail),
          password: z
            .string()
            .min(6, translations[locale as "en" | "pl"].passwordLength),
          confirmPassword: z
            .string()
            .min(6, translations[locale as "en" | "pl"].passwordLength),
          terms: z
            .literal(true, {
              invalid_type_error:
                translations[locale as "en" | "pl"].termsAndConditions,
            })
            .refine((val) => val === true, {
              message: translations[locale as "en" | "pl"].termsAndConditions,
            }),
          dataProcessing: z
            .literal(true, {
              invalid_type_error:
                translations[locale as "en" | "pl"].dataProcessing,
            })
            .refine((val) => val === true, {
              message: translations[locale as "en" | "pl"].dataProcessing,
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: translations[locale as "en" | "pl"].passwordMatch,
          path: ["confirmPassword"],
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
    // Here you can add registration logic
  };

  return (
    <div className="h-auto flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 shadow-lg rounded-xl bg-primary-100">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <h1 className="text-3xl font-semibold text-center mb-2">{t("registerFormTitle")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                size="lg"
                label={t("firstName")}
                variant="faded"
                labelPlacement="outside"
                placeholder={t("firstName")}
                startContent={<FaIdCard />}
                {...register("firstName")}
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName ? errors.firstName.message : ""}
              />
            </div>
            <div>
              <Input
                size="lg"
                label={t("lastName")}
                variant="faded"
                labelPlacement="outside"
                placeholder={t("lastName")}
                startContent={<FaIdCard />}
                {...register("lastName")}
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName ? errors.lastName.message : ""}
              />
            </div>
            <div>
              <Input
                size="lg"
                label={t("phone")}
                variant="faded"
                labelPlacement="outside"
                placeholder={t("phone")}
                startContent={<FaPhone />}
                {...register("phone")}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone ? errors.phone.message : ""}
              />
            </div>
            <div>
              <Input
                size="lg"
                label={t("email")}
                variant="faded"
                labelPlacement="outside"
                placeholder={t("email")}
                startContent={<FaEnvelope />}
                {...register("email")}
                isInvalid={!!errors.email}
                errorMessage={errors.email ? errors.email.message : ""}
              />
            </div>
            <div>
              <Input
                size="lg"
                label={t("password")}
                variant="faded"
                labelPlacement="outside"
                type="password"
                placeholder={t("password")}
                startContent={<FaLock />}
                {...register("password")}
                isInvalid={!!errors.password}
                errorMessage={errors.password ? errors.password.message : ""}
              />
            </div>
            <div>
              <Input
                size="lg"
                label={t("confirmPassword")}
                variant="faded"
                labelPlacement="outside"
                type="password"
                placeholder={t("confirmPassword")}
                startContent={<FaLock />}
                {...register("confirmPassword")}
                isInvalid={!!errors.confirmPassword}
                errorMessage={
                  errors.confirmPassword ? errors.confirmPassword.message : ""
                }
              />
            </div>
          </div>
          <Spacer y={0.5} />
          <div>
            <Checkbox
              {...register("terms")}
              isInvalid={!!errors.terms}
              color="success"
            >
              {t("termsAndConditions")}
            </Checkbox>
          </div>
          <div>
            <Checkbox
              {...register("dataProcessing")}
              isInvalid={!!errors.dataProcessing}
              color="success"
            >
              {t("dataProcessing")}
            </Checkbox>
          </div>
          <Spacer y={1.5} />
          <Button className="bg-primary-500" type="submit" size="lg" fullWidth>
            {t("register")}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;
