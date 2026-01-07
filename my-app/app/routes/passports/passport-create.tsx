import { PassportCreate } from '~/passports/passport-create'
import type { Route } from './+types/passport-create'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Създаване на паспорт' },
  ]
}

export default function PassportCreatePage() {
  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>Създаване на паспорт</h1>
      <PassportCreate />
    </>
  )
}
