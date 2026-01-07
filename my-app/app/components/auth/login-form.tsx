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
import { loginSchema, type LoginData, type LoginResponse } from "~/models/auth/auth.models";
import { Spinner } from "../ui/spinner";
 
export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
 
  const from = location.state?.from?.pathname || "/";
 
  const { fetch, isLoadingRef, error } = useFetch<LoginResponse>();
 
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
 
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
 
  const onSubmit = async (data: LoginData) => {
    if (isLoadingRef.current) {
      return;
    }
 
    try {
      const apiUrl = getApiUrl("/users/login");
 
      const authResponse = await fetch(apiUrl, "POST", data);
 
      login(authResponse);
 
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      return;
    }
  };
 
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Вход в системата</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Потребителско име</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Потребителско име"
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
            Нямате акаунт?
            <Link to="/register" className="text-center text-blue-500">
              Регистрация
            </Link>
          </p>
          <Button
            className="w-full"
            type="submit"
            form="login-form"
            disabled={isLoadingRef.current}
          >
            {isLoadingRef.current && <Spinner />}
            Вход
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}