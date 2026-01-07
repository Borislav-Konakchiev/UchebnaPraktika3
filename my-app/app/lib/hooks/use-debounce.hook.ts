import { useEffect, useMemo, useState } from 'react'
import { data } from 'react-router'
export function useDebounce<T>(value: T, delay: number = 500): T {
const [debouncedValue, setDebouncedValue] = useState<T>(value)
useEffect(() => {
const timer = setTimeout(() => {
setDebouncedValue(value)
}, delay)
return () => {
clearTimeout(timer)
}
}, [value, delay])
return debouncedValue
}

