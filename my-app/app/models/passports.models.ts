import { z } from 'zod'
import type { PaginatedData } from './paginated-data/paginated-data.models'

export type Passport = {
  id: number
  name: string
  model: string
  serialPrefix: string
  fromSerialNumber: number
  toSerialNumber: number
  warrantyMonths: number
}

export const passportFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Името е задължително.' })
      .max(255, { message: 'Името трябва да е до 255 символа.' }),
    model: z
      .string()
      .min(1, { message: 'Моделът е задължителен.' })
      .max(255, { message: 'Моделът трябва да е до 255 символа.' }),
    serialPrefix: z
      .string()
      .min(1, { message: 'Серийният префикс е задължителен.' })
      .max(50, { message: 'Серийният префикс трябва да е до 50 символа.' }),
    fromSerialNumber: z.coerce
      .number<string>({ message: 'Трябва да е число.' })
      .int({ message: 'Трябва да е цяло число.' })
      .nonnegative({ message: 'Трябва да е положително число.' }),
    toSerialNumber: z.coerce
      .number<string>({ message: 'Трябва да е число.' })
      .int({ message: 'Трябва да е цяло число.' })
      .nonnegative({ message: 'Трябва да е положително число.' }),
    warrantyMonths: z.coerce
      .number<string>({ message: 'Трябва да е число.' })
      .int({ message: 'Трябва да е цяло число.' })
      .nonnegative({ message: 'Трябва да е положително число.' }),
  })
  .refine((data) => data.toSerialNumber >= data.fromSerialNumber, {
    message:
      'Крайният сериен номер трябва да е по-голям или равен на началния.',
    path: ['toSerialNumber'],
  })

export type PassportFormData = z.infer<typeof passportFormSchema>

export type PassportsIndexResponse = PaginatedData<Passport>
export type PassportDetailsResponse = Passport
