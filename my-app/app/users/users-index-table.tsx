import {
    PaginatedTable,
    PaginatedTableSkeleton,
} from '~/components/core/paginated-table'
import type { PaginatedTableColumn } from '~/models/paginated-data/paginated-data.models'
import type { User, UsersIndexResponse } from '~/models/user.models'
type UsersIndexTableProps = {
    data: UsersIndexResponse
}
const columns: PaginatedTableColumn<Omit<User, 'role'>>[] = [
    {
        key: 'fullName',
        header: 'Пълно име',
    },
    {
        key: 'email',
        header: 'Имейл',
    },
    {
        key: 'phone',
        header: 'Телефон',
    },
    {
        key: 'address',
        header: 'Адрес',
    },
]
export function UsersIndexTable({ data }: UsersIndexTableProps) {
     return <PaginatedTable data={data} columns={columns} isSearchable  />
}
export function UsersIndexTableSkeleton() {
    return <PaginatedTableSkeleton columns={columns.length} rows={10}
    />
}
