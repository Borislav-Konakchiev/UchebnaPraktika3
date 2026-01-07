import { z } from "zod";
import type { User } from "../user.models";
 
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Потребителското име е задължително." }),
  password: z.string().min(4, { message: "Паролата трябва да е поне 4 символа." }),
});
 
export type LoginData = z.infer<typeof loginSchema>;
 
export type LoginResponse = {
  user: User;
  token: string;
};
 
export type RegistrationRequest = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  purchaseDate: string; 
  deviceSerialNumber: string;
};
export type RegistrationResponse = {
  user: User;
  token: string;
};
export const registrationSchema = z.object({
  fullName: z.string().min(1, { message: "Пълното име е задължително." }),
  password: z.string().min(4, { message: "Паролата трябва да е поне 4 символа." }),
  email: z.string().email({ message: "Невалиден имейл адрес." }),
  phone: z.string().min(5, { message: "Телефонният номер е задължителен." }),
  address: z.string().min(5, { message: "Адресът е задължителен." }),
  purchaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Невалидна дата на покупка.",
  }),
  deviceSerialNumber: z.string().min(1, { message: "Сериен номер на устройството е задължителен." }),
});
 
export type RegistrationData = z.infer<typeof registrationSchema>;