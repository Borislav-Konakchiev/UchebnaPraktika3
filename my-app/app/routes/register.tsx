import { RegisterForm } from "~/components/auth/register-form";
import type { Route } from "./+types/register";
 
export function meta({}: Route.MetaArgs) {
  return [{ title: "React Router App" }, { name: "description", content: "Register page" }];
}
 
export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterForm />
    </div>
  );
}