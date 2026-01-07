import type { ReactNode } from 'react'
import type { ITEMS_PER_PAGE } from './paginated-data.constants'
export type PaginatedData<T> = {
currentPage: number
totalPages: number
size: number
totalItems: number
items: T[]
}
export type PaginatedTableColumn<T> = 
  | { 
      key: keyof T 
      header: string 
      cell?: (item: T) => ReactNode 
      searchable?: boolean 
    } 
  | { 
      key: 'actions' 
      header: string 
      cell: (item: T) => ReactNode 
      searchable?: never 
    } 
    
export type ItemsPerPage = (typeof ITEMS_PER_PAGE)[number]
export type PaginatedDataRequestParams = {
page?: number
size?: ItemsPerPage
search?: string
}