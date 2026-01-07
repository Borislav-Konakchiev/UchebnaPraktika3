import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'
import { Skeleton } from '../ui/skeleton'
import {
  passportFormSchema,
  type Passport,
  type PassportFormData,
} from '~/models/passports.models'

export type PassportFormProps = {
  passport?: Passport
  isLoading?: boolean
  error?: string
  onSubmit: (data: PassportFormData) => void | Promise<void>
  onCancel?: () => void
}

export function PassportForm({
  passport,
  isLoading = false,
  error,
  onSubmit,
  onCancel,
}: PassportFormProps) {
  const isEditMode = !!passport

  const form = useForm({
    resolver: zodResolver(passportFormSchema),
    defaultValues: passport
      ? {
          name: passport.name,
          model: passport.model,
          serialPrefix: passport.serialPrefix,
          fromSerialNumber: String(passport.fromSerialNumber),
          toSerialNumber: String(passport.toSerialNumber),
          warrantyMonths: String(passport.warrantyMonths),
        }
      : {
          name: '',
          model: '',
          serialPrefix: '',
          fromSerialNumber: '',
          toSerialNumber: '',
          warrantyMonths: '',
        },
  })

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-2xl'>
          {isEditMode ? 'Редактиране на паспорт' : 'Създаване на паспорт'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id='passport-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Име</FieldLabel>
                  <Input
                    {...field}
                    id='name'
                    aria-invalid={fieldState.invalid}
                    placeholder='Име на паспорта'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='model'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='model'>Модел</FieldLabel>
                  <Input
                    {...field}
                    id='model'
                    aria-invalid={fieldState.invalid}
                    placeholder='Модел'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='serialPrefix'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='serialPrefix'>Сериен префикс</FieldLabel>
                  <Input
                    {...field}
                    id='serialPrefix'
                    aria-invalid={fieldState.invalid}
                    placeholder='Сериен префикс'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Controller
                name='fromSerialNumber'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='fromSerialNumber'>
                      От сериен номер
                    </FieldLabel>
                    <Input
                      {...field}
                      id='fromSerialNumber'
                      type='number'
                      aria-invalid={fieldState.invalid}
                      placeholder='0'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='toSerialNumber'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='toSerialNumber'>
                      До сериен номер
                    </FieldLabel>
                    <Input
                      {...field}
                      id='toSerialNumber'
                      type='number'
                      aria-invalid={fieldState.invalid}
                      placeholder='0'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name='warrantyMonths'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='warrantyMonths'>
                    Гаранция (месеци)
                  </FieldLabel>
                  <Input
                    {...field}
                    id='warrantyMonths'
                    type='number'
                    aria-invalid={fieldState.invalid}
                    placeholder='0'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {error && (
            <p className='text-sm text-red-500 text-center mt-4'>{error}</p>
          )}
        </form>
      </CardContent>
      <CardFooter className='flex gap-2 justify-end'>
        {onCancel && (
          <Button type='button' variant='outline' onClick={onCancel}>
            Откажи
          </Button>
        )}
        <Button type='submit' form='passport-form' disabled={isLoading}>
          {isLoading && <Spinner />}
          {isEditMode ? 'Запази промените' : 'Създай'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function PassportFormSkeleton() {
  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <Skeleton className='h-8 w-64' />
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex gap-2 justify-end'>
        <Skeleton className='h-10 w-20' />
        <Skeleton className='h-10 w-32' />
      </CardFooter>
    </Card>
  )
}
