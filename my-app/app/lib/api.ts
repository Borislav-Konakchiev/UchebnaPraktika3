import type { FetchMethod } from '~/models/fetch/fetch.models'
import { UnauthorizedError } from '~/models/response-errors/unauthorized-error'
export async function fetchApi<TData = unknown>(
input: URL | RequestInfo,
method: FetchMethod = 'GET',
token: string | null,
body?: Record<string, unknown>,
init?: RequestInit | undefined
) {
const internalInit: RequestInit = {
...(init ?? {}),
headers: {
'Content-Type': 'application/json',
...(token && { Authorization: `Bearer ${token}` }),
...(init?.headers ?? {}),
},
method,
}
if (body) {
internalInit.body = JSON.stringify(body)
}
const response = await fetch(input, internalInit)
if (response.status === 401) {
throw new UnauthorizedError()
}
const data = (await response.json()) as TData
if (!response.ok) {
throw new Error('Request failed')
}
return data
}
