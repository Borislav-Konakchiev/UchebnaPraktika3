import { useNavigate, useSearchParams, Link } from 'react-router'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import { Skeleton } from '~/components/ui/skeleton'
import type {
  ItemsPerPage,
  PaginatedData,
  PaginatedDataRequestParams,
  PaginatedTableColumn,
} from '~/models/paginated-data/paginated-data.models'
import { ITEMS_PER_PAGE } from '~/models/paginated-data/paginated-data.constants'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { useDebounce } from '~/lib/hooks/use-debounce.hook'

type PaginatedTableProps<T> = {
  data: PaginatedData<T>
  columns: PaginatedTableColumn<T>[]
  isSearchable?: boolean
  searchPlaceholder?: string
  getRowLink?: (item: T) => string
}

export function PaginatedTable<T extends Record<string, any>>({
  data,
  columns,
  isSearchable = false,
  searchPlaceholder = 'Търсене...',
  getRowLink,
}: PaginatedTableProps<T>) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const currentPage = data.currentPage
  const totalPages = data.totalPages
  const size = data.size

  const filteredItems = useMemo(() => {
    if (!isSearchable || !searchQuery.trim()) {
      return data.items
    }

    const query = searchQuery.toLowerCase()
    return data.items.filter((item) => {
      return columns.some((column) => {
        if (column.searchable === false) return false

        const value = item[column.key]

        if (value == null) return false

        return String(value).toLowerCase().includes(query)
      })
    })
  }, [data.items, searchQuery, columns, isSearchable])

  const updateSearchParams = useCallback(
    (updates: PaginatedDataRequestParams) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value))
        } else {
          params.delete(key)
        }
      })
      navigate(`?${params.toString()}`, { replace: true })
    },
    [searchParams, navigate]
  )

  const handleSizeChange = (newSize: string) => {
    updateSearchParams({ size: Number(newSize) as ItemsPerPage, page: 1 })
  }

  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    if (debouncedSearchQuery !== currentSearch) {
      updateSearchParams({ search: debouncedSearchQuery, page: 1 })
    }
  }, [debouncedSearchQuery, searchParams, updateSearchParams])

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 4

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 3) {
        for (let i = 2; i <= maxVisible; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push('ellipsis')
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 gap-4'>
        <div className='flex-1 max-w-xs'>
          {isSearchable && (
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full'
            />
          )}
        </div>
        <div className='flex items-center gap-2'>
          <Label htmlFor='items-per-page' className='whitespace-nowrap'>
            Резултати на страница:
          </Label>
          <Select value={String(size)} onValueChange={handleSizeChange}>
            <SelectTrigger id='items-per-page' className='w-[80px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE.map((itemCount) => (
                <SelectItem key={itemCount} value={String(itemCount)}>
                  {itemCount}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    Няма намерени резултати.
                  </TableCell>
                </TableRow>
              )}

              {filteredItems.length > 0 &&
                filteredItems.map((item, rowIndex) => {
                  const rowLink = getRowLink?.(item)

                  return (
                    <TableRow
                      key={rowIndex}
                      className={rowLink ? 'cursor-pointer' : undefined}
                      onClick={rowLink ? () => navigate(rowLink) : undefined}
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.cell
                            ? column.cell(item)
                            : String(item[column.key] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className='flex items-center justify-between border-t'>
          <div className='flex-1 text-sm text-muted-foreground whitespace-nowrap'>
            Общо {data.totalItems} резултата
          </div>
          <div className='flex-1 flex justify-center'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    to={
                      currentPage > 1
                        ? `?${new URLSearchParams({
                            ...Object.fromEntries(searchParams),
                            page: String(currentPage - 1),
                          }).toString()}`
                        : '#'
                    }
                    onClick={
                      currentPage <= 1 ? (e) => e.preventDefault() : undefined
                    }
                    className={
                      currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : undefined
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        to={`?${new URLSearchParams({
                          ...Object.fromEntries(searchParams),
                          page: String(page),
                        }).toString()}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    to={
                      currentPage < totalPages
                        ? `?${new URLSearchParams({
                            ...Object.fromEntries(searchParams),
                            page: String(currentPage + 1),
                          }).toString()}`
                        : '#'
                    }
                    onClick={
                      currentPage >= totalPages
                        ? (e) => e.preventDefault()
                        : undefined
                    }
                    className={
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className='flex-1' />
        </CardFooter>
      )}
    </Card>
  )
}

export function PaginatedTableSkeleton({
  columns = 5,
  rows = 10,
}: {
  columns?: number
  rows?: number
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 gap-4'>
        <Skeleton className='h-9 w-full max-w-xs' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-9 w-[80px]' />
        </div>
      </CardHeader>

      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: columns }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className='h-4 w-20' />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className='h-4 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className='flex items-center justify-between border-t'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-9 w-80' />
      </CardFooter>
    </Card>
  )
}
