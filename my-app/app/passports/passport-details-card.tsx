import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { Link } from 'react-router'
import type { Passport } from '~/models/passports.models'
import { DeletePassportButton } from '~/components/passports/delete-passport-button'

export type PassportDetailsCardProps = {
  passport: Passport
}

export function PassportDetailsCard({ passport }: PassportDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{passport.name}</h2>
            <p className='text-muted-foreground'>Модел: {passport.model}</p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='default'
              className='bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700'
              asChild
            >
              <Link to={`/passports/${passport.id}/edit`}>
                <PencilIcon />
                Редактирай
              </Link>
            </Button>
            <DeletePassportButton passport={passport} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <Label className='text-muted-foreground'>Име</Label>
              <p className='text-lg font-medium'>{passport.name}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Модел</Label>
              <p className='text-lg font-medium'>{passport.model}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Серийна префикс</Label>
              <p className='text-lg font-medium'>{passport.serialPrefix}</p>
            </div>
          </div>
          <div className='space-y-4'>
            <div>
              <Label className='text-muted-foreground'>От сериен номер</Label>
              <p className='text-lg font-medium'>{passport.fromSerialNumber}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>До сериен номер</Label>
              <p className='text-lg font-medium'>{passport.toSerialNumber}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Гаранция (месеци)</Label>
              <p className='text-lg font-medium'>{passport.warrantyMonths}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PassportDetailsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-5 w-48' />
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-10 w-20' />
            <Skeleton className='h-10 w-20' />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-6 w-full' />
              </div>
            ))}
          </div>
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-6 w-full' />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
