import { useNavigate, useParams } from 'react-router'
import {
  PassportForm,
  PassportFormSkeleton,
} from '~/components/passports/passport-form'
import useFetch from '~/lib/hooks/use-fetch.hook'
import { getApiUrl } from '~/lib/utils'
import type { Passport, PassportFormData } from '~/models/passports.models'

export type PassportEditProps = {
  passport: Passport
}

export function PassportEdit({ passport }: PassportEditProps) {
  const navigate = useNavigate()
  const { fetch, isLoadingRef, error } = useFetch<Passport>()

  const handleSubmit = async (data: PassportFormData) => {
    if (isLoadingRef.current) {
      return
    }

    try {
      const apiUrl = getApiUrl(`/passports/${passport.id}`)

      await fetch(apiUrl, 'PUT', data)

      navigate(`/passports/${passport.id}`, { replace: true })
    } catch (err) {
      console.error('Update passport error:', err)
    }
  }

  const handleCancel = () => {
    navigate(`/passports/${passport.id}`)
  }

  return (
    <PassportForm
      passport={passport}
      isLoading={isLoadingRef.current}
      error={error?.message}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export function PassportEditSkeleton() {
  return <PassportFormSkeleton />
}
