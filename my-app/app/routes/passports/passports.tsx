import { Link, redirect, useLoaderData } from 'react-router'
import { fetchApi } from '~/lib/api'
import {
  buildPaginatedQueryString,
  clearAuthFromSession,
  getApiUrl,
  getAuthTokenFromSession,
} from '~/lib/utils'
import { UnauthorizedError } from '~/models/response-errors/unauthorized-error'
import type { ReactNode } from 'react'
import {
  PassportsIndexTable,
  PassportsIndexTableSkeleton,
} from '~/passports/passports-index-table'
import type { PassportsIndexResponse } from '~/models/passports.models'
import type { Route } from './+types/passports'
import { Button } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Паспорти' },
  ]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const token = getAuthTokenFromSession()

  const url = new URL(request.url)

  try {
    const response = await fetchApi<PassportsIndexResponse>(
      getApiUrl(`/passports?${buildPaginatedQueryString(url)}`),
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
    <PassportsPage>
      <PassportsIndexTableSkeleton />
    </PassportsPage>
  )
}

export default function Passports() {
  const loaderData = useLoaderData<typeof clientLoader>()

  return (
    <PassportsPage>
      <PassportsIndexTable data={loaderData} />
    </PassportsPage>
  )
}

type PassportsPageProps = {
  children?: ReactNode
}

function PassportsPage({ children }: PassportsPageProps) {
  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Паспорти</h1>
        <Button
          asChild
          className='bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
        >
          <Link to='/passports/create'>
            <PlusIcon />
            Създай паспорт
          </Link>
        </Button>
      </div>
      {children}
    </>
  )
}
