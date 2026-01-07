import {
  clearAuthFromSession,
  getApiUrl,
  getAuthTokenFromSession,
} from '~/lib/utils'
import type { Route } from './+types/passport-edit'
import { fetchApi } from '~/lib/api'
import { UnauthorizedError } from '~/models/response-errors/unauthorized-error'
import { redirect, useLoaderData } from 'react-router'
import type { PassportDetailsResponse } from '~/models/passports.models'
import { PassportEdit, PassportEditSkeleton } from '~/passports/passport-edit'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Редактиране на паспорт' },
  ]
}

export async function clientLoader({
  params: { passportId },
}: Route.ClientLoaderArgs) {
  const token = getAuthTokenFromSession()

  try {
    const response = await fetchApi<PassportDetailsResponse>(
      getApiUrl(`/passports/${passportId}`),
      'GET',
      token
    )

    return response
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      clearAuthFromSession()

      throw redirect('/login')
    }

    throw error
  }
}

export function HydrateFallback() {
  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>Редактиране на паспорт</h1>
      <PassportEditSkeleton />
    </>
  )
}

export default function PassportEditPage() {
  const loaderData = useLoaderData<typeof clientLoader>()

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>Редактиране на паспорт</h1>
      <PassportEdit passport={loaderData} />
    </>
  )
}
