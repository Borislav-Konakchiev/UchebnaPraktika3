import { useMemo } from 'react'
import { Link, useRevalidator } from 'react-router'
import {
  PaginatedTable,
  PaginatedTableSkeleton,
} from '~/components/core/paginated-table'
import type { PaginatedTableColumn } from '~/models/paginated-data/paginated-data.models'
import type {
  Passport,
  PassportsIndexResponse,
} from '~/models/passports.models'
import { Button } from '~/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { DeletePassportButton } from '~/components/passports/delete-passport-button'

type PassportsIndexTableProps = {
  data: PassportsIndexResponse
}

export function PassportsIndexTable({ data }: PassportsIndexTableProps) {
  const revalidator = useRevalidator()
  const columns: PaginatedTableColumn<Passport>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Име',
      },
      {
        key: 'model',
        header: 'Модел',
      },
      {
        key: 'serialPrefix',
        header: 'Сериен префикс',
      },
      {
        key: 'fromSerialNumber',
        header: 'От сериен номер',
      },
      {
        key: 'toSerialNumber',
        header: 'До сериен номер',
      },
      {
        key: 'warrantyMonths',
        header: 'Гаранция (месеци)',
      },
      {
        key: 'actions',
        header: 'Действия',
        cell: (passport) => (
          <div className='flex gap-1'>
            <Button
              size='icon-sm'
              variant='default'
              className='bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700'
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/passports/${passport.id}/edit`}>
                <PencilIcon />
              </Link>
            </Button>
            <div onClick={(e) => e.stopPropagation()}>
              <DeletePassportButton
                passport={passport}
                size='icon-sm'
                showLabel={false}
                onDeleteSuccess={() => revalidator.revalidate()}
              />
            </div>
          </div>
        ),
      },
    ],
    [revalidator]
  )

  function getRowLink(passport: Passport) {
    return `/passports/${passport.id}`
  }

  return (
    <PaginatedTable data={data} columns={columns} getRowLink={getRowLink} />
  )
}

export function PassportsIndexTableSkeleton() {
  return <PaginatedTableSkeleton columns={7} rows={10} />
}
