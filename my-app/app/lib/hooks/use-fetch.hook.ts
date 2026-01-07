import { useCallback, useEffect, useRef, useState } from 'react' 
import { useAuth } from '~/components/auth/auth-provider' 
import { fetchApi } from '../api' 
import { ResponseError } from '~/models/response-errors/response-error' 
import { useNavigate } from 'react-router' 
import type { FetchMethod } from '~/models/fetch/fetch.models' 
 
export default function useFetch<TData = unknown>() { 
  const navigate = useNavigate() 
 
  const abortControllerRef = useRef<AbortController | null>(null) 
  const isLoadingRef = useRef(false) 
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState<ResponseError | null>(null) 
  const [response, setResponse] = useState<TData | null>(null) 
  const { token } = useAuth() 
 
  const internalFetch = useCallback( 
    async ( 
      input: URL | RequestInfo, 
      method: FetchMethod = 'GET', 
      body?: Record<string, unknown>, 
      init?: RequestInit | undefined 
    ) => { 
      isLoadingRef.current = true 
      setIsLoading(true) 
      setError(null) 
      setResponse(null) 
      abortControllerRef.current = new AbortController() 
 
      try { 
        const data = await fetchApi<TData>(input, method, token, 
body, { 
          ...(init ?? {}), 
          signal: abortControllerRef.current?.signal, 
        }) 
 
        setResponse(data) 
        return data 
      } catch (error) { 
        if (error instanceof ResponseError) { 
          if (error.getErrorType() === 'UNAUTHORIZED') { 
            navigate('/login') 
          } 
 
          setError(error) 
          throw error 
        } 
 
        setError(new ResponseError()) 
        throw error 
      } finally { 
        isLoadingRef.current = false 
        setIsLoading(false) 
        abortControllerRef.current = null 
      } 
    }, 
    [token] 
  ) 
 
  useEffect(function componentDidMount() { 
    return function componentWillUnmount() { 
      abortControllerRef.current?.abort?.() 
    } 
  }, []) 
 
  return { fetch: internalFetch, isLoading, isLoadingRef, error, 
response } 
}