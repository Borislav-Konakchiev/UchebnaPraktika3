import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { authTokenSessionKey, authUserSessionKey } from "~/models/auth/auth.constants"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(path: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not defined')
  }
  
  return `${baseUrl}${path}`
}

export function getAuthTokenFromSession(): string | null {
return sessionStorage.getItem(authTokenSessionKey)
}
export function clearAuthFromSession() {
sessionStorage.removeItem(authTokenSessionKey)
sessionStorage.removeItem(authUserSessionKey)
}
export function buildPaginatedQueryString(
searchParams: URLSearchParams | URL,
defaults?: { page?: string; size?: string }
): string {
const params =
searchParams instanceof URL ? searchParams.searchParams :
searchParams
const page = params.get('page') ?? defaults?.page ?? '1'
const size = params.get('size') ?? defaults?.size ?? '10'
const search = params.get('search') || ''
const queryParts = [`page=${page}`, `size=${size}`]
if (search) {
queryParts.push(`searchBy=${encodeURIComponent(search)}`)
}
return queryParts.join('&')
}