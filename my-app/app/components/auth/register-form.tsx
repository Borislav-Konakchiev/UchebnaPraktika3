import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "./auth-provider";
import { useEffect } from "react";
import useFetch from "~/lib/hooks/use-fetch.hook";
import { getApiUrl } from "~/lib/utils";
import {
  registrationSchema,
  type RegistrationData,
  type RegistrationResponse,
} from "~/models/auth/auth.models";
import { Spinner } from "../ui/spinner";
 
export function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
 
  const from = location.state?.from?.pathname || "/";
 
  const { fetch, isLoadingRef, error } = useFetch<RegistrationResponse>();
 
  const today = new Date().toISOString().slice(0, 10);
 
  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      purchaseDate: today,
      deviceSerialNumber: "",
      password: "",
    },
  });
 
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
 
  const onSubmit = async (data: RegistrationData) => {
    if (isLoadingRef.current) {
      return;
    }
 
    try {
      const apiUrl = getApiUrl("/users/registration");
 
      await fetch(apiUrl, "POST", data);
 
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      return;
    }
  };
 
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Регистрация в системата</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fullName">Пълно име</FieldLabel>
                  <Input
                    {...field}
                    id="fullName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Пълно име"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Имейл</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Имейл"
                    type="email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Телефон</FieldLabel>
                  <Input
                    {...field}
                    id="phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="Телефон"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Адрес</FieldLabel>
                  <Input
                    {...field}
                    id="address"
                    aria-invalid={fieldState.invalid}
                    placeholder="Адрес"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="purchaseDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="purchaseDate">Дата на покупка</FieldLabel>
                  <Input
                    {...field}
                    id="purchaseDate"
                    aria-invalid={fieldState.invalid}
                    type="date"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="deviceSerialNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="deviceSerialNumber">Сериен номер на устройството</FieldLabel>
                  <Input
                    {...field}
                    id="deviceSerialNumber"
                    aria-invalid={fieldState.invalid}
                    placeholder="Сериен номер"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Парола</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Парола"
                    type="password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
 
          {error && <p className="text-sm text-red-500 text-center">{error.message}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical">
          <p className="text-sm justify-center flex gap-1">
            Вече имате акаунт?
            <Link to="/login" className="text-center text-blue-500">
              Вход
            </Link>
          </p>
          <Button
            className="w-full"
            type="submit"
            form="register-form"
            disabled={isLoadingRef.current}
          >
            {isLoadingRef.current && <Spinner />}
            Регистрация
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}