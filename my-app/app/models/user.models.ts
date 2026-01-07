import type { PaginatedData } from "./paginated-data/paginated-data.models"

export const userRoles = ['ADMIN', 'USER'] as const
export type UserRole = (typeof userRoles)[number]

export type User = {
    id: string
    email: string
    fullName: string
    address: string
    phone: string
    role: UserRole
    // devices: Device[]
}

export type UsersIndexResponse = PaginatedData<Omit<User, 'role'>>
