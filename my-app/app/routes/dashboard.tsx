import { DashboardIndex } from 'dashboard/dashboard-index'
import type { Route } from './+types/dashboard'
export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'React Router App' },
        { name: 'description', content: 'Dashboard' },
    ]
}
export default function Dashboard() {
    return <DashboardIndex />
}
