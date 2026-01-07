import { buildPaginatedQueryString, clearAuthFromSession, getApiUrl, getAuthTokenFromSession } from '~/lib/utils'
import type { Route } from './+types/users' 
import type { ReactNode } from 'react' 
import { fetchApi } from '~/lib/api'
import type { UsersIndexResponse } from '~/models/user.models'
import { UnauthorizedError } from '~/models/response-errors/unauthorized-error'
import { redirect, useLoaderData } from 'react-router'
import { UsersIndexTable, UsersIndexTableSkeleton } from '~/users/users-index-table'
 
export function meta({}: Route.MetaArgs) { 
  return [ 
    { title: 'React Router App' }, 
    { name: 'description', content: 'Users' }, 
  ] 
} 
 
export default function Users() { 
const loaderData = useLoaderData<typeof clientLoader>() 
return ( 
<UsersPage> 
<UsersIndexTable data={loaderData} /> 
</UsersPage> 
) 
} 
 
type UsersPageProps = { 
  children?: ReactNode 
} 
 
function UsersPage({ children }: UsersPageProps) { 
  return ( 
    <> 
      <h1 className='text-2xl font-bold mb-4'>Потребители</h1> 
      {children} 
    </> 
  ) 
} 

export async function clientLoader({ request }: 
Route.ClientLoaderArgs) { 
  const token = getAuthTokenFromSession() 
 
  const url = new URL(request.url) 
 
  try { 
    const response = await fetchApi<UsersIndexResponse>( 
      getApiUrl(`/users?${buildPaginatedQueryString(url)}`), 
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
    <UsersPage> 
      <UsersIndexTableSkeleton /> 
    </UsersPage> 
) 
} 